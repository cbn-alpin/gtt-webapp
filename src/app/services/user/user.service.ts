import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

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

  getAllUsers(): Observable<any> {
    const url = `${this.baseUrl}/users`;
    return this.http.get(url, this.getHttpOptions());
  }

  updateUserById(userId: number, userData: any): Observable<any> {
    const url = `${this.baseUrl}/users/${userId}`;
    return this.http.put(url, userData, this.getHttpOptions());
  }  

}
