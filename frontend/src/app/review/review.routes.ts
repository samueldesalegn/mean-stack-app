import { Routes } from '@angular/router';
import { authGuard } from '../auth/auth.guard';

export const reviewRoutes: Routes = [
  {
    path: 'create',
    loadComponent: () =>
      import('./create-review.component').then((m) => m.CreateReviewComponent),
    canActivate: [authGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./review.component').then((m) => m.ReviewComponent),
  },
  {
    path: 'medications/:medicationId/add-review',
    loadComponent: () =>
      import('./create-review.component').then((m) => m.CreateReviewComponent),
    canActivate: [authGuard],
  },
];
