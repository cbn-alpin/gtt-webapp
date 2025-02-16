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

  getUserTravelsExpenses(userId: number): Observable<any> {
    const url = `${this.baseUrl}/travels/user/${userId}`;
    return this.http.get(url, this.getHttpOptions());
  }

}
