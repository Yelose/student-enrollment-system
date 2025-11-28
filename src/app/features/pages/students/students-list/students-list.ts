import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../../../core/services/student';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-students-list',
  imports: [MatButtonModule, RouterLink, DatePipe, MatTableModule],
  templateUrl: './students-list.html',
  styleUrl: './students-list.scss',
})
export class StudentsList {
  private studentService = inject(StudentService)

  students = this.studentService.getAllStudents()

  // TODAS las columnas
  readonly displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'nationalId',
    'address',
    'city',
    'province',
    'employmentStatus',
    'interests',
    'createdAt',
    'updatedAt',
  ];
}



