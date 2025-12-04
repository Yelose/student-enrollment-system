import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/pages/home/home').then((m) => m.Home),
    pathMatch: 'full',
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/pages/auth/login/login').then((m) => m.Login),
  },

  // ------- PROTECTED ROUTES -------
  {
    path: 'courses',
    loadComponent: () =>
      import('./features/pages/courses/courses-list/courses-list')
        .then((m) => m.CoursesList),
    canActivate: [authGuard],
  },
  {
    path: 'enrollments',
    loadComponent: () =>
      import('./features/pages/enrollments/enrollments-list/enrollments-list')
        .then((m) => m.EnrollmentsList),
    canActivate: [authGuard],
  },
  {
    path: 'students',
    loadComponent: () =>
      import('./features/pages/students/students-list/students-list')
        .then((m) => m.StudentsList),
    canActivate: [authGuard],
  },
  {
    path: "students-form",
    loadComponent: () =>
      import("./features/pages/students/students-form/students-form")
        .then(m => m.StudentsForm),
    canActivate: [authGuard]
  },

  // ------- PUBLIC ROUTES -------
  {
    path: 'cookies',
    loadComponent: () =>
      import('./features/pages/legal/cookies/cookies')
        .then((m) => m.Cookies),
  },
  {
    path: 'legal',
    loadComponent: () =>
      import('./features/pages/legal/legal-policy/legal-policy')
        .then((m) => m.LegalPolicy),
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./features/pages/legal/privacy/privacy')
        .then((m) => m.Privacy),
  },
];
