import { Injectable, effect, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
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

  // Colección fija "courses"
  private coursesCollection = collection(this.firestore, 'courses');

  // Estado reactivo
  readonly coursesSignal = signal<CourseInterface[]>([]);
  readonly selectedCourseSignal = signal<CourseInterface | null>(null);

  // Opcional: exposición como Observable tipado (#80)
  readonly courses$ = toObservable(this.coursesSignal);
  readonly selectedCourse$ = toObservable(this.selectedCourseSignal);

  constructor() {
    effect((onCleanup) => {
      this.loader.show();
      let first = true;

      const sub = collectionData(this.coursesCollection, {
        idField: 'id',
      }).subscribe({
        next: (raw) => {
          const parsed = (raw as CourseInterface[]).map((c) =>
            this.parseCourse(c)
          );

          this.coursesSignal.set(parsed);

          // Mantener coherente el curso seleccionado
          const selected = this.selectedCourseSignal();
          if (selected) {
            const updated = parsed.find((co) => co.id === selected.id) ?? null;
            this.selectedCourseSignal.set(updated);
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

  // Helper por id desde el signal (sin ir a Firestore)
  getCourseById(id: string): CourseInterface | undefined {
    return this.coursesSignal().find((c) => c.id === id);
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
  // 🔧 Limpiar valores undefined (sin any)
  // ------------------------------------------
  private stripUndefined<T extends Record<string, unknown>>(obj: T): T {
    const out: Partial<T> = {};
    for (const key of Object.keys(obj) as (keyof T)[]) {
      const value = obj[key];
      if (value !== undefined) {
        out[key] = value;
      }
    }
    return out as T;
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
    course: Omit<CourseInterface, 'id' | 'createdAt' | 'updatedAt'>
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
    const ref = doc(this.firestore, `courses/${id}`);

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
    const ref = doc(this.firestore, `courses/${id}`);

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
