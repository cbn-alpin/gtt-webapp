import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserActionService {
  private readonly baseUrl = environment.apiUrl;

  private readonly http = inject(HttpClient);

  createUserAction(user_id: number, action_id: number): Observable<any> {
    const url = `${this.baseUrl}/user/${user_id}/action/${action_id}`;
    return this.http.post(url, {}, this.getHttpOptions());
  }

  deleteUserAction(user_id: number, action_id: number): Observable<any> {
    const url = `${this.baseUrl}/user/${user_id}/action/${action_id}`;
    return this.http.delete(url, this.getHttpOptions());
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
