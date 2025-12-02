import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { StudentService } from '../../../../core/services/student';
import { StudentInterface } from '../../../../core/models/student/student-interface';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ConfirmDialogComponent,
  ],
  templateUrl: './students-list.html',
  styleUrl: './students-list.scss',
})
export class StudentsList {
  private studentService = inject(StudentService);
  private dialog = inject(MatDialog);

  /** Lista reactiva */
  readonly students = this.studentService.studentsSignal;

  /** Columnas principales visibles */
  readonly displayedColumns = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'expand',
  ] as const;

  /** Fila secundaria (detalle expandido) */
  readonly detailColumns = ['expandedDetail'] as const;

  /** Almacena qué fila está expandida */
  expandedId = signal<string | null>(null);

  toggleExpand(student: StudentInterface): void {
    this.expandedId.update((current) =>
      current === student.id ? null : student.id
    );
  }

  confirmDelete(student: StudentInterface): void {
    const data: ConfirmDialogData = {
      title: 'Eliminar alumno',
      message: `¿Seguro que quieres eliminar a ${student.firstName} ${student.lastName}?`,
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
    };

    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '320px',
      data,
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.studentService.deleteStudent(student.id);
    });
  }

  isExpanded = (index: number, row: StudentInterface) => {
    return this.expandedId() === row.id;
  };
  
}
