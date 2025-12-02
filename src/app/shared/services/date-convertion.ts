import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateConvertionService {
   /** Devuelve Date válida o null. Nunca "Invalid Date". */
   toValidDate(input: any): Date | null {
    if (input == null || input === '') return null;

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

    if (typeof input === 'object' && 'seconds' in input && typeof input.seconds === 'number') {
      const d = new Date(input.seconds * 1000);
      return isNaN(d.getTime()) ? null : d;
    }

    return null;
  }

  toShortDate(input: any): string {
    const d = this.toValidDate(input);
    if (!d) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } 
}
