import { Component, Injectable, OnInit } from '@angular/core';
import { DateTime, Info, Interval } from 'luxon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CalendarService } from 'src/app/services/calendar.service';
import { TimeStateService } from 'src/app/services/time-state-service.service';

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
  weekDays = this.timeStateService.currentWeek;

  fixedRows = [
    { id: 'absence', name: 'Absence' },
    { id: 'service', name: 'Service' },
    { id: 'formation', name: 'Formation' }
  ];

  projects = [
    {
      id: 1,
      name: "Projet 1",
      actions: [
        { id: 1, name: "Action 1.1", description: "Description de l'action 1.1" },
        { id: 2, name: "Action 1.2", description: "Description de l'action 1.2" }
      ]
    },
    {
      id: 2,
      name: "Projet 2",
      actions: [
        { id: 3, name: "Action 2.1", description: "Description de l'action 2.1" }
      ]
    }
  ];

  private timeEntries: Map<string, number> = new Map();
  constructor(private calendarService: CalendarService, private http: HttpClient,  private timeStateService: TimeStateService) {

  }

  ngOnInit(): void {
    this.calendarService.fetchHolidays().subscribe(
      (data) => {
        this.calendarService.setHolidays(data);
        this.holidays = data;
      },
      (error) => console.error('Error fetching holidays:', error)
    );
    this.timeStateService.selectedDateSignal().subscribe(date => {
      this.weekDays = this.timeStateService.currentWeek;
    });
  }

  today = this.calendarService.today();

  firstDayOfActiveMonth = new BehaviorSubject<DateTime>(this.calendarService.today().startOf('month'));
  activeDay = new BehaviorSubject<DateTime | null>(null);
  weekDaysNames = Info.weekdays('short');
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
    this.timeStateService.updateSelectedDate(day.toJSDate());
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
    this.timeStateService.updateSelectedDate(today.toJSDate());
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  onMonthChange(): void {
    const newDate = this.firstDayOfActiveMonth.getValue().set({ month: this.selectedMonth });
    this.firstDayOfActiveMonth.next(newDate);
    this.updateToFirstWeekOfMonth(newDate);
  }

  onYearChange(): void {
    const newDate = this.firstDayOfActiveMonth.getValue().set({ year: this.selectedYear });
    this.firstDayOfActiveMonth.next(newDate);
    this.updateToFirstWeekOfMonth(newDate);
  }
  updateToFirstWeekOfMonth(date: DateTime): void {
    const firstDayOfMonth = date.startOf('month');
    this.currentWeek = this.calendarService.getCurrentWeek(firstDayOfMonth);
    this.timeStateService.updateSelectedDate(firstDayOfMonth.toJSDate());
  }

  isHoliday(day: DateTime): boolean {
    return this.calendarService.isHoliday(day);
  }

  goToPreviousWeek(): void {
    const previousWeekStart = this.timeStateService.goToPreviousWeek(this.timeStateService.selectedDate.value);
    this.currentWeek = this.calendarService.goToPreviousWeek(this.currentWeek);
    if (this.currentWeek.start && this.currentWeek.start.month !== this.firstDayOfActiveMonth.getValue().month) {
      this.firstDayOfActiveMonth.next(this.currentWeek.start.startOf('month'));
    }
  }

  goToNextWeek(): void {
    const nextWeekStart = this.timeStateService.goToNextWeek(this.timeStateService.selectedDate.value);
    this.currentWeek = this.calendarService.goToNextWeek(this.currentWeek);
    if (this.currentWeek.start && this.currentWeek.start.month !== this.firstDayOfActiveMonth.getValue().month) {
      this.firstDayOfActiveMonth.next(this.currentWeek.start.startOf('month'));
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }

  getTimeEntry(projectId: number | string, actionId: number, date: Date): { hours: number } {
    const key = `${projectId}-${actionId}-${date.toISOString()}`;
    return { hours: this.timeEntries.get(key) || 0 };
  }

  updateTimeEntry(hours: number, projectId: number | string, actionId: number, date: Date) {
    const key = `${projectId}-${actionId}-${date.toISOString()}`;
    this.timeEntries.set(key, hours);
    this.autoSave(projectId, actionId, date, hours);
  }

  calculateWeekTotal(projectId: number | string, actionId: number): number {
    let total = 0;
    this.weekDays.forEach(day => {
      total += this.getTimeEntry(projectId, actionId, day.date).hours;
    });
    return total;
  }

  calculateYearTotal(projectId: number | string, actionId: number): number {
    return this.calculateWeekTotal(projectId, actionId) ;
  }

  calculateDayTotal(date: Date): number {
    let total = 0;
    this.projects.forEach(project => {
      project.actions.forEach(action => {
        total += this.getTimeEntry(project.id, action.id, date).hours;
      });
    });
    this.fixedRows.forEach(row => {
      total += this.getTimeEntry(row.id, 0, date).hours;
    });
    return total;
  }

  getInputId(projectId: number | string, actionId: number, date: Date): string {
    return `input-${projectId}-${actionId}-${date.toISOString()}`;
  }

  autoSave(projectId: number | string, actionId: number, date: Date, hours: number) {
    console.log('Auto-saving:', { projectId, actionId, date, hours });
  }

  trackByDate(index: number, item: any): string {
    return item.date.toISOString();
  }

  trackById(index: number, item: any): number {
    return item.id;
  }
}
