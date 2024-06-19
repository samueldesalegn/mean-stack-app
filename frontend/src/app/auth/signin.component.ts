import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Response, JWT } from '../data.interfaces';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-signin',
  template: `
    <div class="signin-container">
      <h1>Account Sign In</h1>
      <form [formGroup]="form" (ngSubmit)="go()">
        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" type="password" />
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit">Sign In</button>
      </form>
      <div class="additional-links">
        <a [routerLink]="['/signup']">Create an account</a>
        <a href="#">Forgot password?</a>
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
      .signin-container {
        max-width: 400px;
        margin: auto;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        background-color: #f9f9f9;
      }

      h1 {
        font-size: 24px;
        text-align: center;
        margin-bottom: 1rem;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .additional-links {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
        font-size: 14px;
      }

      .additional-links a {
        text-decoration: none;
        color: #007bff;
        transition: color 0.3s;
      }

      .additional-links a:hover {
        color: #0056b3;
      }
    `,
  ],
})
export class SigninComponent {
  #auth = inject(AuthService);
  #router = inject(Router);
  #notification = inject(ToastrService);
  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  go() {
    if (this.form.valid) {
      const email = this.form.get('email')?.value!;
      const password = this.form.get('password')?.value!;
      this.#auth.signin(email, password).subscribe({
        next: (response: Response<string>) => {
          if (response.success) {
            try {
              const decoded: JWT = jwtDecode(response.data);
              this.#auth.auth_signal.set({ ...decoded, jwt: response.data });
              localStorage.setItem('token', response.data);
              this.#notification.success('User logged in successfully!');
              this.#router.navigate(['', 'medications']);
            } catch (e) {
              console.error('Error decoding token:', e);
              this.#notification.error('Failed to decode token.');
            }
          } else {
            this.#notification.error('Signin failed.');
          }
        },
        error: (error: any) => {
          console.error('Error during signin:', error);
          this.#notification.error('An error occurred during signin.');
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
