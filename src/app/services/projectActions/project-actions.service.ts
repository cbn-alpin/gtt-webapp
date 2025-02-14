import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectActionsService {

  baseUrl = 'http://127.0.0.1:5001/api';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http : HttpClient) {}

  createProjectAction(actionData: any): Observable<any> {
    const url = `${this.baseUrl}/actions`; 
    return this.http.post(url, actionData, this.httpOptions);
  }

  updateActionById(actionId: number, actionData: any): Observable<any> {
    const url = `${this.baseUrl}/actions/${actionId}`; 
    return this.http.put(url, actionData, this.httpOptions);
  }

  deleteActionById(actionId: number): Observable<any> {
    const url = `${this.baseUrl}/actions/${actionId}`;
    return this.http.delete(url, this.httpOptions);
  }
  
  getUserProjects(userId: number): Observable<any> {
    const url = `${this.baseUrl}/user/${userId}/project`;
    return this.http.get(url, this.httpOptions);
  }
}
