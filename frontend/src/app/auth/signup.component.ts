import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { User, Response } from '../data.interfaces';

@Component({
  selector: 'app-signup',
  template: `
    <div class="signup-container">
      <form [formGroup]="form" (ngSubmit)="go()" class="signup-form">
        <mat-form-field appearance="fill">
          <mat-label>Full Name</mat-label>
          <input matInput formControlName="fullname" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" type="password" />
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit">Sign Up</button>
      </form>
      <div class="signin-link">
        <p>
          Already have an account? <a [routerLink]="['/signin']">Sign in</a>
        </p>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
  ],
  styles: [
    `
      .signup-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 50px;
      }

      .signup-form {
        width: 100%;
        max-width: 500px;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background-color: #f9f9f9;
      }

      .signin-link {
        margin-top: 20px;
        text-align: center;
      }

      .signin-link a {
        color: #007bff;
        text-decoration: none;
      }

      .signin-link a:hover {
        text-decoration: underline;
      }

      mat-form-field {
        width: 100%;
      }

      button {
        width: 100%;
        margin-top: 20px;
      }
    `,
  ],
})
export class SignupComponent {
  #auth = inject(AuthService);
  #router = inject(Router);
  #notification = inject(ToastrService);
  form = inject(FormBuilder).nonNullable.group({
    fullname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  go() {
    if (this.form.valid) {
      this.#auth.signup(this.form.value as User).subscribe({
        next: (response: Response<User>) => {
          if (response.success) {
            this.#notification.success('User registered successfully!');
            this.#router.navigate(['', 'signin']);
          } else {
            this.#notification.error('Registration failed.');
          }
        },
        error: (err) => {
          console.error('Error during signup:', err);
          this.#notification.error('An error occurred during signup.');
        },
      });
    } else {
      this.#notification.warning('Please fill in all required fields.');
    }
  }

  ngOnInit() {
    if (this.#auth.isLoggedIn()) {
      this.#router.navigate(['', 'medications']);
    }
  }
}
