import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn() ? true : router.createUrlTree(['signin']);
};
