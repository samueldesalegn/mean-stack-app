import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicationService } from './medication.service';
import { Medication } from '../data.interfaces';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { range } from 'lodash';

@Component({
  selector: 'medication-list',
  template: `
    <div class="content">
      <div class="container">
        <h1>Drugs & Medications A to Z</h1>
        <p>
          Detailed and information is provided on over 1,100 prescription and
          over-the-counter medicines for both consumers and healthcare
          professionals.
        </p>
        <br />
        <h2>Search</h2>
        <div class="search-bar">
          <input
            type="text"
            placeholder="Enter a drug name"
            [(ngModel)]="searchTerm"
            (input)="filterMedications()"
          />
          <button mat-icon-button (click)="filterMedications()">
            <mat-icon>search</mat-icon>
          </button>
        </div>
        <h2>Browse A-Z</h2>
        <div class="letters">
          @for (letter of letters; track letter) {
          <ng-container>
            <button mat-raised-button (click)="changeFirstLetter(letter)">
              {{ letter }}
            </button>
          </ng-container>
          }
        </div>
        <div class="medications">
          @for (medication of filteredMedications(); track medication._id) { 
            <mat-card >
              <mat-card-title>
                <a [routerLink]="['/medications', medication._id]">
                  {{ medication.name }}
                </a>
              </mat-card-title>
              <mat-card-content>
                <p>{{ medication.generic_name }}</p>
                <p>{{ medication.medication_class }}</p>
              </mat-card-content>
            </mat-card>
          }
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    FormsModule,
    MatIconModule,
  ],
  styles: [
    `
      .content {
        display: flex;
        justify-content: center;
        padding: 1rem;
      }
      .container {
        max-width: 1200px;
        width: 100%;
        padding: 1rem;
      }
      h1 {
        text-align: center;
        margin-bottom: 1rem;
      }
      .search-bar {
        display: flex;
        margin-bottom: 1rem;
      }
      .search-bar input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px 0 0 4px;
      }
      .search-bar button {
        border-radius: 0 4px 4px 0;
        background-color: #007bff;
        color: white;
      }
      h2 {
        text-align: left;
        margin-bottom: 1rem;
      }
      .letters {
        margin-bottom: 2rem; /* Add more space between letters and medications */
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: flex-start;
      }
      .letters button:hover {
        background-color: black;
        color: white;
      }
      .medications {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }
      .medication {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 1rem;
        transition: transform 0.2s;
      }
      .medication:hover {
        transform: scale(1.05);
        border-color: #007bff;
      }
      .medication a {
        text-decoration: none;
        color: inherit;
        color: blue;
      }
      .medication a:hover {
        text-decoration: underline;
        color: #007bff;
      }
    `,
  ],
})
export class MedicationListComponent implements OnInit {
  #medicationService = inject(MedicationService);
  letters = range(1, 27).map((i) => String.fromCharCode(64 + i));
  medications = signal<Medication[]>([]);
  filteredMedications = signal<Medication[]>([]);
  firstLetter = signal<string>('A');
  searchTerm = signal<string>('');

  ngOnInit() {
    this.getMedications();
  }

  getMedications() {
    this.#medicationService.getMedications(this.firstLetter()).subscribe({
      next: (medications) => {
        this.medications.set(medications);
        this.filterMedications();
      },
      error: (err) => {
        console.error('Error fetching medications:', err);
      },
    });
  }

  changeFirstLetter(letter: string) {
    this.firstLetter.set(letter);
    this.getMedications();
  }

  filterMedications() {
    const searchTerm = this.searchTerm().trim().toLowerCase();
    const firstLetter = this.firstLetter();
    const medications = this.medications();

    if (searchTerm) {
      this.filteredMedications.set(
        medications.filter((medication) =>
          medication.name.toLowerCase().includes(searchTerm)
        )
      );
    } else {
      this.filteredMedications.set(
        medications.filter(
          (med) => this.getFirstLetter(med.name) === firstLetter
        )
      );
    }
  }

  private getFirstLetter(name: string): string {
    return name ? name[0].toUpperCase() : '';
  }
}
