import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Review, Response, ReviewPayload } from '../data.interfaces';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  #http = inject(HttpClient);

  getReview(medicationId: string, reviewId: string) {
    return this.#http
      .get<Response<Review>>(
        `${environment.BACKEND_SERVER_URL}/medications/${medicationId}/reviews/${reviewId}`
      )
      .pipe(map((response) => response.data));
  }

  createReview(medicationId: string, review: ReviewPayload) {
    return this.#http
      .post<Response<boolean>>(
        `${environment.BACKEND_SERVER_URL}/medications/${medicationId}/reviews`,
        review
      )
      .pipe(map((response) => response.data));
  }

  deleteReview(medicationId: string, reviewId: string, tokenData: any) {
    return this.#http
      .delete<Response<boolean>>(
        `${environment.BACKEND_SERVER_URL}/medications/${medicationId}/reviews/${reviewId}`,
        { body: { tokenData } }
      )
      .pipe(map((response) => response.data));
  }

  updateReview(medicationId: string, reviewId: string, review: ReviewPayload) {
    return this.#http
      .put<Response<boolean>>(
        `${environment.BACKEND_SERVER_URL}/medications/${medicationId}/reviews/${reviewId}`,
        review
      )
      .pipe(map((response) => response.data));
  }
}
