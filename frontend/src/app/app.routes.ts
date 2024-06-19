import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'medications', pathMatch: 'full' },
  {
    path: 'medications',
    loadChildren: () =>
      import('./medication/medication.routes').then((m) => m.medicationRoutes),
    data: { title: 'Medications' },
  },
  {
    path: 'reviews',
    loadChildren: () =>
      import('./review/review.routes').then((m) => m.reviewRoutes),
    canActivate: [authGuard],
    data: { title: 'Reviews' },
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./auth/signin.component').then((m) => m.SigninComponent),
    data: { title: 'Sign In' },
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./auth/signup.component').then((m) => m.SignupComponent),
    data: { title: 'Sign Up' },
  },
];
