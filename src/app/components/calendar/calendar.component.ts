import { Component, Injectable, OnInit } from '@angular/core';
import { DateTime, Info, Interval } from 'luxon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
@Injectable({
  providedIn: 'root',
})
export class CalendarComponent implements OnInit {
  holidays: { [date: string]: string } = {};

  constructor(private calendarService: CalendarService, private http: HttpClient) {}

  ngOnInit(): void {
    this.calendarService.fetchHolidays().subscribe(
      (data) => {
        this.calendarService.setHolidays(data);
        this.holidays = data;
      },
      (error) => console.error('Error fetching holidays:', error)
    );
  }

  today = this.calendarService.today();


  firstDayOfActiveMonth = new BehaviorSubject<DateTime>(this.calendarService.today().startOf('month'));
  activeDay = new BehaviorSubject<DateTime | null>(null);
  weekDays = Info.weekdays('short');
  currentWeek = this.calendarService.getCurrentWeek(this.today);

  
  get daysOfMonth() {
    return this.calendarService.getDaysOfMonth(this.firstDayOfActiveMonth.getValue());
  }

  DATE_MED = DateTime.DATE_MED;

  months = [
    { name: 'Janvier', index: 1 },
    { name: 'Février', index: 2 },
    { name: 'Mars', index: 3 },
    { name: 'Avril', index: 4 },
    { name: 'Mai', index: 5 },
    { name: 'Juin', index: 6 },
    { name: 'Juillet', index: 7 },
    { name: 'août', index: 8 },
    { name: 'Septembre', index: 9 },
    { name: 'Octobre', index: 10 },
    { name: 'Novembre', index: 11 },
    { name: 'Décembre', index: 12 }
  ];

  years: number[] = Array.from({ length: 30 }, (_, i) => 2000 + i);
  selectedMonth: number = this.firstDayOfActiveMonth.getValue().month;
  selectedYear: number = this.firstDayOfActiveMonth.getValue().year;

  setActiveDay(day: DateTime): void {
    this.activeDay.next(day);
    this.currentWeek = this.calendarService.getCurrentWeek(day);
  }

  isToday(day: DateTime): boolean {
    return this.calendarService.isToday(day);
  }

  isInCurrentWeek(day: DateTime): boolean {
    return this.calendarService.isInCurrentWeek(day, this.currentWeek);
  }

  goToToday(): void {
    const today = this.calendarService.today();
    this.firstDayOfActiveMonth.next(today.startOf('month'));
    this.currentWeek = Interval.fromDateTimes(today.startOf('week'), today.endOf('week'));
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  onMonthChange(): void {
    this.firstDayOfActiveMonth.next(this.firstDayOfActiveMonth.getValue().set({ month: this.selectedMonth }));
  }

  onYearChange(): void {
    this.firstDayOfActiveMonth.next(this.firstDayOfActiveMonth.getValue().set({ year: this.selectedYear }));
  }

  isHoliday(day: DateTime): boolean {
    return this.calendarService.isHoliday(day);
  }

  goToPreviousWeek(): void {
    this.currentWeek = this.calendarService.goToPreviousWeek(this.currentWeek);
    if (this.currentWeek.start && this.currentWeek.start.month !== this.firstDayOfActiveMonth.getValue().month) {
      this.firstDayOfActiveMonth.next(this.currentWeek.start.startOf('month'));
    }
  }

  goToNextWeek(): void {
    this.currentWeek = this.calendarService.goToNextWeek(this.currentWeek);
    if (this.currentWeek.start && this.currentWeek.start.month !== this.firstDayOfActiveMonth.getValue().month) {
      this.firstDayOfActiveMonth.next(this.currentWeek.start.startOf('month'));
    }
  }
}
