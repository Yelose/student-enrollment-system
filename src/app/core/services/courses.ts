import { Injectable, effect, inject, signal } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';

import { DateConvertionService } from '../../shared/services/date-convertion';
import { LoaderService } from '../../shared/services/loader-service';
import { SnackBarService } from '../../shared/services/snack-bar-service';
import { CourseInterface } from '../models/course/course-interface';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private firestore = inject(Firestore);
  private dateService = inject(DateConvertionService);
  private loader = inject(LoaderService);
  private snackbar = inject(SnackBarService);

  // Colección fija "dicampus-courses" (coincide con las reglas de Firestore)
  private coursesCollection = collection(this.firestore, 'dicampus-courses');

  // Estado reactivo en memoria
  readonly coursesSignal = signal<CourseInterface[]>([]);
  readonly selectedCourseSignal = signal<CourseInterface | null>(null);

  constructor() {
    effect((onCleanup) => {
      this.loader.show();
      let first = true;

      const sub = collectionData(this.coursesCollection, {
        idField: 'id',
      }).subscribe({
        next: (raw) => {
          const parsed = (raw as CourseInterface[]).map((c) =>
            this.parseCourse(c),
          );

          this.coursesSignal.set(parsed);

          // Mantener coherente el curso seleccionado
          const selected = this.selectedCourseSignal();
          if (selected) {
            const stillExists = parsed.some((co) => co.id === selected.id)
            if (!stillExists) {
              this.selectedCourseSignal.set(null)
            }
          }

          if (first) {
            this.loader.hide();
            first = false;
          }
        },
        error: () => {
          this.loader.hide();
          this.snackbar.show('No se pudieron cargar los cursos', 'error');
        },
      });

      onCleanup(() => sub.unsubscribe());
    });
  }

  // ------------------------------------------
  // 🔹 Setter explícito para el curso seleccionado
  // ------------------------------------------
  setSelectedCourse(course: CourseInterface | null): void {
    this.selectedCourseSignal.set(course);
  }

  // ------------------------------------------
  // 🔄 Parseo (Firestore → Modelo)
  // ------------------------------------------
  private parseCourse(c: CourseInterface): CourseInterface {
    return {
      ...c,
      startDate: this.dateService.toValidDate(c.startDate),
      endDate: this.dateService.toValidDate(c.endDate),
      createdAt: this.dateService.toValidDate(c.createdAt),
      updatedAt: this.dateService.toValidDate(c.updatedAt),
    };
  }

  // ------------------------------------------
  // 🔧 Limpiar valores undefined 
  // ------------------------------------------
  private stripUndefined<T extends Record<string, any>>(obj: T): T {
    const out: any = {};
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (v !== undefined) out[k] = v;
    }
    return out;
  }

  // ------------------------------------------
  // 🔄 Preparar para Firestore (Modelo → Firestore)
  // ------------------------------------------
  private prepForFirestore(course: Partial<CourseInterface>) {
    return this.stripUndefined({
      ...course,
      startDate: this.dateService.toValidDate(course.startDate ?? null),
      endDate: this.dateService.toValidDate(course.endDate ?? null),
      createdAt: this.dateService.toValidDate(course.createdAt ?? null),
      updatedAt: this.dateService.toValidDate(course.updatedAt ?? null),
    });
  }

  // ------------------------------------------
  // 🟢 Crear curso
  // ------------------------------------------
  addCourse(
    course: Omit<CourseInterface, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    const now = new Date();

    const data: Partial<CourseInterface> = {
      ...course,
      createdAt: now,
      updatedAt: now,
    };

    const prepared = this.prepForFirestore(data);

    this.loader.show();

    return addDoc(this.coursesCollection, prepared)
      .then(() => {
        this.snackbar.show('Curso creado con éxito', 'success');
      })
      .catch((err) => {
        console.error(err);
        this.snackbar.show('No se pudo crear el curso', 'error');
        throw err;
      })
      .finally(() => this.loader.hide());
  }

  // ------------------------------------------
  // 🟡 Actualizar curso
  // ------------------------------------------
  updateCourse(id: string, updates: Partial<CourseInterface>) {
    const ref = doc(this.firestore, `dicampus-courses/${id}`);

    const prepared = this.prepForFirestore({
      ...updates,
      updatedAt: new Date(),
    });

    this.loader.show();

    return updateDoc(ref, prepared)
      .then(() => this.snackbar.show('Curso actualizado', 'success'))
      .catch((err) => {
        console.error(err);
        this.snackbar.show('Error al actualizar curso', 'error');
        throw err;
      })
      .finally(() => this.loader.hide());
  }

  // ------------------------------------------
  // 🔴 Eliminar curso
  // ------------------------------------------
  deleteCourse(id: string) {
    const ref = doc(this.firestore, `dicampus-courses/${id}`);

    this.loader.show();

    return deleteDoc(ref)
      .then(() => this.snackbar.show('Curso eliminado', 'success'))
      .catch((err) => {
        console.error(err);
        this.snackbar.show('Error al eliminar curso', 'error');
      })
      .finally(() => this.loader.hide());
  }
}
