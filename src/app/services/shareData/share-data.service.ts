import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  constructor() { }

  private travelIdSource = new BehaviorSubject<number | null>(null);
  travelId$ = this.travelIdSource.asObservable();

  private travelExpenseValidatedSource = new Subject<void>();
  travelExpenseValidated$ = this.travelExpenseValidatedSource.asObservable();

  setTravelId(id: number) {
    this.travelIdSource.next(id);
  }

  validateTravelExpense() {
    this.travelExpenseValidatedSource.next();
  }
}
