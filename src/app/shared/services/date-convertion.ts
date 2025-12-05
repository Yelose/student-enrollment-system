import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateConvertionService {
  /** Devuelve Date válida o null. Nunca "Invalid Date". */
  toValidDate(input: any): Date | null {
    if (input == null || input === '') return null;

    // Timestamp de Firestore (toDate)
    if (typeof input === 'object' && typeof input.toDate === 'function') {
      return this.toValidDate(input.toDate());
    }

    if (input instanceof Date) {
      return isNaN(input.getTime()) ? null : input;
    }

    if (typeof input === 'number') {
      const d = new Date(input);
      return isNaN(d.getTime()) ? null : d;
    }

    if (typeof input === 'string') {
      const d = new Date(input);
      return isNaN(d.getTime()) ? null : d;
    }

    // Timestamp plano { seconds: number }
    if (typeof input === 'object' && 'seconds' in input && typeof input.seconds === 'number') {
      const d = new Date(input.seconds * 1000);
      return isNaN(d.getTime()) ? null : d;
    }

    return null;
  }

  /** dd/MM/yyyy para mostrar en tablas, detalles, etc. */
  toShortDate(input: any): string {
    const d = this.toValidDate(input);
    if (!d) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /** "YYYY-MM-DD" para inputs tipo date / mat-datepicker */
  toIsoInputDate(input: any): string {
    const d = this.toValidDate(input);
    if (!d) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
