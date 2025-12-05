import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CourseInterface } from '../../../../core/models/course/course-interface';
import { CoursesService } from '../../../../core/services/courses';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { DateConvertionService } from '../../../../shared/services/date-convertion';

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ConfirmDialogComponent,
  ],
  templateUrl: './courses-list.html',
  styleUrl: './courses-list.scss',
})
export class CoursesList {

  private coursesService = inject(CoursesService);
  private dialog = inject(MatDialog);
  private dateService = inject(DateConvertionService);
  private router = inject(Router);

  /** Lista reactiva original */
  readonly courses = this.coursesService.coursesSignal;

  /** Columnas visibles */
  readonly displayedColumns = [
    'name',
    'code',
    'startDate',
    'endDate',
    'expand',
  ] as const;

  /** Fila secundaria expandida */
  readonly detailColumns = ['expandedDetail'] as const;

  /** Registro expandido */
  readonly expandedId = signal<string | null>(null);

  /** Filtro */
  private readonly filterTerm = signal<string>("");

  /** Lista filtrada */
  readonly filteredCourses = computed(() => {
    const term = this.filterTerm().trim().toLowerCase();
    const data = this.courses();

    if (!term) return data;

    return data.filter(c => {
      const values = [
        c.name,
        c.code,
        c.interests?.join(", "),
      ].filter(Boolean) as string[];

      return values.some(v => v.toLowerCase().includes(term));
    });
  });

  toggleExpand(course: CourseInterface): void {
    this.expandedId.update(current =>
      current === course.id ? null : course.id
    );
  }

  onFilterChange(term: string): void {
    this.filterTerm.set(term);
  }

  confirmDelete(course: CourseInterface): void {
    const data: ConfirmDialogData = {
      title: 'Eliminar curso',
      message: `¿Seguro que quieres eliminar el curso "${course.name}" (${course.code})?`,
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
    };

    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '320px',
      data,
    });

    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.coursesService.deleteCourse(course.id);
    });
  }

  isExpanded = (_i: number, row: CourseInterface) =>
    this.expandedId() === row.id;

  toShortDate(date: Date | null | undefined): string {
    return this.dateService.toShortDate(date);
  }

  editCourse(course: CourseInterface): void {
    this.coursesService.setSelectedCourse(course);
    this.router.navigate(['/courses-form']);
  }

  goToAddCourse(){
    this.coursesService.setSelectedCourse(null)
    this.router.navigate(["/courses-form"])
  }
}
