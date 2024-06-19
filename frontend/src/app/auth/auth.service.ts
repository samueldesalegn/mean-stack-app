import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, Response } from '../data.interfaces';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  auth_signal = signal({ _id: '', fullname: '', email: '', jwt: '' });
  #http = inject(HttpClient);

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token) as {
          _id: string;
          fullname: string;
          email: string;
        };
        this.auth_signal.set({ ...decoded, jwt: token });
      } catch (e) {
        console.error('Error decoding token from localStorage:', e);
      }
    }
  }

  isLoggedIn() {
    return this.auth_signal().jwt ? true : false;
  }

  getTokenData() {
    return this.auth_signal();
  }

  signup(user: User) {
    return this.#http.post<Response<any>>(
      `${environment.BACKEND_SERVER_URL}/users/signup`,
      user
    );
  }

  signin(email: string, password: string) {
    return this.#http.post<Response<any>>(
      `${environment.BACKEND_SERVER_URL}/users/signin`,
      {
        email,
        password,
      }
    );
  }
}
