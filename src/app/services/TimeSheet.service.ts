import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimeSheetService  {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl;

   private getHttpOptions() {
      const token = localStorage.getItem('access_token'); 
      
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        })
      };
    }
  

  getUserProjects(userId: string, dateStart: String, dateEnd: String): Observable<any[]> {
    const url = `${this.apiUrl}/user/${userId}/projects/times?date_start=${dateStart}&date_end=${dateEnd}`;
    return this.http.get<any[]>(url, this.getHttpOptions());
  }

  saveUserTime(userId: string, actionId: number, date: string, duration: number): Observable<any> {

    const url = `${this.apiUrl}/user/${userId}/projects/times`;

    const body = {
      date: date,
      duration: duration,
      id_action: actionId
    };

    return this.http.post<any>(url, body, this.getHttpOptions());
  }

}
