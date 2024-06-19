import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MedicationService } from './medication.service';
import { AuthService } from '../auth/auth.service';
import { Medication, Review, defaultMedication } from '../data.interfaces';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ReviewComponent } from '../review/review.component';
import { CreateReviewComponent } from '../review/create-review.component';
import { environment } from '../../environments/environment';
import { take } from 'rxjs/operators';

@Component({
  selector: 'view-medication',
  template: `
    <div *ngIf="medication()" class="medication-details">
      <div class="header">
        <h2>{{ medication().name }}</h2>
      </div>
      <p><strong>Generic Name:</strong> {{ medication().generic_name }}</p>
      <p><strong>Class:</strong> {{ medication().medication_class }}</p>
      <p><strong>Availability:</strong> {{ medication().availability }}</p>
      <div
        *ngIf="medication().images && medication().images.length"
        class="images"
      >
        <img
          *ngFor="let image of medication().images"
          [src]="getImagePath(image.filename)"
          alt="{{ medication().name }}"
          class="medication-image"
        />
      </div>
      <div
        *ngIf="!medication().images || medication().images.length === 0"
        class="images"
      >
        <img
          [src]="getImagePath('generic.png')"
          alt="{{ medication().name }}"
          class="medication-image"
        />
      </div>
      <div class="actions" *ngIf="canEdit">
        <button mat-raised-button color="primary" (click)="navigateToEdit()">
          Edit
        </button>
        <button mat-raised-button color="warn" (click)="deleteMedication()">
          Delete
        </button>
      </div>
      <h3 class="reviews-title">Reviews</h3>
      <div *ngFor="let review of medication().reviews" class="review">
        <app-review
          [review]="review"
          [medicationId]="medicationId()"
          (onEdit)="handleReviewUpdate($event)"
          (onDelete)="handleReviewDelete($event)"
        ></app-review>
      </div>
      <app-create-review
        [medicationId]="medicationId()"
        (onCreate)="handleReviewCreate($event)"
      ></app-create-review>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ReviewComponent,
    CreateReviewComponent,
  ],
  styles: [
    `
      .medication-details {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        background-color: #fff;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      h2 {
        margin: 0;
        font-size: 24px;
        color: #333;
      }
      .actions {
        display: flex;
        justify-content: flex-start;
        margin-top: 10px;
      }
      .actions button {
        margin-right: 10px;
      }
      p {
        font-size: 16px;
        color: #555;
        margin: 5px 0;
      }
      .images {
        display: flex;
        gap: 10px;
        margin: 20px 0;
        overflow-x: auto;
      }
      .medication-image {
        width: 150px; /* Fixed width for all images */
        height: 150px; /* Fixed height for all images */
        object-fit: cover; /* Ensures the image covers the area without distorting */
        border-radius: 10px;
        border: 1px solid #e0e0e0;
        padding: 5px;
        background-color: #f9f9f9;
      }
      .reviews-title {
        margin: 30px 0 10px;
        font-size: 20px;
        font-weight: bold;
        color: #333;
      }
      .review {
        margin-bottom: 20px;
      }
    `,
  ],
})
export class ViewMedicationComponent implements OnInit {
  medication = signal<Medication>(defaultMedication);
  showCreateReview = signal<boolean>(false);
  showEditMedication = signal<boolean>(false);

  #router = inject(Router);
  #authService = inject(AuthService);
  #medicationService = inject(MedicationService);
  medicationId = signal<string>('');

  ngOnInit() {
    this.medicationId.set(this.#router.url.split('/').pop() || '');
    this.getMedication();
  }

  getMedication() {
    this.#medicationService
      .getMedication(this.medicationId())
      .pipe(take(1))
      .subscribe({
        next: (medication: Medication) => {
          this.medication.set(medication);
        },
        error: (err) => {
          console.error('Error fetching medication:', err);
        },
      });
  }

  navigateToEdit() {
    this.#router.navigate(['medications', this.medicationId(), 'edit']);
  }

  getImagePath(filename: string) {
    return `${environment.BACKEND_SERVER_URL}/medications/images/${filename}`;
  }

  get canEdit() {
    const loggedInUserId = this.#authService.auth_signal()._id;
    const medicationOwnerId = this.medication().added_by?.user_id;
    return (
      this.#authService.isLoggedIn() && loggedInUserId === medicationOwnerId
    );
  }

  deleteMedication() {
    if (
      this.#authService.auth_signal()._id !==
      this.medication().added_by?.user_id
    ) {
      alert('You are not authorized to delete this medication');
      return;
    }
    if (confirm('Are you sure you want to delete the medication?')) {
      const tokenData = this.#authService.getTokenData();

      this.#medicationService
        .deleteMedication(this.medicationId(), tokenData)
        .subscribe({
          next: () => {
            this.#router.navigate(['', 'medications']);
          },
          error: (err) => {
            console.error('Error deleting medication:', err);
          },
        });
    }
  }

  addReview() {
    this.showCreateReview.set(true);
  }

  handleReviewCreate(success: boolean) {
    if (success) {
      this.getMedication();
      this.showCreateReview.set(false);
    }
  }

  handleReviewUpdate(review: Review | boolean) {
    if (typeof review === 'boolean') {
      // Handle boolean value
    } else {
      this.getMedication();
    }
  }

  handleReviewDelete(reviewId: string) {
    if (this.medication()) {
      this.medication.update((medication) => {
        if (medication) {
          medication.reviews = medication.reviews.filter(
            (review) => review._id !== reviewId
          );
        }
        return medication;
      });
    }
  }
}
