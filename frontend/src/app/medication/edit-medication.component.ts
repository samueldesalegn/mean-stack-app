import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MedicationService } from './medication.service';
import { AuthService } from '../auth/auth.service';
import { Medication, defaultMedication } from '../data.interfaces';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MedicationFormComponent } from './medication-form.component';

@Component({
  selector: 'app-edit-medication',
  template: `
    <app-medication-form
      [medication]="medication()"
      (store)="store($event)"
    ></app-medication-form>
  `,
  standalone: true,
  imports: [CommonModule, MatButtonModule, MedicationFormComponent],
})
export class EditMedicationComponent implements OnInit {
  medication = signal<Medication>(defaultMedication);
  #router = inject(Router);
  #authService = inject(AuthService);
  #medicationService = inject(MedicationService);
  #activatedRoute = inject(ActivatedRoute);

  get medicationId() {
    return this.#activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.#medicationService.getMedication(this.medicationId).subscribe({
      next: (medication) => {
        this.medication.set(medication);
        if (
          this.#authService.auth_signal()._id !==
          this.medication().added_by.user_id
        ) {
          alert('You are not authorized to edit this medication');
          this.#router.navigate(['', 'medications', this.medication()._id]);
        }
      },
      error: (err) => {
        console.error('Error fetching medication:', err);
      },
    });
  }

  store(formData: FormData) {
    this.#medicationService
      .updateMedication(this.medicationId, formData)
      .subscribe({
        next: () => {
          this.#router.navigate(['', 'medications', this.medicationId]);
        },
        error: (err) => {
          console.error('Error updating medication:', err);
        },
      });
  }
}
