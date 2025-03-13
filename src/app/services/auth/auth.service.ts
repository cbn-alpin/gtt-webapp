import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  baseUrl = environment.apiUrl;

  // Private token variable
  private _token: string | null = localStorage.getItem('access_token');

  // BehaviorSubject to track authentication state
  private authSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  // Public observable to subscribe to auth changes
  authState$: Observable<boolean> = this.authSubject.asObservable();

  private getHttpOptions() {
    const token = localStorage.getItem('access_token');

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }


  constructor(private http: HttpClient, private router: Router) { }

  // Service pour la connexion native à gtt
  nativeAuthenticate(credentials: { login: string, password: string }): Observable<any> {
    const url = `${this.baseUrl}/auth/gtt`;
    return this.http.post(url, credentials, this.getHttpOptions());
  }

  logout() {
    //Supprime toutes les informations stockées localement
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('id_user');
    this._token = null;
    this.authSubject.next(false);

    //Redirige vers la page de connexion
    this.router.navigate(['/connexion']);
  }

  get token(): string | null {
    return this._token;
  }

  isAuthenticated(): boolean {
    return !!this._token;
  }

  /**
   * Sends the Google ID token from One Tap to the backend for verification.
   * The backend should verify the token with Google and then issue your app's token.
   * @param googleToken - The ID token received from Google One Tap.
   */
  loginWithGoogle(googleToken: string): Observable<AuthResponse> {
    const url = `${this.baseUrl}/auth/google`;
    return this.http.post<AuthResponse>(url, { token: googleToken })
      .pipe(
        tap((response: AuthResponse) => {
          this._token = response.token;
          localStorage.setItem('access_token', response.token);
          this.authSubject.next(true);
          console.log("Google One Tap login response:", response);
        })
      );
  }

  /**
   * Sends the Google authorization code (from the popup) to the backend.
   * The backend exchanges this code for tokens with Google and then issues your app's token.
   * @param googleCode - The authorization code received from the popup flow.
   */
  loginWithGoogleCode(googleCode: string): Observable<AuthResponse> {
    const url = `${this.baseUrl}/auth/google`;
    return this.http.post<AuthResponse>(url, { code: googleCode })
      .pipe(
        tap((response: AuthResponse) => {
          this._token = response.token;
          localStorage.setItem('access_token', response.token);
          this.authSubject.next(true);
          console.log("Google popup login response:", response);
        })
      );
  }


}
