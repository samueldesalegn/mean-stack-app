import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MedicationValidators {
  #http = inject(HttpClient);
  constructor() {}

  checkMedicationExists(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return this.#http
        .get<{ exists: boolean }>(
          `${environment.BACKEND_SERVER_URL}/medications/exists`,
          {
            params: { name: control.value },
          }
        )
        .pipe(
          map((response) =>
            response.exists ? { medicationExists: true } : null
          ),
          catchError(() => of(null))
        );
    };
  }
}
