import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectActionsService {
  private readonly baseUrl = environment.apiUrl;

  private readonly http = inject(HttpClient);

  createProjectAction(actionData: any): Observable<any> {
    const url = `${this.baseUrl}/actions`;
    return this.http.post(url, actionData, this.getHttpOptions());
  }

  updateActionById(actionId: number, actionData: any): Observable<any> {
    const url = `${this.baseUrl}/actions/${actionId}`;
    return this.http.put(url, actionData, this.getHttpOptions());
  }

  deleteActionById(actionId: number): Observable<any> {
    const url = `${this.baseUrl}/actions/${actionId}`;
    return this.http.delete(url, this.getHttpOptions());
  }

  getUserProjects(userId: number): Observable<any> {
    const url = `${this.baseUrl}/user/${userId}/project`;
    return this.http.get(url, this.getHttpOptions());
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
