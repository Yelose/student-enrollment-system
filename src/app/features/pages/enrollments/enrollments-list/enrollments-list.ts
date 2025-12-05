import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';

import { EnrollmentsService } from '../../../../core/services/enrollments';
import { EnrollmentInterface } from '../../../../core/models/enrollment/enrollment-interface';
import {
  ENROLLMENT_STATUS_OPTIONS,
} from '../../../../core/models/enrollment/enrollment-status.constant';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { DateConvertionService } from '../../../../shared/services/date-convertion';

@Component({
  selector: 'app-enrollments-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    ConfirmDialogComponent,
  ],
  templateUrl: './enrollments-list.html',
  styleUrl: './enrollments-list.scss',
})
export class EnrollmentsList {
  private enrollmentsService = inject(EnrollmentsService);
  private dialog = inject(MatDialog);
  private dateService = inject(DateConvertionService);
  private router = inject(Router);

  /** Lista reactiva original (sin filtro) */
  readonly enrollments = this.enrollmentsService.enrollmentsSignal;

  /** Columnas principales visibles */
  readonly displayedColumns = [
    'student',
    'course',
    'status',
    'startDate',
    'endDate',
    'expand',
  ] as const;

  /** Fila secundaria (detalle expandido) */
  readonly detailColumns = ['expandedDetail'] as const;

  /** Id de la fila expandida */
  readonly expandedId = signal<string | null>(null);

  /** Filtros reactivos */
  private readonly studentFilter = signal<string>('');
  private readonly courseFilter = signal<string>('');
  private readonly textFilter = signal<string>('');

  /**
   * Opciones del autocomplete de estudiante,
   * deducidas de las matrículas actuales (únicas, ordenadas).
   */
  readonly studentOptions = computed(() => {
    const data = this.enrollments();
    const map = new Map<string, { display: string }>();

    for (const e of data) {
      const display = `${e.studentName} – ${e.studentEmail}`;
      if (!map.has(display)) {
        map.set(display, { display });
      }
    }

    return Array.from(map.values()).sort((a, b) =>
      a.display.localeCompare(b.display),
    );
  });

  /**
   * Opciones del autocomplete de curso,
   * deducidas de las matrículas actuales (únicas, ordenadas).
   */
  readonly courseOptions = computed(() => {
    const data = this.enrollments();
    const map = new Map<string, { display: string }>();

    for (const e of data) {
      const display = `${e.courseName} (${e.courseCode})`;
      if (!map.has(display)) {
        map.set(display, { display });
      }
    }

    return Array.from(map.values()).sort((a, b) =>
      a.display.localeCompare(b.display),
    );
  });

  /** Lista filtrada para la tabla */
  readonly filteredEnrollments = computed(() => {
    const studentTerm = this.studentFilter().trim().toLowerCase();
    const courseTerm = this.courseFilter().trim().toLowerCase();
    const textTerm = this.textFilter().trim().toLowerCase();

    const data = this.enrollments();

    if (!studentTerm && !courseTerm && !textTerm) {
      return data;
    }

    return data.filter((e) => {
      const studentValues = [
        e.studentName,
        e.studentEmail,
      ].filter(Boolean) as string[];

      const courseValues = [
        e.courseName,
        e.courseCode,
      ].filter(Boolean) as string[];

      const generalValues = [
        e.studentName,
        e.studentEmail,
        e.courseName,
        e.courseCode,
        this.getStatusLabel(e.status),
      ].filter(Boolean) as string[];

      const matchesStudent = !studentTerm
        || studentValues.some((v) =>
          v.toLowerCase().includes(studentTerm),
        );

      const matchesCourse = !courseTerm
        || courseValues.some((v) =>
          v.toLowerCase().includes(courseTerm),
        );

      const matchesText = !textTerm
        || generalValues.some((v) =>
          v.toLowerCase().includes(textTerm),
        );

      return matchesStudent && matchesCourse && matchesText;
    });
  });

  toggleExpand(enrollment: EnrollmentInterface): void {
    this.expandedId.update((current) =>
      current === enrollment.id ? null : enrollment.id,
    );
  }

  onStudentFilterChange(term: string): void {
    this.studentFilter.set(term ?? '');
  }

  onCourseFilterChange(term: string): void {
    this.courseFilter.set(term ?? '');
  }

  onTextFilterChange(term: string): void {
    this.textFilter.set(term ?? '');
  }

  confirmDelete(enrollment: EnrollmentInterface): void {
    const data: ConfirmDialogData = {
      title: 'Eliminar matrícula',
      message: `¿Seguro que quieres eliminar la matrícula de ${enrollment.studentName} en "${enrollment.courseName}"?`,
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
    };

    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '320px',
      data,
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.enrollmentsService.deleteEnrollment(enrollment.id);
    });
  }

  isExpanded = (_index: number, row: EnrollmentInterface) =>
    this.expandedId() === row.id;

  toShortDate(date: Date | null | undefined): string {
    return this.dateService.toShortDate(date);
  }

  getStatusLabel(status: EnrollmentInterface['status']): string {
    const found = ENROLLMENT_STATUS_OPTIONS.find(
      (opt) => opt.value === status,
    );
    return found?.label ?? status;
  }

  editEnrollment(enrollment: EnrollmentInterface): void {
    this.enrollmentsService.setSelectedEnrollment(enrollment);
    this.router.navigate(['/enrollments-form']);
  }
  goToAddEnrollment(){
    this.enrollmentsService.setSelectedEnrollment(null)
    this.router.navigate(["/enrollments-form"])
  }
}
