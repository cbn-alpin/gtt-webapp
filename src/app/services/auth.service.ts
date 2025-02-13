// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface AuthResponse {
  token: string; // Token issued by your backend after verifying the Google token
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Private token variable
  private _token: string | null = localStorage.getItem('access_token');

  // BehaviorSubject to track authentication state
  private authSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  // Public observable to subscribe to auth changes
  authState$: Observable<boolean> = this.authSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Returns the current token.
   */
  get token(): string | null {
    return this._token;
  }

  /**
   * Checks whether the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this._token;
  }

  /**
   * Sends the Google JWT to the backend for verification and retrieves your app's token.
   * @param googleToken - The token received from Google Identity Services.
   */
  loginWithGoogle(googleToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/google', { token: googleToken })
      .pipe(
        tap((response: AuthResponse) => {
          // Save the backend-issued token and update the authentication state
          this._token = response.token;
          localStorage.setItem('app_token', response.token);
          this.authSubject.next(true);
        })
      );
  }

  /**
   * Logs the user out.
   */
  logout(): void {
    this._token = null;
    localStorage.removeItem('app_token');
    this.authSubject.next(false);
    // Optionally, you can add further cleanup or navigate to the login route.
  }
}
