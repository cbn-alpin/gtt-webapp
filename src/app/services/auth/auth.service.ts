import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://127.0.0.1:5000/api';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http : HttpClient, private router: Router) { }

  // Service pour la connexion native à gtt
  nativeAuthenticate(credentials: { login: string, password: string }): Observable<any> {
    const url = `${this.baseUrl}/auth/gtt`;
   return this.http.post(url, credentials, this.httpOptions);
  }

  logout() {
    //Supprime toutes les informations stockées localement
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('id_user');

    //Redirige vers la page de connexion
    this.router.navigate(['/connexion']);
  }
}
