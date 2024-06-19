import {
  Component,
  OnChanges,
  SimpleChanges,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Medication, defaultMedication } from '../data.interfaces';
import { MedicationValidators } from './medication-validators.service';

@Component({
  selector: 'app-medication-form',
  template: `
    <div class="form-container">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          @if (form.get('name')?.hasError('medicationExists')) {
            <mat-error >
              Medication name already exists
            </mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Generic Name</mat-label>
          <input matInput formControlName="generic_name" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Class</mat-label>
          <input matInput formControlName="medication_class" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Availability</mat-label>
          <mat-select formControlName="availability">
            <mat-option value="Prescription">Prescription</mat-option>
            <mat-option value="OTC">OTC</mat-option>
          </mat-select>
        </mat-form-field>
        <div class="file-input-container">
          <label for="medication_images">Images</label>
          <input
            type="file"
            id="medication_images"
            (change)="onFileSelect($event)"
            multiple
          />
        </div>
        <button mat-raised-button color="primary" type="submit">Submit</button>
      </form>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  styles: [
    `
      .form-container {
        max-width: 600px;
        margin: auto;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        background-color: #f9f9f9;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .file-input-container {
        margin-top: 1rem;
      }

      button[type='submit'] {
        align-self: flex-end;
      }

      @media (max-width: 768px) {
        .form-container {
          padding: 1rem;
        }
      }
    `,
  ],
})
export class MedicationFormComponent implements OnChanges {
  medication = input<Medication>(defaultMedication);
  store = output<FormData>();
  form: FormGroup;
  images: File[] = [];

  constructor() {
    const fb = inject(FormBuilder);
    const medicationValidators = inject(MedicationValidators);

    this.form = fb.nonNullable.group({
      name: [
        '',
        [Validators.required],
        [medicationValidators.checkMedicationExists()],
      ],
      generic_name: ['', Validators.required],
      medication_class: ['', Validators.required],
      availability: ['Prescription', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['medication'] && this.medication) {
      this.form.patchValue({
        name: this.medication().name,
        generic_name: this.medication().generic_name,
        medication_class: this.medication().medication_class,
        availability: this.medication().availability,
      });
    }
  }

  onFileSelect(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      this.images.push(...Array.from(files));
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    Object.keys(this.form.controls).forEach((key) => {
      formData.append(key, this.form.get(key)?.value);
    });
    this.images.forEach((image) => {
      formData.append('medication_images', image);
    });

    this.store.emit(formData);
  }
}
