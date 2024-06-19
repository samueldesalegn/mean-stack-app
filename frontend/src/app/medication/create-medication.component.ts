import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MedicationService } from './medication.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MedicationFormComponent } from './medication-form.component';

@Component({
  selector: 'app-create-medication',
  template: `
    <app-medication-form (store)="onStore($event)"></app-medication-form>
  `,
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MedicationFormComponent,
  ],
})
export class CreateMedicationComponent {
  #medicationService = inject(MedicationService);
  #router = inject(Router);

  onStore(formData: FormData) {
    this.#medicationService.createMedication(formData).subscribe((data) => {
      this.#router.navigate(['', 'medications', data._id]);
    });
  }
}
