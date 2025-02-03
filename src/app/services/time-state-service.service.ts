import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeStateService {

  public selectedDate = new BehaviorSubject<Date>(new Date());

  constructor() { }

  // Observable to provide the selected date
  selectedDateSignal() {
    return this.selectedDate.asObservable();
  }

  // Update the selected date
  updateSelectedDate(date: Date) {
    this.selectedDate.next(date);
  }

  // Get the start of the current week (Monday)
  getStartOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust if Sunday (0)
    start.setDate(diff);
    return start;
  }

  // Navigate to the previous week
  goToPreviousWeek(currentDate: Date): Date {
    const previousWeek = new Date(currentDate);
    previousWeek.setDate(currentDate.getDate() - 7);
    this.updateSelectedDate(previousWeek);  // Update selected date for both components
    return previousWeek;
  }

  // Navigate to the next week
  goToNextWeek(currentDate: Date): Date {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);
    this.updateSelectedDate(nextWeek);  // Update selected date for both components
    return nextWeek;
  }

  // Get the current week
  get currentWeek() {
    const startOfWeek = this.getStartOfWeek(this.selectedDate.value);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push({
        date: day,
        name: this.getDayName(day),
        isWeekend: day.getDay() === 0 || day.getDay() === 6,
        isToday: this.isToday(day)
      });
    }
    return days;
  }

  // Helper function to get the name of the day
  getDayName(date: Date): string {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];  // Starts with Monday
    return days[date.getDay()];
  }

  // Check if a given date is today
  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }
}
