import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private getHttpOptions() {
    const token = localStorage.getItem('access_token');

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getAllUsers(): Observable<User[]> {
    const url = `${this.baseUrl}/users`;
    return this.http.get<User[]>(url, this.getHttpOptions());
  }

  updateUserById(userId: number, userData: Partial<User>): Observable<User> {
    const url = `${this.baseUrl}/users/${userId}`;
    return this.http.put<User>(url, userData, this.getHttpOptions());
  }
}
