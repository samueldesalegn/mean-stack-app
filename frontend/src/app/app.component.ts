import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  Router,
  NavigationEnd,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from './footer.component';
import { MatIconModule } from '@angular/material/icon';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <header class="header">
      <div class="logo">
        <a [routerLink]="['']">
          <img src="assets/logo.png" alt="Drugs.com Logo" />
        </a>
      </div>
      <nav class="nav">
        <div class="nav-button-container">
          @if (!isLoggedIn) {
          <a class="nav-link" [routerLink]="['signup']"> Register </a>
          } 
          
          @if (!isLoggedIn) {
          <a class="nav-link" [routerLink]="['signin']"> Signin </a>
          } 
          
          @if (isLoggedIn) {

            <a class="nav-link" (click)="signout()">Signout</a>
          }

          @if (isLoggedIn) {
            <a
              class="nav-link"             
              [routerLink]="['medications/create']"
            >
              Add Drugs
            </a>
          }
        </div>
      </nav>
    </header>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    MatButtonModule,
    FooterComponent,
    MatIconModule,
  ],
  styles: [
    `
      :root {
        --primary-color: #007bff;
        --secondary-color: #ffdd57;
        --text-color: #ffffff;
        --hover-color: #ffdd57;
        --header-height: 80px;
        --logo-height: 50px;
      }

      .header {
        background-color: var(--primary-color);
        color: var(--text-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30px;
        height: var(--header-height);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .logo img {
        height: var(--logo-height);
      }

      .nav {
        display: flex;
        align-items: center;
      }

      .nav-link-container,
      .nav-button-container {
        display: flex;
        align-items: center;
      }

      .nav-link {
        text-decoration: none;
        color: var(--text-color);
        font-weight: bold;
        font-size: 18px;
        margin: 0 15px;
        transition: color 0.3s, transform 0.3s, box-shadow 0.3s;
      }

      .nav-link:hover {
        color: var(--hover-color);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .main-content {
        padding: 20px;
        min-height: calc(
          100vh - var(--header-height) - 200px
        ); /* Adjust as per footer height */
      }

      @media (max-width: 768px) {
        .nav-link-container,
        .nav-button-container {
          flex-direction: column;
        }

        .nav-link {
          margin: 10px 0;
        }
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  #authService = inject(AuthService);
  #router = inject(Router);
  #titleService = inject(Title);

  ngOnInit() {
    this.#router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.#router.routerState.root;
          while (child.firstChild) {
            child = child.firstChild;
          }
          return child.snapshot.data['title'] || 'Default Title';
        })
      )
      .subscribe((title: string) => {
        this.#titleService.setTitle(title);
      });
  }

  get isLoggedIn() {
    return this.#authService.isLoggedIn();
  }

  signout() {
    this.#authService.auth_signal.set({
      _id: '',
      fullname: '',
      email: '',
      jwt: '',
    });
    localStorage.clear();
    this.#router.navigate(['signin']);
  }
}
