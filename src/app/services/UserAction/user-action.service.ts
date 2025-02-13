import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from 'src/main';

@Injectable({
  providedIn: 'root'
})
export class UserActionService {
  baseUrl = APP_CONFIG.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http : HttpClient) { }

  createUserAction(user_id: number, action_id: number): Observable<any> {
    const url = `${this.baseUrl}/user/${user_id}/action/${action_id}`; 
    return this.http.post(url, this.httpOptions);
  }

   deleteUserAction(user_id: number, action_id: number): Observable<any> {
    const url = `${this.baseUrl}/user/${user_id}/action/${action_id}`; 
    return this.http.delete(url, this.httpOptions);
  }
}
