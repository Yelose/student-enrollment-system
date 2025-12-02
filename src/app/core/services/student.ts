import { Injectable, inject, signal, effect } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';

import { StudentInterface } from '../models/student/student-interface';
import { DateConvertionService } from '../../shared/services/date-convertion';
import { LoaderService } from '../../shared/services/loader-service';
import { SnackBarService } from '../../shared/services/snack-bar-service';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private firestore = inject(Firestore);
  private dateService = inject(DateConvertionService);
  private loader = inject(LoaderService);
  private snackbar = inject(SnackBarService);

  // Colección fija "dicampus-students"
  private studentsCollection = collection(this.firestore, 'dicampus-students');

  // Signal reactiva
  readonly studentsSignal = signal<StudentInterface[]>([]);

  constructor() {
    effect((onCleanup) => {
      this.loader.show();
      let first = true;

      const sub = collectionData(this.studentsCollection, {
        idField: 'id',
      }).subscribe({
        next: (raw) => {
          const parsed = (raw as StudentInterface[]).map(s =>
            this.parseStudent(s)
          );

          this.studentsSignal.set(parsed);

          if (first) {
            this.loader.hide();
            first = false;
          }
        },
        error: () => {
          this.loader.hide();
        },
      });

      onCleanup(() => sub.unsubscribe());
    });
  }

  // ------------------------------------------
  // 🔄 Parseo (Firestore → Modelo)
  // ------------------------------------------
  private parseStudent(s: StudentInterface): StudentInterface {
    return {
      ...s,
      createdAt: this.dateService.toValidDate(s.createdAt),
      updatedAt: this.dateService.toValidDate(s.updatedAt),
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
  private prepForFirestore(student: Partial<StudentInterface>) {
    return this.stripUndefined({
      ...student,
      createdAt: this.dateService.toValidDate(student.createdAt ?? null),
      updatedAt: this.dateService.toValidDate(student.updatedAt ?? null),
    });
  }

  // ------------------------------------------
  // 🟢 Crear
  // ------------------------------------------
  addStudent(
    student: Omit<StudentInterface, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    const now = new Date();

    const data = {
      ...student,
      createdAt: now,
      updatedAt: now,
    };

    const prepared = this.prepForFirestore(data);

    this.loader.show();

    return addDoc(this.studentsCollection, prepared)
      .then(() => {
        this.snackbar.show('Alumno añadido con éxito', 'success');
      })
      .catch((err) => {
        console.error(err);
        this.snackbar.show('No se pudo añadir el alumno', 'error');
        throw err;
      })
      .finally(() => this.loader.hide());
  }

  // ------------------------------------------
  // 🟡 Actualizar
  // ------------------------------------------
  updateStudent(id: string, updates: Partial<StudentInterface>) {
    const ref = doc(this.firestore, `dicampus-students/${id}`);

    const prepared = this.prepForFirestore({
      ...updates,
      updatedAt: new Date(),
    });

    this.loader.show();

    return updateDoc(ref, prepared)
      .then(() => this.snackbar.show('Alumno actualizado', 'success'))
      .catch((err) => {
        console.error(err);
        this.snackbar.show('Error al actualizar alumno', 'error');
        throw err;
      })
      .finally(() => this.loader.hide());
  }

  // ------------------------------------------
  // 🔴 Eliminar
  // ------------------------------------------
  deleteStudent(id: string) {
    const ref = doc(this.firestore, `dicampus-students/${id}`);

    this.loader.show();

    return deleteDoc(ref)
      .then(() => this.snackbar.show('Alumno eliminado', 'success'))
      .catch((err) => {
        console.error(err);
        this.snackbar.show('Error al eliminar alumno', 'error');
      })
      .finally(() => this.loader.hide());
  }
}
