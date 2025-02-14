import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserActionService {
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

  constructor(private http : HttpClient) { }

  createUserAction(user_id: number, action_id: number): Observable<any> {
    const url = `${this.baseUrl}/user/${user_id}/action/${action_id}`; 
    return this.http.post(url, this.getHttpOptions());
  }

   deleteUserAction(user_id: number, action_id: number): Observable<any> {
    const url = `${this.baseUrl}/user/${user_id}/action/${action_id}`; 
    return this.http.delete(url, this.getHttpOptions());
  }
}
