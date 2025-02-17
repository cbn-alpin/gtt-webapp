import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';


interface AuthResponse {
  token: string; // Token issued by your backend after verifying the Google token
} 

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  baseUrl = environment.apiUrl;
  
  private getHttpOptions() {
    const token = localStorage.getItem('access_token'); 
    
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
  }

  // Private token variable
  private _token: string | null = localStorage.getItem('access_token');
  // BehaviorSubject to track authentication state
  private authSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  // Public observable to subscribe to auth changes
  authState$: Observable<boolean> = this.authSubject.asObservable();

  constructor(private http : HttpClient, private router: Router) { }

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
   * Sends the Google JWT to the backend for verification and retrieves your app's token.
   * @param googleToken - The token received from Google Identity Services.
   */
  loginWithGoogle(googleToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/google', { token: googleToken })
      .pipe(
        tap((response: AuthResponse) => {
          // Save the backend-issued token and update the authentication state
          this._token = response.token;
          localStorage.setItem('access_token', response.token);
          this.authSubject.next(true);
        }));
  }

   /**
   * Logs the user out.
   */
  //  logout(): void {
  //   this._token = null;
  //   localStorage.removeItem('access_token');
  //   this.authSubject.next(false);
  //   // Optionally, you can add further cleanup or navigate to the login route.
  // }
  
}
