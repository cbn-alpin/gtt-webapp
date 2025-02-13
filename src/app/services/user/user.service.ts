import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = 'http://127.0.0.1:5000/api';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http : HttpClient) { }

  getAllUsers(): Observable<any> {
    const url = `${this.baseUrl}/users`;
    return this.http.get(url, this.httpOptions);
  }

  updateUserById(userId: number, userData: any): Observable<any> {
    const url = `${this.baseUrl}/users/${userId}`;
    return this.http.put(url, userData, this.httpOptions);
  }  

}
