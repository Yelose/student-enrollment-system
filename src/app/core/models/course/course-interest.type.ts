// src/app/core/models/course/course-interest.type.ts

import { COURSE_INTERESTS } from './course-interests.constant';

/**
 * Allowed interest values for a course.
 * Derived from COURSE_INTERESTS to keep type and data in sync.
 */
export type CourseInterest = (typeof COURSE_INTERESTS)[number];
