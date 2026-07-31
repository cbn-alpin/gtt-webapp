import { Component, OnInit } from '@angular/core';
import { DateTime, Info, Interval } from 'luxon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CalendarService } from 'src/app/services/calendar.service';
import { TimeStateService } from 'src/app/services/time-state-service.service';
import { PopupMessageComponent } from 'src/app/popup-message/popup-message.component';
import { MatDialog } from '@angular/material/dialog';
import { TimeSheetService } from 'src/app/services/TimeSheet.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
  templateUrl: './calendar.component.html',
  animations: [
    trigger('slideInOut', [
      state('out', style({ height: '0px', visibility: 'hidden' })),
      state('in', style({ height: '*', visibility: 'visible' })),
      transition('in => out', animate('225ms ease-out')),
      transition('out => in', animate('225ms ease-in')),
    ]),
    trigger('rotate', [
      state('down', style({ transform: 'rotate(0deg)' })),
      state('up', style({ transform: 'rotate(180deg)' })),
      transition('down <=> up', animate('225ms ease-in-out')),
    ]),
  ],
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  private readonly MAX_DAILY_HOURS = 10;
  readonly STANDARD_DAILY_WORKING_HOURS = 7.5;

  firstDayOfActiveMonth = new BehaviorSubject<DateTime>(
    this.calendarService.today().startOf('month')
  );
  holidays: Record<string, string> = {};
  weekDays = this.timeStateService.currentWeek;
  projects: any[] = [];
  userId: string = localStorage.getItem('id_user') || '0';
  fixedRows: any[] = [];

  startDate: DateTime<boolean> = DateTime.local();
  endDate: DateTime<boolean> = DateTime.local();
  isLoadingResults = false;

  today = this.calendarService.today();
  activeDay = new BehaviorSubject<DateTime | null>(null);
  weekDaysNames = Info.weekdays('short');
  currentWeek = this.calendarService.getCurrentWeek(this.today);

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
    { name: 'Décembre', index: 12 },
  ];
  weeksNumbers: number[] = Array.from({ length: 52 }, (_, i) => 1 + i);
  years: number[] = Array.from({ length: 30 }, (_, i) => 2000 + i);
  selectedMonth: number = this.firstDayOfActiveMonth.getValue().month;
  selectedYear: number = this.firstDayOfActiveMonth.getValue().year;
  selectedWeek: number = this.firstDayOfActiveMonth.getValue().weekNumber;

  timer: any = null;

  expandedProjects = new Set<number>();
  private readonly EXPANDED_PROJECTS_KEY = 'expandedProjectsState';

  constructor(
    private calendarService: CalendarService,
    private timeStateService: TimeStateService,
    private dialog: MatDialog,
    private timeSheetService: TimeSheetService
  ) {
    const activeMonth = this.firstDayOfActiveMonth.value;
    this.selectedMonth = activeMonth.month;
    this.selectedYear = activeMonth.year;
    this.selectedWeek = activeMonth.weekNumber;

    this.updateStartEndDate();
  }

  ngOnInit(): void {
    this.loadProjects();
    this.fetchHolidays();

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
  private fetchHolidays() {
    this.calendarService.fetchHolidays().subscribe({
      next: (data) => {
        this.calendarService.setHolidays(data);
        this.holidays = data;
      },
      error: (error) => console.error('Error fetching holidays:', error),
      complete: () => console.info('Holidays fetched successfully'),
    });
  }

    const activeWeek = this.firstDayOfActiveMonth.value;
    this.startDate = activeWeek.minus({ weeks: 1 }).startOf('month');
    this.endDate = activeWeek.endOf('month').plus({ weeks: 1 });
  }

  get daysOfMonth() {
    return this.calendarService.getDaysOfMonth(this.firstDayOfActiveMonth.getValue());
  }

  setActiveDay(day: DateTime): void {
    this.activeDay.next(day);
    this.currentWeek = this.calendarService.getCurrentWeek(day);
    this.timeStateService.updateSelectedDate(day.toJSDate());
    this.timeStateService.updateSelectedDate(day.toJSDate());
    this.selectedWeek = day.weekNumber;
    this.selectedMonth = day.month;
    this.selectedYear = day.year;

    this.updateStartEndDate();
    this.loadProjects();
  }

  toggleProject(project: any): void {
    if (!project || project.id_project === undefined) {
      return;
    }
    const projectId = project.id_project;
    if (this.expandedProjects.has(projectId)) {
      this.expandedProjects.delete(projectId);
      this.saveExpandedState();
    } else {
      this.expandedProjects.add(projectId);
      this.saveExpandedState();
    }
  }

  isProjectExpanded(project: any): boolean {
    return (
      project && project.id_project !== undefined && this.expandedProjects.has(project.id_project)
    );
  }

  toggleAllProjects(): void {
    if (this.areAllProjectsExpanded()) {
      this.expandedProjects.clear();
      this.saveExpandedState();
    } else {
      this.projects.forEach((project) => this.expandedProjects.add(project.id_project));
      this.fixedRows.forEach((project) => this.expandedProjects.add(project.id_project));
      this.saveExpandedState();
    }
  }

  areAllProjectsExpanded(): boolean {
    const totalProjects = this.projects.concat(this.fixedRows);
    if (!totalProjects || totalProjects.length === 0) {
      return false;
    }
    return this.expandedProjects.size === totalProjects.length;
  }

  private saveExpandedState(): void {
    localStorage.setItem(
      this.EXPANDED_PROJECTS_KEY,
      JSON.stringify(Array.from(this.expandedProjects))
    );
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
    this.selectedMonth = today.month;
    this.selectedYear = today.year;
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
    this.selectedWeek = newDate.weekNumber;
    this.selectedYear = newDate.year;
    this.updateToFirstWeekOfMonth(newDate);
    this.updateStartEndDate();
    this.loadProjects();
  }

  onYearChange(): void {
    const newDate = this.firstDayOfActiveMonth.getValue().set({ year: this.selectedYear });
    this.firstDayOfActiveMonth.next(newDate);
    this.selectedMonth = newDate.month;
    this.selectedWeek = newDate.weekNumber;
    this.updateToFirstWeekOfMonth(newDate);
    this.updateStartEndDate();
    this.loadProjects();
  }

  onWeekChange(): void {
    const selectedWeekNumber = this.selectedWeek;
    const firstDayOfYear = DateTime.local(this.selectedYear, 1, 1);
    const startOfSelectedWeek = firstDayOfYear
      .plus({ weeks: selectedWeekNumber - 1 })
      .startOf('week');

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
    const previousWeekStart = this.timeStateService.goToPreviousWeek(
      this.timeStateService.selectedDate.value
    );
    this.currentWeek = this.calendarService.goToPreviousWeek(this.currentWeek);
    if (this.currentWeek.start) {
      this.selectedWeek = this.currentWeek.start.weekNumber;
      this.selectedMonth = this.currentWeek.start.month;
      this.selectedYear = this.currentWeek.start.year;
      if (this.currentWeek.start.month !== this.firstDayOfActiveMonth.getValue().month) {
        this.firstDayOfActiveMonth.next(this.currentWeek.start.startOf('month'));
        this.updateStartEndDate();
        this.loadProjects();
      }
    }
  }

  goToNextWeek(): void {
    const nextWeekStart = this.timeStateService.goToNextWeek(
      this.timeStateService.selectedDate.value
    );
    this.currentWeek = this.calendarService.goToNextWeek(this.currentWeek);
    if (this.currentWeek.start) {
      this.selectedWeek = this.currentWeek.start.weekNumber;
      this.selectedMonth = this.currentWeek.start.month;
      this.selectedYear = this.currentWeek.start.year;
      if (this.currentWeek.start.month !== this.firstDayOfActiveMonth.getValue().month) {
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

    const project = source.find((p) => p.id_project === projectId);
    if (!project) return { hours: 0 };

    const action = project.list_action.find((a: any) => a.id_action === actionId);
    if (!action) return { hours: 0 };

    if (!project.list_action || !Array.isArray(project.list_action)) {
      return { hours: 0 };
    }

    const timeEntry = action.list_time.find(
      (t: any) => new Date(t.date).toISOString().split('T')[0] === formattedDate
    );

    return timeEntry ? { hours: Number(timeEntry.duration) } : { hours: 0 };
  }

  updateTimeEntry(
    value: number,
    projectId: number,
    end_date: Date,
    actionId: number,
    date: string,
    inputRef: HTMLInputElement,
    initialValue: number
  ) {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end_date);
    endDate.setHours(0, 0, 0, 0);

    let source;
    if (projectId === 0) {
      source = this.fixedRows;
    } else {
      source = this.projects;
    }

    const project = source.find((p) => p.id_project === projectId);
    if (!project) return;

    if (projectId !== 0) {
      if (end_date && selectedDate > endDate) {
        this.dialog.open(PopupMessageComponent, {
          data: {
            title: 'Erreur',
            message:
              'Vous ne pouvez pas saisir un temps pour une date qui dépasse la date de fin du projet.',
          },
        });

        inputRef.value = initialValue.toString();
        return;
      }

      if (value > this.MAX_DAILY_HOURS) {
        this.dialog.open(PopupMessageComponent, {
          data: {
            title: 'Erreur',
            message: `Quota horaire journalier maximum (${this.MAX_DAILY_HOURS}h) atteint.`,
          },
        });
        value = 0;
        inputRef.value = initialValue.toString();
        return;
      }

      if (project.hours_limit && value > project.hours_limit && value <= this.MAX_DAILY_HOURS) {
        this.dialog.open(PopupMessageComponent, {
          data: {
            title: 'Avertissement',
            message: `Attention : saisie supérieure à ${project.hours_limit}h uniquement si déplacement`,
          },
        });
      }
    }


    if (value == null || value == undefined) {
      console.warn(`Value (${value}) null or undefined set to 0.`);
      value = 0;
      inputRef.value = '0';
    }
    if (isNaN(value) || value < 0 || value > this.MAX_DAILY_HOURS) {
      console.warn(`Invalid value (${value})`);
      value = initialValue;
      inputRef.value = initialValue.toString();
    }

    const formattedDate = new Date(date).toISOString().split('T')[0];

    const action = project.list_action.find((a: any) => a.id_action === actionId);
    if (!action) return;

    const timeEntry = action.list_time.find(
      (t: any) => new Date(t.date).toISOString().split('T')[0] === formattedDate
    );
    if (timeEntry) {
      timeEntry.duration = value.toString();
    } else {
      action.list_time.push({ date: formattedDate, duration: value.toString() });
    }

    this.timeSheetService.saveUserTime(this.userId, actionId, formattedDate, value).subscribe({
      error: (error) => {
        console.error('Error saving time:', error);
      },
      complete: () => {
        this.loadProjects();
        this.applySaveAnimation(inputRef);
      },
    });
  }

  private applySaveAnimation(inputRef: HTMLInputElement) {
    if (inputRef) {
      inputRef.style.transition = 'box-shadow 0.3s ease';
      inputRef.style.boxShadow = '0 0 0 2px #80bdff';

      if ((inputRef as any)._saveTimeout) {
        clearTimeout((inputRef as any)._saveTimeout);
      }

      (inputRef as any)._saveTimeout = setTimeout(() => {
        inputRef.style.boxShadow = '';
        setTimeout(() => {
          inputRef.style.transition = '';
        }, 300);
      }, 1000);
    }
  }

  updateTimeEntryDelayed(
    value: number,
    projectId: number,
    end_date: Date,
    actionId: number,
    date: string,
    inputRef: HTMLInputElement,
    initialValue: number
  ) {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      const formattedDate = new Date(date);

      const currentTotal = this.calculateDayTotal(formattedDate);
      const hoursLimit = this.computeMinHoursLimit(projectId, formattedDate);
      const newTotal = currentTotal + value - initialValue;

      if (newTotal > this.MAX_DAILY_HOURS) {
        this.dialog.open(PopupMessageComponent, {
          data: {
            title: 'Erreur',
            message: `Quota horaire journalier (${this.MAX_DAILY_HOURS}h) dépassé !`,
          },
        });

        inputRef.value = initialValue.toString();
        return;
      }
      if (hoursLimit && newTotal > hoursLimit) {
        this.dialog.open(PopupMessageComponent, {
          data: {
            title: 'Avertissement',
            message: `Attention : saisie supérieure à ${hoursLimit}h uniquement si déplacement`,
          },
        });

        inputRef.value = initialValue.toString();
        return;
      }

      this.updateTimeEntry(value, projectId, end_date, actionId, date, inputRef, initialValue);
    }, 500);
  }

  calculateWeeklyTotalByAction(projectId: number, actionId: number): number {
    let total = 0;

    this.weekDays.forEach((day) => {
      const dateStr = this.formatApiDate(this.toLuxonDate(day.date));
      const timeEntry = this.getTimeEntry(projectId, actionId, dateStr);

      if (timeEntry && timeEntry.hours) {
        total += timeEntry.hours;
      }
    });
    return total;
  }

  calculateWeeklyTotal(options: { byDay?: boolean } = { byDay: false }): number {
    let total = 0;
    this.weekDays.forEach((day) => {
      const dateStr = this.formatApiDate(this.toLuxonDate(day.date));
      this.projects.forEach((project) => {
        project.list_action.forEach((action: any) => {
          const timeEntry = this.getTimeEntry(project.id_project, action.id_action, dateStr);
          if (timeEntry && timeEntry.hours) {
            total += timeEntry.hours;
          }
        });
      });
      this.fixedRows.forEach((project) => {
        project.list_action.forEach((action: any) => {
          const timeEntry = this.getTimeEntry(project.id_project, action.id_action, dateStr);
          if (timeEntry && timeEntry.hours) {
            total += timeEntry.hours;
          }
        });
      });
    });

    if (options.byDay) {
      total = this.transformToWorkingDays(total);
    }

    return total;
  }

  transformToWorkingDays(totalHours: number): number {
    return Math.round(totalHours / this.STANDARD_DAILY_WORKING_HOURS);
  }

  calculateDayTotal(date: Date): number {
    let total = 0;

    const formattedDate = this.formatApiDate(this.toLuxonDate(date));

    if (!this.projects || !Array.isArray(this.projects)) {
      console.warn("calculateDayTotal: this.projects est undefined ou n'est pas un tableau");
      return total;
    }

    this.projects.forEach(
      (project: { id_project: number; list_action: { id_action: number }[] }) => {
        if (!project.list_action || !Array.isArray(project.list_action)) {
          console.warn(
            `calculateDayTotal: project.list_action est undefined ou n'est pas un tableau pour project ${project.id_project}`
          );
          return;
        }

        project.list_action.forEach((action: { id_action: number }) => {
          const entry = this.getTimeEntry(project.id_project, action.id_action, formattedDate);
          if (entry && typeof entry.hours === 'number') {
            total += entry.hours;
          }
        });
      }
    );
    this.fixedRows.forEach(
      (project: { id_project: number; list_action: { id_action: number }[] }) => {
        if (!project.list_action || !Array.isArray(project.list_action)) {
          console.warn(
            `calculateDayTotal: project.list_action est undefined ou n'est pas un tableau pour project ${project.id_project}`
          );
          return;
        }

        project.list_action.forEach((action: { id_action: number }) => {
          const entry = this.getTimeEntry(project.id_project, action.id_action, formattedDate);
          if (entry && typeof entry.hours === 'number') {
            total += entry.hours;
          }
        });
      }
    );
    return total;
  }

  private computeMinHoursLimit(projectId: number, date: Date): number | null {
    let minHoursLimit: number | null = null;
    const formattedDate = this.formatApiDate(this.toLuxonDate(date));

    if (!this.projects || !Array.isArray(this.projects)) {
      console.warn("computeMinHousLimit: this.projects est undefined ou n'est pas un tableau");
      return minHoursLimit;
    }

    this.projects.forEach(
      (project: {
        id_project: number;
        hours_limit: number;
        list_action: { id_action: number }[];
      }) => {
        if (project.hours_limit != null) {
          project.list_action.forEach((action: { id_action: number }) => {
            const entry = this.getTimeEntry(project.id_project, action.id_action, formattedDate);
            if (
              projectId === project.id_project ||
              (entry && entry.hours > 0 && typeof entry.hours === 'number')
            ) {
              if (minHoursLimit == null) {
                minHoursLimit = project.hours_limit;
              } else if (project.hours_limit < minHoursLimit) {
                minHoursLimit = project.hours_limit;
              }
            }
          });
        }
      }
    );
    return minHoursLimit;
  }

  getInputId(projectId: number | string, actionId: number, date: Date): string {
    return `input-${projectId}-${actionId}-${date.toISOString()}`;
  }

  trackByDate(index: number, item: any): string {
    return item.date.toISOString();
  }

  trackById(index: number, item: any): number {
    return item?.id || item?.id_project || item?.id_action || index;
  }

  loadProjects(): void {
    this.isLoadingResults = true;
    const formattedStartDate = this.startDate.toISODate();
    const formattedEndDate = this.endDate.toISODate();

    if (formattedStartDate && formattedEndDate) {
      this.timeSheetService
        .getUserProjects(this.userId, formattedStartDate, formattedEndDate)
        .subscribe({
          next: (data: any) => {
            this.projects = data.filter((project: any) => project.id_project !== 0);
            this.fixedRows = data.filter((project: any) => project.id_project === 0);
            this.initializeExpandedProjects();
          },
          error: (error) => {
            console.error('Erreur lors du chargement des projets', error);
          },
          complete: () => {
            this.isLoadingResults = false;
            console.info('Projects loaded successfully');
          },
        });
    }
  }

  private initializeExpandedProjects(): void {
    const savedState = localStorage.getItem(this.EXPANDED_PROJECTS_KEY);
    if (savedState) {
      try {
        const expandedIds = JSON.parse(savedState);
        this.expandedProjects = new Set<number>(expandedIds);
      } catch (e) {
        console.error('Error parsing expanded projects state from localStorage', e);
        this.projects.forEach((project) => this.expandedProjects.add(project.id_project));
        this.fixedRows.forEach((project) => this.expandedProjects.add(project.id_project));
      }
    } else {
      this.projects.forEach((project) => this.expandedProjects.add(project.id_project));
      this.fixedRows.forEach((project) => this.expandedProjects.add(project.id_project));
    }
  }

  formatApiDate(date: DateTime): string {
    return date.toFormat("yyyy-MM-dd'T'HH:mm:ss");
  }

  toLuxonDate(date: Date): DateTime {
    return DateTime.fromJSDate(date);
  }

  onFocus(inputRef: HTMLInputElement) {
    if (inputRef.value === '0') {
      inputRef.value = '';
    }
  }

  onBlur(inputRef: HTMLInputElement) {
    if (inputRef.value === '') {
      inputRef.value = '0';
    }
  }

  blockNegativeInput(event: KeyboardEvent): void {
    if (event.key === '-') {
      event.preventDefault();
    }
  }
}
