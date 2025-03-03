import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
  private travelExpenseValidated = new Subject<void>();
  travelExpenseValidated$ = this.travelExpenseValidated.asObservable();

  private newTravelIdSubject = new Subject<number>();
  newTravelId$ = this.newTravelIdSubject.asObservable();

  private missionExpensesProcessed = new Subject<boolean>(); 
  missionExpensesProcessed$ = this.missionExpensesProcessed.asObservable();

  validateTravelExpense() {
    this.travelExpenseValidated.next();
  }

  sendTravelId(id: number) {
    this.newTravelIdSubject.next(id);
  }

  notifyMissionExpensesProcessed(success: boolean) {
    this.missionExpensesProcessed.next(success);
  }

  formatDate(date : string): string {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (regex.test(date)) {
      return date; 
    }
    const [year, month, day] = date.split('-'); 
    return `${day}/${month}/${year}`;
  }
}
