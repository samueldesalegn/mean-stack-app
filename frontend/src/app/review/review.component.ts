import {
  Component,
  EventEmitter,
  input,
  output,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReviewService } from './review.service';
import { AuthService } from '../auth/auth.service';
import { Review } from '../data.interfaces';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-review',
  template: `
    <div *ngIf="review" class="review-details">
      <ng-container *ngIf="!isEditing; else editTemplate">
        <p class="review-text">{{ review().review }}</p>
        <p class="review-rating">
          <strong>Rating:</strong> {{ review().rating }}
        </p>
        <div *ngIf="canEditReview" class="actions">
          <button class="action-button" (click)="startEditing()">Edit</button>
          <button class="action-button" (click)="deleteReview()">Delete</button>
        </div>
      </ng-container>
      <ng-template #editTemplate>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="fill">
            <mat-label>Review</mat-label>
            <input matInput formControlName="review" />
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Rating</mat-label>
            <input matInput type="number" formControlName="rating" />
          </mat-form-field>
          <div class="edit-actions">
            <button mat-raised-button color="primary" type="submit">
              Update Review
            </button>
            <button mat-raised-button type="button" (click)="cancelEditing()">
              Cancel
            </button>
          </div>
        </form>
      </ng-template>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule, ReactiveFormsModule],
  styles: [
    `
      .review-details {
        padding: 15px;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin-bottom: 15px;
        background-color: #f9f9f9;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .review-text {
        font-size: 1.1em;
        margin-bottom: 10px;
      }
      .review-rating {
        font-size: 1em;
        color: #555;
        margin-bottom: 10px;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
      .action-button {
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        background-color: #007bff;
        color: white;
      }
      .action-button:hover {
        background-color: #0056b3;
      }
      .edit-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
      mat-form-field {
        width: 100%;
        margin-bottom: 15px;
      }
      button {
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        background-color: #007bff;
        color: white;
        border: none;
        transition: background-color 0.3s;
      }
      button:hover {
        background-color: #0056b3;
      }
    `,
  ],
})
export class ReviewComponent implements OnChanges {
  review = input.required<Review>();
  medicationId = input.required<string>();
  
  onEdit = output<Review>();
  onDelete = output<string>();

  form: FormGroup;
  isEditing = false;
  #authService = inject(AuthService);
  #reviewService = inject(ReviewService);

  constructor() {
    this.form = inject(FormBuilder).nonNullable.group({
      review: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['review'] && this.review) {
      this.form.patchValue(this.review);
    }
  }

  startEditing() {
    this.isEditing = true;
    this.form.patchValue(this.review!);
  }

  cancelEditing() {
    this.isEditing = false;
  }

  onSubmit() {
    if (this.form.invalid) {
      alert('Please fill in all fields');
      return;
    }

    const reviewPayload = {
      ...this.form.value,
      tokenData: this.#authService.getTokenData(),
    };

    this.#reviewService
      .updateReview(this.medicationId(), this.review()!._id, reviewPayload)
      .subscribe({
        next: (success) => {
          if (success) {
            this.onEdit.emit({ ...this.review, ...reviewPayload });
            this.isEditing = false;
          } else {
            alert('Update failed');
          }
        },
        error: (err) => {
          console.error('Error updating review:', err);
        },
      });
  }

  deleteReview() {
    if (confirm('Are you sure you want to delete the review?')) {
      const tokenData = this.#authService.getTokenData();
      this.#reviewService
        .deleteReview(this.medicationId(), this.review()._id || '', tokenData)
        .subscribe({
          next: () => {
            this.onDelete.emit(this.review()._id);
          },
          error: (err) => {
            console.error('Error deleting review:', err);
          },
        });
    }
  }

  get canEditReview() {
    return this.#authService.auth_signal()._id === this.review().by?.user_id;
  }
}
