import { EmploymentStatus } from "./student-status.type";

export interface StudentInterface {
  /** Firestore document id */
  id: string;

  firstName: string;         // nombre
  lastName: string;          // apellidos
  email: string;
  phone: string;             // teléfono
  nationalId: string;        // DNI

  address: string;
  city: string;
  province: string;

  employmentStatus: EmploymentStatus; // estado laboral
  interests: string[];                // áreas de interés

  createdAt: Date;
  updatedAt?: Date;
}
