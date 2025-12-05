import { Component, effect, inject, signal, computed } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';

import { EnrollmentsService } from '../../../../core/services/enrollments';
import { EnrollmentInterface } from '../../../../core/models/enrollment/enrollment-interface';
import {
  ENROLLMENT_STATUS_OPTIONS,
} from '../../../../core/models/enrollment/enrollment-status.constant';
import { EnrollmentStatus } from '../../../../core/models/enrollment/enrollment-status.type';

import { StudentService } from '../../../../core/services/student';
import { StudentInterface } from '../../../../core/models/student/student-interface';

import { CoursesService } from '../../../../core/services/courses';
import { CourseInterface } from '../../../../core/models/course/course-interface';

import { SnackBarService } from '../../../../shared/services/snack-bar-service';
import { DateConvertionService } from '../../../../shared/services/date-convertion';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatOptionModule,
  ],
  templateUrl: './enrollments-form.html',
  styleUrl: './enrollments-form.scss',
})
export class EnrollmentsForm {
  private fb = inject(NonNullableFormBuilder);
  private enrollmentsService = inject(EnrollmentsService);
  private studentsService = inject(StudentService);
  private coursesService = inject(CoursesService);
  private snackbar = inject(SnackBarService);
  private router = inject(Router);
  private dateService = inject(DateConvertionService);

  readonly statusOptions = ENROLLMENT_STATUS_OPTIONS;

  readonly isEditMode = signal(false);
  private currentEnrollment = this.enrollmentsService.selectedEnrollmentSignal;

  readonly students = this.studentsService.studentsSignal;
  readonly courses = this.coursesService.coursesSignal;

  private readonly studentFilter = signal<string>('');
  private readonly courseFilter = signal<string>('');

  readonly studentDisplay = signal<string>('');
  readonly courseDisplay = signal<string>('');

  // -----------------------------
  // Helpers para texto de autocomplete
  // -----------------------------
  private buildStudentDisplay(student: StudentInterface): string {
    return `${student.firstName} ${student.lastName} – ${student.email}`;
  }

  private buildCourseDisplay(course: CourseInterface): string {
    return `${course.name} (${course.code})`;
  }

  readonly studentOptions = computed(() => {
    const term = this.studentFilter().trim().toLowerCase();
    const data = this.students();

    const base = data.map((s) => ({
      id: s.id,
      display: this.buildStudentDisplay(s),
      student: s,
    }));

    if (!term) return base;

    return base.filter((opt) =>
      opt.display.toLowerCase().includes(term),
    );
  });

  readonly courseOptions = computed(() => {
    const term = this.courseFilter().trim().toLowerCase();
    const data = this.courses();

    const base = data.map((c) => ({
      id: c.id,
      display: this.buildCourseDisplay(c),
      course: c,
    }));

    if (!term) return base;

    return base.filter((opt) =>
      opt.display.toLowerCase().includes(term),
    );
  });

  // -----------------------------
  // Formulario
  // Fechas como string "YYYY-MM-DD" (igual que en CourseForm)
  // -----------------------------
  readonly enrollmentForm = this.fb.group({
    studentId: ['', [Validators.required]],
    studentName: ['', [Validators.required]],
    studentEmail: ['', [Validators.required, Validators.email]],
    courseId: ['', [Validators.required]],
    courseName: ['', [Validators.required]],
    courseCode: ['', [Validators.required]],
    status: ['pending' as EnrollmentStatus, [Validators.required]],
    startDate: ['', [Validators.required]], // string
    endDate: ['', [Validators.required]],   // string
  });

  // -----------------------------
  // EFFECT: reacciona a la matrícula seleccionada
  // -----------------------------
  private selectedEffect = effect(() => {
    const enrollment = this.currentEnrollment();
  
    if (enrollment) {
      this.isEditMode.set(true);
  
      this.enrollmentForm.patchValue({
        studentId: enrollment.studentId,
        studentName: enrollment.studentName,
        studentEmail: enrollment.studentEmail,
        courseId: enrollment.courseId,
        courseName: enrollment.courseName,
        courseCode: enrollment.courseCode,
        status: enrollment.status,
        startDate: this.dateService.toIsoInputDate(enrollment.startDate),
        endDate: this.dateService.toIsoInputDate(enrollment.endDate),
      });
  
      // ✅ El input muestra el valor actual...
      this.studentDisplay.set(this.buildStudentDisplayFromEnrollment(enrollment));
      this.courseDisplay.set(this.buildCourseDisplayFromEnrollment(enrollment));
  
      // ✅ ...pero el filtro se deja vacío para que se vean TODAS las opciones
      this.studentFilter.set('');
      this.courseFilter.set('');
    } else {
      this.isEditMode.set(false);
  
      this.enrollmentForm.reset({
        studentId: '',
        studentName: '',
        studentEmail: '',
        courseId: '',
        courseName: '',
        courseCode: '',
        status: 'pending',
        startDate: '',
        endDate: '',
      });
  
      this.studentDisplay.set('');
      this.courseDisplay.set('');
      this.studentFilter.set('');
      this.courseFilter.set('');
    }
  });
  

  private buildStudentDisplayFromEnrollment(e: EnrollmentInterface): string {
    return `${e.studentName} – ${e.studentEmail}`;
  }

  private buildCourseDisplayFromEnrollment(e: EnrollmentInterface): string {
    return `${e.courseName} (${e.courseCode})`;
  }

  // -----------------------------
  // Getters para el template
  // -----------------------------
  get studentId() { return this.enrollmentForm.get('studentId'); }
  get courseId() { return this.enrollmentForm.get('courseId'); }
  get status() { return this.enrollmentForm.get('status'); }
  get startDate() { return this.enrollmentForm.get('startDate'); }
  get endDate() { return this.enrollmentForm.get('endDate'); }

  // -----------------------------
  // AUTOCOMPLETE ESTUDIANTE
  // -----------------------------
  onStudentInput(term: string): void {
    const value = term ?? '';
    this.studentFilter.set(value);
    this.studentDisplay.set(value);

    if (!value) {
      this.enrollmentForm.patchValue({
        studentId: '',
        studentName: '',
        studentEmail: '',
      });
      this.studentId?.markAsDirty();
      this.studentId?.markAsTouched();
    }
  }

  onStudentSelected(option: { id: string; display: string; student: StudentInterface }): void {
    const { student, display } = option;

    this.studentDisplay.set(display);
    this.studentFilter.set(display);

    this.enrollmentForm.patchValue({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentEmail: student.email,
    });

    this.studentId?.markAsDirty();
    this.studentId?.markAsTouched();
  }

  // -----------------------------
  // AUTOCOMPLETE CURSO
  // -----------------------------
  onCourseInput(term: string): void {
    const value = term ?? '';
    this.courseFilter.set(value);
    this.courseDisplay.set(value);

    if (!value) {
      this.enrollmentForm.patchValue({
        courseId: '',
        courseName: '',
        courseCode: '',
      });
      this.courseId?.markAsDirty();
      this.courseId?.markAsTouched();
    }
  }

  onCourseSelected(option: { id: string; display: string; course: CourseInterface }): void {
    const { course, display } = option;

    this.courseDisplay.set(display);
    this.courseFilter.set(display);

    this.enrollmentForm.patchValue({
      courseId: course.id,
      courseName: course.name,
      courseCode: course.code,
    });

    this.courseId?.markAsDirty();
    this.courseId?.markAsTouched();
  }

  // -----------------------------
  // SUBMIT
  // -----------------------------
  submit(): void {
    if (this.enrollmentForm.invalid) {
      this.enrollmentForm.markAllAsTouched();
      this.snackbar.show('Formulario incompleto o incorrecto', 'error');
      return;
    }

    const {
      studentId,
      studentName,
      studentEmail,
      courseId,
      courseName,
      courseCode,
      status,
      startDate,
      endDate,
    } = this.enrollmentForm.getRawValue();

    if (!studentId || !courseId) {
      this.snackbar.show('Debes seleccionar un estudiante y un curso', 'error');
      return;
    }

    const start = this.dateService.toValidDate(startDate);
    const end = this.dateService.toValidDate(endDate);

    if (!start || !end) {
      this.snackbar.show('Las fechas de inicio y fin son obligatorias', 'error');
      return;
    }

    const enrollment: Omit<EnrollmentInterface, 'id' | 'createdAt' | 'updatedAt'> = {
      studentId: studentId!,
      courseId: courseId!,
      studentName: studentName!,
      studentEmail: studentEmail!,
      courseName: courseName!,
      courseCode: courseCode!,
      status: status as EnrollmentStatus,
      startDate: start,
      endDate: end,
    };

    const selected = this.currentEnrollment();

    if (selected) {
      this.enrollmentsService
        .updateEnrollment(selected.id, enrollment)
        .then(() => {
          this.enrollmentsService.setSelectedEnrollment(null);
          this.router.navigate(['/enrollments']);
        })
        .catch((err) => console.log(err));
    } else {
      this.enrollmentsService
        .addEnrollment(enrollment)
        .then(() => {
          this.router.navigate(['/enrollments']);
        })
        .catch((err) => console.log(err));
    }

    console.log(this.enrollmentForm.value);
  }
}
