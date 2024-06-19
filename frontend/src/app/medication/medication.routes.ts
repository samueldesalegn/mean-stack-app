import { Routes } from '@angular/router';
import { authGuard } from '../auth/auth.guard';

export const medicationRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./medication-list.component').then(
        (m) => m.MedicationListComponent
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./create-medication.component').then(
        (m) => m.CreateMedicationComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./view-medication.component').then(
        (m) => m.ViewMedicationComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./edit-medication.component').then(
        (m) => m.EditMedicationComponent
      ),
    canActivate: [authGuard],
  },
];
