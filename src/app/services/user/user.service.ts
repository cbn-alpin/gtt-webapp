import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UserInfos } from 'src/app/models/user-infos.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  getAllUsers(): Observable<Partial<UserInfos>[]> {
    const url = `${this.baseUrl}/users`;
    return this.http.get<Partial<UserInfos>[]>(url, this.getHttpOptions());
  }

  updateUserById(userId: number, userData: Partial<UserInfos>): Observable<UserInfos> {
    const url = `${this.baseUrl}/users/${userId}`;
    return this.http.put<UserInfos>(url, userData, this.getHttpOptions());
  }

  private getHttpOptions() {
    const token = localStorage.getItem('access_token');

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }
}
