import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Medication, Response } from '../data.interfaces';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MedicationService {
  #http = inject(HttpClient);
  #authService = inject(AuthService);
  medicationList = signal<Medication[]>([]);

  getMedications(firstLetter: string) {
    return this.#http
      .get<Response<Medication[]>>(
        `${environment.BACKEND_SERVER_URL}/medications?first_letter=${firstLetter}`
      )
      .pipe(
        map((response) => response.data),
        tap((medications) => this.medicationList.set(medications))
      );
  }

  getMedication(id: string) {
    return this.#http
      .get<Response<Medication>>(
        `${environment.BACKEND_SERVER_URL}/medications/${id}`
      )
      .pipe(map((response) => response.data));
  }

  createMedication(medication: FormData) {
    const tokenData = this.#authService.getTokenData();
    medication.append('tokenData', JSON.stringify(tokenData));
    return this.#http
      .post<Response<Medication>>(
        `${environment.BACKEND_SERVER_URL}/medications`,
        medication
      )
      .pipe(
        map((response) => response.data),
        tap((newMedication) => {
          this.medicationList.update((medications) => [
            ...medications,
            newMedication,
          ]);
        })
      );
  }

  updateMedication(medicationId: string, medication: FormData) {
    const tokenData = this.#authService.getTokenData();
    medication.append('tokenData', JSON.stringify(tokenData));
    return this.#http
      .put<Response<Medication>>(
        `${environment.BACKEND_SERVER_URL}/medications/${medicationId}`,
        medication
      )
      .pipe(
        map((response) => response.data),
        tap((updatedMedication) => {
          this.medicationList.update((medications) =>
            medications.map((m) =>
              m._id === medicationId ? updatedMedication : m
            )
          );
        })
      );
  }

  deleteMedication(medicationId: string, tokenData: any) {
    return this.#http
      .delete<Response<Medication>>(
        `${environment.BACKEND_SERVER_URL}/medications/${medicationId}`,
        {
          body: { tokenData: JSON.stringify(tokenData) },
        }
      )
      .pipe(
        map((response) => response.data),
        tap(() => {
          this.medicationList.update((medications) =>
            medications.filter((medication) => medication._id !== medicationId)
          );
        })
      );
  }

  checkMedicationExists(name: string) {
    return this.#http
      .post<{ exists: boolean }>(
        `${environment.BACKEND_SERVER_URL}/medications/check-name`,
        { name }
      )
      .pipe(map((response) => response.exists));
  }

  searchMedications(query: string) {
    return this.#http
      .get<Response<Medication[]>>(
        `${environment.BACKEND_SERVER_URL}/medications/search?query=${query}`
      )
      .pipe(map((response) => response.data));
  }
}
