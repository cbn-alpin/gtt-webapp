import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeSheetService  {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:5000/api/user';

  getUserProjects(userId: string, dateStart: String, dateEnd: String): Observable<any[]> {
    const url = `${this.apiUrl}/${userId}/projects/times?date_start=${dateStart}&date_end=${dateEnd}`;
    return this.http.get<any[]>(url);
  }

  saveUserTime(userId: string, actionId: number, date: string, duration: number): Observable<any> {

    const url = `${this.apiUrl}/${userId}/projects/times`;

    const body = {
      date: date,
      duration: duration,
      id_action: actionId
    };

    return this.http.post<any>(url, body);
  }

}
