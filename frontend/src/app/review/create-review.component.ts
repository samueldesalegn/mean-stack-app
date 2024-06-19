import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReviewService } from './review.service';
import { CommonModule } from '@angular/common';
import { Review } from '../data.interfaces';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-review',
  template: `
    <form
      [formGroup]="form"
      class="review-form"
      (ngSubmit)="create()"
      id="create-review-form"
    >
      <h3 class="form-title">
        {{ review ? 'Edit Review' : 'Add Your Review' }}
      </h3>
      <div class="rating-container">
        <button
          type="button"
          *ngFor="let _ of [].constructor(rating); let i = index"
          (click)="setRating(i + 1)"
          class="star filled"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            class="bi bi-star-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
            />
          </svg>
        </button>
        <button
          type="button"
          *ngFor="let _ of [].constructor(5 - rating); let i = index"
          (click)="setRating(rating + (i + 1))"
          class="star empty"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            class="bi bi-star"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"
            />
          </svg>
        </button>
      </div>
      <textarea
        formControlName="review"
        class="review-textarea"
        placeholder="Your Review"
      ></textarea>
      <div class="button-container">
        <button [disabled]="form.invalid" type="submit" class="submit-button">
          {{ review ? 'Save Review' : 'Submit Review' }}
        </button>
        @if (!!review) {
          <button
            type="reset"
            (click)="review = undefined"
            class="cancel-button"
          >
            Exit Editing
          </button>

        }
      </div>
    </form>
  `,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styles: [
    `
      .review-form {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .form-title {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        text-align: center;
        font-weight: bold;
      }

      .rating-container {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
      }

      .star {
        background: none;
        border: none;
        cursor: pointer;
      }

      .star svg {
        width: 32px;
        height: 32px;
      }

      .star.filled svg {
        fill: #ffc107;
      }

      .star.empty svg {
        fill: #e4e5e9;
      }

      .review-textarea {
        width: 100%;
        height: 100px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 8px;
        resize: none;
        font-size: 1rem;
        background-color: #f8f9fa;
        margin-bottom: 1rem;
      }

      .review-textarea:focus {
        border-color: #007bff;
        outline: none;
      }

      .button-container {
        display: flex;
        justify-content: space-between;
        gap: 10px;
      }

      .submit-button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        width: 100%;
      }

      .submit-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }

      .submit-button:hover:not(:disabled) {
        background-color: #0056b3;
      }

      .cancel-button {
        background-color: #f8f9fa;
        color: #333;
        border: 1px solid #ddd;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        width: 100%;
      }

      .cancel-button:hover {
        background-color: #e2e6ea;
      }
    `,
  ],
})
export class CreateReviewComponent implements OnChanges {
  @Input() review?: Review;
  @Input() medicationId!: string;
  @Output() onCreate = new EventEmitter<boolean>();
  @Output() onUpdate = new EventEmitter<boolean>();

  #reviewService = inject(ReviewService);
  #authService = inject(AuthService);
  #activatedRoute = inject(ActivatedRoute);
  form = inject(FormBuilder).nonNullable.group({
    review: ['', Validators.required],
    rating: [0, Validators.min(1)],
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['review'] && this.review) {
      this.form.setValue({
        review: this.review?.review || '',
        rating: this.review?.rating || 0,
      });
    }
  }

  setRating(rating: number) {
    this.form.patchValue({ rating });
  }

  get rating() {
    return this.form.get('rating')?.value || 0;
  }

  create() {
    if (this.form.invalid) {
      alert('Please fill in all fields');
      return;
    }

    const payload: { review: string; rating: number; tokenData?: any } = {
      review: this.form.value.review!,
      rating: this.form.value.rating!,
    };

    const tokenData = this.#authService.getTokenData();
    if (tokenData) {
      payload.tokenData = tokenData;
    } else {
      console.error('No token data found');
      return;
    }

    const medicationId = this.#activatedRoute.snapshot.params['id'];

    if (this.review?._id) {
      this.#reviewService
        .updateReview(medicationId, this.review._id, payload)
        .subscribe((success) => {
          this.onUpdate.emit(success);
          this.form.reset();
          this.review = undefined;
        });
    } else {
      this.#reviewService
        .createReview(medicationId, payload)
        .subscribe((success) => {
          this.onCreate.emit(success);
          this.form.reset();
        });
    }
  }
}
