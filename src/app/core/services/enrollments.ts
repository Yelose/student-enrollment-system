// core/services/enrollments.ts
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
import { EnrollmentInterface } from '../models/enrollment/enrollment-interface';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentsService {
  private firestore = inject(Firestore);
  private dateService = inject(DateConvertionService);
  private loader = inject(LoaderService);
  private snackbar = inject(SnackBarService);

  // Colección fija "dicampus-enrollments"
  private enrollmentsCollection = collection(
    this.firestore,
    'dicampus-enrollments',
  );

  // Estado reactivo en memoria
  readonly enrollmentsSignal = signal<EnrollmentInterface[]>([]);
  readonly selectedEnrollmentSignal = signal<EnrollmentInterface | null>(null);

  constructor() {
    effect((onCleanup) => {
      this.loader.show();
      let first = true;

      const sub = collectionData(this.enrollmentsCollection, {
        idField: 'id',
      }).subscribe({
        next: (raw) => {
          const parsed = (raw as EnrollmentInterface[]).map((e) =>
            this.parseEnrollment(e),
          );

          this.enrollmentsSignal.set(parsed);

          // Mantener coherente la matrícula seleccionada
          const selected = this.selectedEnrollmentSignal();
          if (selected) {
            const stillExists = parsed.some((enr) => enr.id === selected.id);
            if (!stillExists) {
              this.selectedEnrollmentSignal.set(null);
            }
          }

          if (first) {
            this.loader.hide();
            first = false;
          }
        },
        error: () => {
          this.loader.hide();
          this.snackbar.show(
            'No se pudieron cargar las matrículas',
            'error',
          );
        },
      });

      onCleanup(() => sub.unsubscribe());
    });
  }

  // ------------------------------------------
  // 🔹 Setter para la matrícula seleccionada
  // ------------------------------------------
  setSelectedEnrollment(enrollment: EnrollmentInterface | null): void {
    this.selectedEnrollmentSignal.set(enrollment);
  }

  // ------------------------------------------
  // 🔄 Parseo (Firestore → Modelo)
  // ------------------------------------------
  private parseEnrollment(e: EnrollmentInterface): EnrollmentInterface {
    return {
      ...e,
      startDate: this.dateService.toValidDate(e.startDate),
      endDate: this.dateService.toValidDate(e.endDate),
      createdAt: this.dateService.toValidDate(e.createdAt),
      updatedAt: this.dateService.toValidDate(e.updatedAt),
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
  private prepForFirestore(
    enrollment: Partial<EnrollmentInterface>,
  ) {
    return this.stripUndefined({
      ...enrollment,
      startDate: this.dateService.toValidDate(enrollment.startDate ?? null),
      endDate: this.dateService.toValidDate(enrollment.endDate ?? null),
      createdAt: this.dateService.toValidDate(enrollment.createdAt ?? null),
      updatedAt: this.dateService.toValidDate(enrollment.updatedAt ?? null),
    });
  }

  // ------------------------------------------
  // 🟢 Crear matrícula
  // ------------------------------------------
  addEnrollment(
    enrollment: Omit<
      EnrollmentInterface,
      'id' | 'createdAt' | 'updatedAt'
    >,
  ) {
    const now = new Date();

    const data: Partial<EnrollmentInterface> = {
      ...enrollment,
      createdAt: now,
      updatedAt: now,
    };

    const prepared = this.prepForFirestore(data);

    this.loader.show();

    return addDoc(this.enrollmentsCollection, prepared)
      .then(() => {
        this.snackbar.show('Matrícula creada con éxito', 'success');
      })
      .catch((err) => {
        console.error(err);
        this.snackbar.show('No se pudo crear la matrícula', 'error');
        throw err;
      })
      .finally(() => this.loader.hide());
  }

  // ------------------------------------------
  // 🟡 Actualizar matrícula
  // ------------------------------------------
  updateEnrollment(id: string, updates: Partial<EnrollmentInterface>) {
    const ref = doc(this.firestore, `dicampus-enrollments/${id}`);

    const prepared = this.prepForFirestore({
      ...updates,
      updatedAt: new Date(),
    });

    this.loader.show();

    return updateDoc(ref, prepared)
      .then(() => this.snackbar.show('Matrícula actualizada', 'success'))
      .catch((err) => {
        console.error(err);
        this.snackbar.show(
          'Error al actualizar matrícula',
          'error',
        );
        throw err;
      })
      .finally(() => this.loader.hide());
  }

  // ------------------------------------------
  // 🔴 Eliminar matrícula
  // ------------------------------------------
  deleteEnrollment(id: string) {
    const ref = doc(this.firestore, `dicampus-enrollments/${id}`);

    this.loader.show();

    return deleteDoc(ref)
      .then(() => this.snackbar.show('Matrícula eliminada', 'success'))
      .catch((err) => {
        console.error(err);
        this.snackbar.show(
          'Error al eliminar matrícula',
          'error',
        );
      })
      .finally(() => this.loader.hide());
  }
}
