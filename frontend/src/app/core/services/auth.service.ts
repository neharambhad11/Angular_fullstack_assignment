import { Injectable, inject, signal, computed } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

import { AuthResponse } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private http = inject(HttpClient);

  private tokenKey = 'access_token';

  token = signal<string | null>(
    sessionStorage.getItem(this.tokenKey)
  );

  isLoggedIn = computed(() => !!this.token());

  register(data: {
    username: string;
    password: string;
  }): Observable<unknown> {

    return this.http.post(
      `${API_BASE_URL}/auth/register`,
      data
    );
  }

  login(data: {
    username: string;
    password: string;
  }): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${API_BASE_URL}/auth/login`,
      data
    ).pipe(

      tap(response => {

        const jwt =
          response.token ?? response.data?.token;

        if (!jwt) {
          throw new Error('JWT token missing in login response');
        }

        sessionStorage.setItem(this.tokenKey, jwt);

        this.token.set(jwt);

      })

    );
  }

  logout(): void {

    sessionStorage.removeItem(this.tokenKey);

    this.token.set(null);

  }
}