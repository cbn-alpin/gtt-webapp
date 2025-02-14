import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectActionsService {

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

  constructor(private http : HttpClient) {}

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
}
