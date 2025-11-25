import { Injectable, computed, inject, signal } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { LoaderService } from '../../shared/services/loader-service';
import { StudentInterface } from '../models/student/student-interface';
import { SnackBarService } from '../../shared/services/snack-bar-service';
import { toSignal } from '@angular/core/rxjs-interop';

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

  private studentSignal = signal<StudentInterface | null>(null)

  private studentsSignal = toSignal(
    collectionData(this.studentsCollection(), { idField: 'id' }),
    { initialValue: [] as StudentInterface[] }
  );
  
  addStudent(student: Omit<StudentInterface, "id" | "createdAt" | "updatedAt">) {
    const col = this.studentsCollection();
    const now = new Date();

    const studentData: Omit<StudentInterface, "id"> = {
      ...student,
      createdAt: now,
      updatedAt: now
    };

    this.loader.show();

    addDoc(col, studentData)
      .then(() => {
        this.snackbar.show("Alumno añadido con éxito", "success");
      })
      .catch((error) => {
        console.error(error);
        this.snackbar.show("No se pudo añadir el alumno", "error");
      })
      .finally(() => {
        this.loader.hide();
      });
  }

  updateStudent(id: string, student: Partial<StudentInterface>) {
    const ref = doc(this.firestore, "dicampus-students", id)

    this.loader.show()

    updateDoc(ref, student).then(() => {
      this.snackbar.show("Alumno actualizado correctamente", 'success')
    }).catch((error) => {
      this.snackbar.show(error, "error")
    }).finally(() => {
      this.loader.hide()
    })
  }
  getStudentById(id: string){
    const ref = doc(this.firestore, "dicampus-students", id)

    this.loader.show()

    getDoc(ref).then((result) => {
      if (!result.exists()) {
        this.studentSignal.set(null)
      return
      }
      const data = result.data();
      const student: StudentInterface = {id: result.id, ...data} as StudentInterface
      this.studentSignal.set(student)
      return student
      
    }).catch((error) => {
      this.studentSignal.set(null)
      this.snackbar.show(error, "error")
    }).finally(() => {
      this.loader.hide()
    })
  }

  deleteStudent(id: string) {
    const docRef = doc(this.firestore, "dicampus-students", id)
    this.loader.show()

    deleteDoc(docRef).then(() => {
      this.snackbar.show("Alumno eliminado", "success")
    }).catch((err) => {
      this.snackbar.show(err, "error")
    }).finally(() => { this.loader.hide() })
  }

  getAllStudents() {
    return this.studentsSignal()
  }

}




