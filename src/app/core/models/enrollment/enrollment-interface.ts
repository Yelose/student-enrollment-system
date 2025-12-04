// core/models/enrollment/enrollment-interface.ts
import { EnrollmentStatus } from './enrollment-status.type';

export interface EnrollmentInterface {
  /** Firestore document id */
  id: string;

  /** References */
  studentId: string;
  courseId: string;

  /** Denormalized student info for quick listing */
  studentName: string;
  studentEmail: string;

  /** Denormalized course info for quick listing */
  courseName: string;
  courseCode: string;

  /** Enrollment state */
  status: EnrollmentStatus;

  /** Real dates for this enrollment (can differ from course dates) */
  startDate: Date | null;
  endDate: Date | null;

  /** Audit fields */
  createdAt: Date | null;
  updatedAt?: Date | null;
}
