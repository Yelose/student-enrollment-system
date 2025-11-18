import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/pages/home/home').then((m) => m.Home),
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/pages/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./features/pages/courses/courses-list/courses-list').then((m) => m.CoursesList),
  },
  {
    path: 'course:id',
    loadComponent: () =>
      import('./features/pages/courses/course-detail/course-detail').then((m) => m.CourseDetail),
  },
  {
    path: 'enrollments',
    loadComponent: () =>
      import('./features/pages/enrollments/enrollments-list/enrollments-list').then(
        (m) => m.EnrollmentsList
      ),
  },
  {
    path: 'students',
    loadComponent: () =>
      import('./features/pages/students/students-list/students-list').then((m) => m.StudentsList),
  },
  {
    path: 'student:id',
    loadComponent: () =>
      import('./features/pages/students/student-detail/student-detail').then(
        (m) => m.StudentDetail
      ),
  },
  {
    path: 'cookies',
    loadComponent: () => import('./features/pages/legal/cookies/cookies').then((m) => m.Cookies),
  },
  {
    path: 'legal',
    loadComponent: () =>
      import('./features/pages/legal/legal-policy/legal-policy').then((m) => m.LegalPolicy),
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/pages/legal/privacy/privacy').then((m) => m.Privacy),
  },
];
