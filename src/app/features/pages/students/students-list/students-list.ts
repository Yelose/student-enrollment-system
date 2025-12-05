import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { StudentService } from '../../../../core/services/student';
import { StudentInterface } from '../../../../core/models/student/student-interface';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { DateConvertionService } from '../../../../shared/services/date-convertion';

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
    MatFormFieldModule,
    MatInputModule,
    ConfirmDialogComponent,
  ],
  templateUrl: './students-list.html',
  styleUrl: './students-list.scss',
})
export class StudentsList {
  private studentService = inject(StudentService);
  private dialog = inject(MatDialog);
  private dateService = inject(DateConvertionService);
  private router = inject(Router)


  /** Lista reactiva original (sin filtro) */
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

  /** Id de la fila expandida */
  expandedId = signal<string | null>(null);

  /** Texto de filtro (nombre, apellidos, email, teléfono) */
  private readonly filterTerm = signal<string>('');

  /** Lista filtrada que usará la tabla como dataSource */
  readonly filteredStudents = computed(() => {
    const term = this.filterTerm().trim().toLowerCase();
    const data = this.students();

    if (!term) return data;

    return data.filter((s) => {
      const values = [
        s.firstName,
        s.lastName,
        s.email,
        s.province,
      ].filter(Boolean) as string[];

      return values.some((v) => v.toLowerCase().includes(term));
    });
  });

  toggleExpand(student: StudentInterface): void {
    this.expandedId.update((current) =>
      current === student.id ? null : student.id,
    );
  }

  /** Handler para el input del filtro */
  onFilterChange(term: string): void {
    this.filterTerm.set(term);
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

  isExpanded = (_index: number, row: StudentInterface) =>
    this.expandedId() === row.id;

  toShortDate(date: Date | null | undefined): string {
    return this.dateService.toShortDate(date);
  }


  editStudent(student: StudentInterface): void {
    this.studentService.setSelectedStudent(student);
    this.router.navigate(['/students-form']); 
  }

  goToAddStudent(){
    this.studentService.setSelectedStudent(null)
    this.router.navigate(["/students-form"])
  }

}
