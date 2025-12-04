// src/app/core/models/course/course-interface.ts

import { CourseInterest } from "./course-interest.type";


export interface CourseInterface {
  /** Firestore document id */
  id: string;

  /** Course display name */
  name: string;

  /** Internal / external identification code (unique per course in the center) */
  code: string;

  /** Interests or areas this course is related to */
  interests: CourseInterest[];

  /** Planned start date of the course */
  startDate: Date | null;

  /** Planned end date of the course */
  endDate: Date | null;

  /** Timestamps managed by the backend / Firestore */
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
