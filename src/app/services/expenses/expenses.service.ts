import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

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

  createTravelExpense(userId: number, project_id : number,  travelData: any): Observable<any> {
    const url = `${this.baseUrl}/user/${userId}/project/${project_id}/travels/`; 
    return this.http.post(url, travelData, this.getHttpOptions());
  }

  getUserAllTravelsExpenses(userId: number, date_start: string, date_end: string): Observable<any> {
    const url = `${this.baseUrl}/travels/user/${userId}?date_start=${date_start}&date_end=${date_end}`;
    return this.http.get(url, this.getHttpOptions());
  }

  updateUserTravelExpense(travelId: number, userId: number, travelData: any): Observable<any> {
    const url = `${this.baseUrl}/travels/${travelId}/user/${userId}`;
    return this.http.put(url, travelData, this.getHttpOptions());
  }  

  createMissionExpense( missionData: any): Observable<any> {
    const url = `${this.baseUrl}/expenses`; 
    return this.http.post(url, missionData, this.getHttpOptions());
  }

  deleteUserTravelExpense(travelId: number, userId: number): Observable<any> {
    const url = `${this.baseUrl}/travels/${travelId}/user/${userId}`; 
    return this.http.delete(url, this.getHttpOptions());
  }

}
