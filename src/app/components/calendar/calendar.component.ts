import { Component, Injectable, OnInit } from '@angular/core';
import { DateTime, Info, Interval } from 'luxon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CalendarService } from 'src/app/services/calendar.service';
import { TimeStateService } from 'src/app/services/time-state-service.service';
import { PopupMessageComponent } from 'src/app/popup-message/popup-message.component';
import { MatDialog } from '@angular/material/dialog';
import { TimeSheetService } from 'src/app/services/TimeSheet.service';

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
  firstDayOfActiveMonth = new BehaviorSubject<DateTime>(this.calendarService.today().startOf('month'));
  holidays: { [date: string]: string } = {};
  weekDays = this.timeStateService.currentWeek;
  projects: any[] = [];
  userId: number = 1;
  fixedRows: any[] = [];

  private timeEntries: Map<string, number> = new Map();
  startDate: DateTime<boolean>= DateTime.local();
  endDate: DateTime<boolean>= DateTime.local();

  constructor(private calendarService: CalendarService, private http: HttpClient,  private timeStateService: TimeStateService,
    private dialog: MatDialog, private timeSheetService: TimeSheetService
  ) {
    const activeMonth = this.firstDayOfActiveMonth.value;
    this.selectedMonth = activeMonth.month;
    this.selectedYear = activeMonth.year;
    this.selectedWeek = activeMonth.weekNumber;

    this.updateStartEndDate();
  }

  ngOnInit(): void {
    this.loadProjects();
    this.calendarService.fetchHolidays().subscribe(
      (data) => {
        this.calendarService.setHolidays(data);
        this.holidays = data;
      },
      (error) => console.error('Error fetching holidays:', error)
    );

    const today = this.calendarService.today();
    this.selectedWeek = today.weekNumber;
    this.selectedMonth = today.month;
    this.selectedYear = today.year;
    this.currentWeek = this.calendarService.getCurrentWeek(today);
    this.timeStateService.updateSelectedDate(today.toJSDate());
    this.timeStateService.selectedDateSignal().subscribe(() => {
      this.weekDays = this.timeStateService.currentWeek;
    });

  }
  updateStartEndDate() {
    const activeWeek = this.firstDayOfActiveMonth.value;
    this.startDate = activeWeek.startOf('month');
    this.endDate = activeWeek.endOf('month');
  }

  today = this.calendarService.today();


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
  weeksNumbers: number[]= Array.from({length: 52}, (_, i) => 1+i);
  years: number[] = Array.from({ length: 30 }, (_, i) => 2000 + i);
  selectedMonth: number = this.firstDayOfActiveMonth.getValue().month;
  selectedYear: number = this.firstDayOfActiveMonth.getValue().year;
  selectedWeek: number = this.firstDayOfActiveMonth.getValue().weekNumber;


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
    this.selectedWeek = today.weekNumber;
    this.timeStateService.updateSelectedDate(today.toJSDate());
    this.updateStartEndDate();
    this.loadProjects();
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  onMonthChange(): void {
    const newDate = this.firstDayOfActiveMonth.getValue().set({ month: this.selectedMonth });
    this.firstDayOfActiveMonth.next(newDate);
    this.updateToFirstWeekOfMonth(newDate);
    const activeMonth = DateTime.local(this.selectedYear, this.selectedMonth, 1);
    this.firstDayOfActiveMonth.next(activeMonth);
    this.updateStartEndDate();
    this.loadProjects();
  }

  onYearChange(): void {
    const newDate = this.firstDayOfActiveMonth.getValue().set({ year: this.selectedYear });
    this.firstDayOfActiveMonth.next(newDate);
    this.updateToFirstWeekOfMonth(newDate);
    const activeMonth = DateTime.local(this.selectedYear, this.selectedMonth, 1);
    this.firstDayOfActiveMonth.next(activeMonth);
    this.updateStartEndDate();
    this.loadProjects();
  }
  onWeekChange(): void {
    const selectedWeekNumber = this.selectedWeek;
    const firstDayOfYear = DateTime.local(this.selectedYear, 1, 1);
    const startOfSelectedWeek = firstDayOfYear.plus({ weeks: selectedWeekNumber - 1 }).startOf('week');

    this.currentWeek = this.calendarService.getCurrentWeek(startOfSelectedWeek);
    this.timeStateService.updateSelectedDate(startOfSelectedWeek.toJSDate());


    if (startOfSelectedWeek.month !== this.firstDayOfActiveMonth.getValue().month) {
      this.firstDayOfActiveMonth.next(startOfSelectedWeek.startOf('month'));
      this.selectedMonth = startOfSelectedWeek.month;
      this.selectedYear = startOfSelectedWeek.year;
    }
    this.updateStartEndDate();
    this.loadProjects();
  }
  updateToFirstWeekOfMonth(date: DateTime): void {
    const firstDayOfMonth = date.startOf('month');
    this.currentWeek = this.calendarService.getCurrentWeek(firstDayOfMonth);
    this.timeStateService.updateSelectedDate(firstDayOfMonth.toJSDate());
    if (this.currentWeek.start) {
      this.selectedWeek = this.currentWeek.start.weekNumber;
      this.selectedMonth = this.currentWeek.start.month;
      this.selectedYear = this.currentWeek.start.year;
    }
  }

  isHoliday(date: Date | DateTime): boolean {
    const dateTime = date instanceof Date ? DateTime.fromJSDate(date) : date;
    return this.calendarService.isHoliday(dateTime);
  }
  goToPreviousWeek(): void {
    const previousWeekStart = this.timeStateService.goToPreviousWeek(this.timeStateService.selectedDate.value);
    this.currentWeek = this.calendarService.goToPreviousWeek(this.currentWeek);
    if (this.currentWeek.start ) {
      this.selectedWeek = this.currentWeek.start.weekNumber;
      this.selectedMonth = this.currentWeek.start.month;
      this.selectedYear = this.currentWeek.start.year;
      if( this.currentWeek.start.month !== this.firstDayOfActiveMonth.getValue().month){
        this.firstDayOfActiveMonth.next(this.currentWeek.start.startOf('month'));
        this.updateStartEndDate();
    this.loadProjects();
      }
    }

  }

  goToNextWeek(): void {
    const nextWeekStart = this.timeStateService.goToNextWeek(this.timeStateService.selectedDate.value);
    this.currentWeek = this.calendarService.goToNextWeek(this.currentWeek);
    if (this.currentWeek.start ) {
      this.selectedWeek = this.currentWeek.start.weekNumber;
      this.selectedMonth = this.currentWeek.start.month;
      this.selectedYear = this.currentWeek.start.year;
      if( this.currentWeek.start.month !== this.firstDayOfActiveMonth.getValue().month){
        this.firstDayOfActiveMonth.next(this.currentWeek.start.startOf('month'));
        this.updateStartEndDate();
    this.loadProjects();
      }
    }


  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }

  getTimeEntry(projectId: number, actionId: number, date: string) {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    let source;
    if (projectId === 0) {
      source = this.fixedRows;
    } else {
      source = this.projects;
    }

    const project = source.find(p => p.id_project === projectId);
    if (!project) return { hours: 0 };

    const action = project.list_action.find((a: any) => a.id_action === actionId);
    if (!action) return { hours: 0 };

    const timeEntry = action.list_time.find((t: any) =>
      new Date(t.date).toISOString().split('T')[0] === formattedDate
    );

    return timeEntry ? { hours: Number(timeEntry.duration) } : { hours: 0 };
}

updateTimeEntry(value: number, projectId: number, actionId: number, date: string) {
  if (value > 10.25) {
    this.dialog.open(PopupMessageComponent, {
      data: {
        title: 'Erreur',
        message: 'Quota horaire journalier maximum atteint'
      }
    });
    return;
  }

  if (value >= 7.50 && value <= 10.00) {
    this.dialog.open(PopupMessageComponent, {
      data: {
        title: 'Avertissement',
        message: 'Attention : saisie supérieure à 7,50h uniquement si déplacement'
      }
    });
  }
  if (isNaN(value) || value < 0 || value > 10) {
    console.warn("Valeur invalide :", value);
    return;
  }

  const formattedDate = new Date(date).toISOString().split('T')[0];

  let source;
  if (projectId === 0) {
    source = this.fixedRows;
  } else {
    source = this.projects;
  }

  const project = source.find(p => p.id_project === projectId);
  if (!project) return;

  const action = project.list_action.find((a: any) => a.id_action === actionId);
  if (!action) return;

  let timeEntry = action.list_time.find((t: any) =>
    new Date(t.date).toISOString().split('T')[0] === formattedDate
  );

  if (timeEntry) {
    timeEntry.duration = value.toString();
  } else {
    action.list_time.push({ date: formattedDate, duration: value.toString() });
  }
   // Call the saveUserTime method to save the time in the database
   this.timeSheetService.saveUserTime(this.userId, actionId, formattedDate, value).subscribe(
    (response) => {
      console.log('Time saved successfully:', response);
    },
    (error) => {
      console.error('Error saving time:', error);
    }
  );
}


calculateWeekTotal(projectId: number, actionId: number): number {
  let total = 0;

  this.weekDays.forEach(day => {
      const dateStr = this.formatApiDate(this.toLuxonDate(day.date));
      const timeEntry = this.getTimeEntry(projectId, actionId, dateStr);

      if (timeEntry && timeEntry.hours) {
          total += timeEntry.hours;
      }
  });
  return total;
}

  calculateYearTotal(projectId: number , actionId: number): number {
    return this.calculateWeekTotal(projectId, actionId) ;
  }

  calculateDayTotal(date: Date): number {
    let total = 0;
    const formattedDate = this.formatApiDate(this.toLuxonDate(date));

    if (!this.projects || !Array.isArray(this.projects)) {
        console.warn('calculateDayTotal: this.projects est undefined ou n\'est pas un tableau');
        return total;
    }

    this.projects.forEach((project: { id_project: number; list_action: { id_action: number }[] }) => {
        if (!project.list_action || !Array.isArray(project.list_action)) {
            console.warn(`calculateDayTotal: project.list_action est undefined ou n'est pas un tableau pour project ${project.id_project}`);
            return;
        }

        project.list_action.forEach((action: { id_action: number }) => {
            const entry = this.getTimeEntry(project.id_project, action.id_action, formattedDate);
            if (entry && typeof entry.hours === 'number') {
                total += entry.hours;
            }
        });
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


  loadProjects(): void {
    const formattedStartDate = this.startDate.toISODate() ;
    const formattedEndDate = this.endDate.toISODate();
    console.log("Formatted Start Date: ", formattedStartDate);
    console.log("Formatted End Date: ", formattedEndDate);
    if (formattedStartDate && formattedEndDate) {
    this.timeSheetService.getUserProjects(this.userId, formattedStartDate, formattedEndDate).subscribe(

      (data) => {
        this.projects = data.filter((project: any) => project.id_project !== 0);
        this.fixedRows = [data.find((project: any) => project.id_project === 0)];

        console.log("Projets chargés :", this.projects);
        console.log("Actions fixes chargées (fixedRows) :", this.fixedRows);
      },
      (error) => {
        console.error('Erreur lors du chargement des projets', error);
      }
    );
  }
  }
  formatApiDate(date: DateTime): string {
    return date.toFormat("yyyy-MM-dd'T'HH:mm:ss");
  }
  toLuxonDate(date: Date): DateTime {
    return DateTime.fromJSDate(date);
  }


}
