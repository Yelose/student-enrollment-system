import { Injectable, computed, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { AuthService } from './auth';
import { LoaderService } from '../../shared/services/loader-service';
import { StudentInterface } from '../models/student/student-interface';
import { error } from 'console';
import { SnackBarService } from '../../shared/services/snack-bar-service';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private firestore = inject(Firestore)
  private loader = inject(LoaderService)
  private snackbar = inject(SnackBarService)

  private studentsCollection = computed(() => {
    return collection(this.firestore, `dicampus-students`)
  })

  addStudent(student: Omit<StudentInterface, "id">) {
    const col = this.studentsCollection();
    this.loader.show()
    addDoc(col, student).catch(error => {
      this.snackbar.show(error, "error")
    }).finally(() => {
      this.loader.hide()
      this.snackbar.show("Alumno añadido con éxito", "success")
    })
  }

  


}
