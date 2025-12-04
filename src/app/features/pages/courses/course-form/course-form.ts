import { Component, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseInterest } from '../../../../core/models/course/course-interest.type';
import { CourseInterface } from '../../../../core/models/course/course-interface';
import { CoursesService } from '../../../../core/services/courses';
import { SnackBarService } from '../../../../shared/services/snack-bar-service';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { COURSE_INTERESTS } from '../../../../core/models/course/course-interests.constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule, MatDatepickerModule,
    MatNativeDateModule,

  ], 
  templateUrl: './course-form.html',
  styleUrl: './course-form.scss',
})
export class CourseForm {
  private fb = inject(NonNullableFormBuilder);
  private coursesService = inject(CoursesService);
  private snackbar = inject(SnackBarService);
  private router = inject(Router);

  readonly interestOptions = COURSE_INTERESTS;

  readonly isEditMode = signal(false);
  private currentCourse = this.coursesService.selectedCourseSignal;

  readonly courseForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    code: ['', [Validators.required, Validators.minLength(2)]],
    startDate: ['', [Validators.required]], // string "YYYY-MM-DD"
    endDate: ['', [Validators.required]],   // string "YYYY-MM-DD"
    interests: this.fb.control<CourseInterest[]>([] as CourseInterest[]),
  });

  // ------------------------------------------
  // 🔥 EFFECT: reacciona al curso seleccionado
  // ------------------------------------------
  private selectedEffect = effect(() => {
    const course = this.currentCourse();

    if (course) {
      this.isEditMode.set(true);

      this.courseForm.patchValue({
        name: course.name,
        code: course.code,
        startDate: this.toInputDate(course.startDate),
        endDate: this.toInputDate(course.endDate),
        interests: course.interests ?? [],
      });
    } else {
      this.isEditMode.set(false);

      this.courseForm.reset({
        name: '',
        code: '',
        startDate: '',
        endDate: '',
        interests: []
      });
    }
  });

  // ------------------------------------------
  // 🧩 Getters para el template
  // ------------------------------------------
  get name() { return this.courseForm.get('name'); }
  get code() { return this.courseForm.get('code'); }
  get startDate() { return this.courseForm.get('startDate'); }
  get endDate() { return this.courseForm.get('endDate'); }
  get interests() { return this.courseForm.get('interests'); }

  // ------------------------------------------
  // 🔁 Checkbox de intereses
  // ------------------------------------------
  onInterestChange(interest: CourseInterest, checked: boolean): void {
    const current = this.interests?.value ?? [];
  
    if (checked && !current.includes(interest)) {
      this.interests?.setValue([...current, interest]);
    }
  
    if (!checked && current.includes(interest)) {
      this.interests?.setValue(current.filter((i) => i !== interest));
    }
  
    this.interests?.markAsDirty();
    this.interests?.markAsTouched();
  }
  

  // ------------------------------------------
  // 🧮 Util para formatear Date → "YYYY-MM-DD"
  // ------------------------------------------
  private toInputDate(value: Date | null | undefined): string {
    if (!value) return '';
    const d = new Date(value);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // ------------------------------------------
  // 📩 Submit
  // ------------------------------------------
  submit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      this.snackbar.show('Formulario incompleto o incorrecto', 'error');
      return;
    }

    const {
      name,
      code,
      startDate,
      endDate,
      interests,
    } = this.courseForm.getRawValue();

    // Required por validators, pero lo tratamos defensivamente
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (!start || !end) {
      this.snackbar.show('Las fechas de inicio y fin son obligatorias', 'error');
      return;
    }

    const course: Omit<CourseInterface, 'id' | 'createdAt' | 'updatedAt'> = {
      name: name,
      code: code,
      startDate: start,
      endDate: end,
      interests: interests,
    };

    const selectedCourse = this.currentCourse();

    if (selectedCourse) {
      // 🟣 Modo edición
      this.coursesService
        .updateCourse(selectedCourse.id, course)
        .then(() => {
          this.coursesService.setSelectedCourse(null);
          this.router.navigate(['/courses']);
        })
        .catch((err) => console.log(err));
    } else {
      // 🟢 Modo creación
      this.coursesService
        .addCourse(course)
        .then(() => {
          this.router.navigate(['/courses']);
        })
        .catch((err) => console.log(err));
    }

    console.log(this.courseForm.value);
  }
}
