import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../../../core/services/student';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-students-list',
  imports: [MatButtonModule, RouterLink, JsonPipe],
  templateUrl: './students-list.html',
  styleUrl: './students-list.scss',
})
export class StudentsList {
  private studentService = inject(StudentService)

  students = this.studentService.getAllStudents()
}
