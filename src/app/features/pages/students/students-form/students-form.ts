import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { StudentService } from '../../../../core/services/student';
import { SnackBarService } from '../../../../shared/services/snack-bar-service';
import { EMPLOYMENT_STATUS_OPTIONS } from '../../../../core/models/student/student-status.constant';
import { STUDENT_INTERESTS } from '../../../../core/models/student/student-interests.constant';
import { EmploymentStatus } from '../../../../core/models/student/student-status.type';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StudentInterface } from '../../../../core/models/student/student-interface';

@Component({
  selector: 'app-students-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatCheckboxModule,
    MatInputModule, MatButtonModule, MatIconModule, MatSelectModule],
  templateUrl: './students-form.html',
  styleUrl: './students-form.scss',
})
export class StudentsForm {

  private fb = inject(NonNullableFormBuilder)
  private studentsService = inject(StudentService)
  readonly employmentStatusOptions = EMPLOYMENT_STATUS_OPTIONS
  readonly interestOptions = STUDENT_INTERESTS

  readonly studentForm = this.fb.group({
    firstName: ["", [Validators.required, Validators.minLength(2)]],
    lastName: ["", [Validators.required, Validators.minLength(2)]],
    email: ["", [Validators.required, Validators.email]],
    phone: ["", [Validators.required, Validators.minLength(9)]],
    nationalId: ["", [Validators.required]],
    address: [""],
    city: [""],
    province: [""],
    employmentStatus: [""],
    interests: this.fb.control<string[]>([]),
  })

  get firstName() { return this.studentForm.get("firstName") }
  get lastName() { return this.studentForm.get("lastName") }
  get email() { return this.studentForm.get("email") }
  get phone() { return this.studentForm.get("phone") }
  get nationalId() { return this.studentForm.get("nationalId") }
  get address() { return this.studentForm.get("address") }
  get city() { return this.studentForm.get("city") }
  get province() { return this.studentForm.get("province") }
  get employmentStatus() { return this.studentForm.get("employmentStatus") }
  get interests() { return this.studentForm.get("interests") }

  onInterestChange(interest: string, checked: boolean): void {
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
  
  submit() {
    const {
      firstName, lastName, email, phone, nationalId, address, city, province,
      employmentStatus, interests
    } = this.studentForm.getRawValue()

    this.studentsService.addStudent({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      nationalId: nationalId,
      address: address,
      city: city ,
      province: province,
      employmentStatus: employmentStatus as EmploymentStatus, // cast seguro por tus opciones
      interests: interests ,
    });
    console.log(this.studentForm.value)
   }
}
