import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BehaviorSubject } from 'rxjs';

import { DateTime, Info, Interval } from 'luxon';

import { PopupMessageComponent } from './popup-message/popup-message.component';
import { CalendarService } from './services/calendar.service';
import { TimeStateService } from './services/time-state-service.service';
import { TimesheetService } from './services/timesheet.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
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
})
export class CalendarComponent implements OnInit {
  private readonly MAX_DAILY_HOURS = 10;
  readonly STANDARD_DAILY_WORKING_HOURS = 7.5;
  private readonly EXPANDED_PROJECTS_KEY = 'expandedProjectsState';

  private calendarService = inject(CalendarService);
  private dialog = inject(MatDialog);
  private timeSheetService = inject(TimesheetService);
  private timeStateService = inject(TimeStateService);

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
  years: number[] = Array.from({ length: 30 }, (_, i) => 2000 + i);
  selectedMonth: number = this.firstDayOfActiveMonth.getValue().month;
  selectedYear: number = this.firstDayOfActiveMonth.getValue().year;
  selectedWeek: number = this.firstDayOfActiveMonth.getValue().weekNumber;

  timer: any = null;

  expandedProjects = new Set<number>();

  constructor() {
    const activeMonth = this.firstDayOfActiveMonth.value;
    this.selectedMonth = activeMonth.month;
    this.selectedYear = activeMonth.year;
    this.weeksNumbers = this.getWeeksArray(activeMonth.year);
    this.selectedWeek = activeMonth.weekNumber;

    this.updateStartEndDates();
  }

  weeksNumbers: number[];

  private getWeeksArray(year: number): number[] {
    const weeksInYear = this.getWeeksInYear(year);
    return Array.from({ length: weeksInYear }, (_, i) => 1 + i);
  }

  private getWeeksInYear(year: number): number {
    // First january of current year
    const firstDayOfYear = new Date(year, 0, 1);

    // getDay() return 0 for Sunday, 1 for monday...s
    // Adjustement for monday = 1, sunday = 7 (ISO 8601 standard)
    let dayOfWeek = firstDayOfYear.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;

    // Check if we have a bisextile year
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    // Apply ISO 8601 standard
    return dayOfWeek === 4 || (isLeapYear && dayOfWeek === 3) ? 53 : 52;
  }

  get daysOfMonth() {
    return this.calendarService.getDaysOfMonth(this.firstDayOfActiveMonth.getValue());
  }

  ngOnInit(): void {
    const today = this.calendarService.today();
    this.selectedWeek = today.weekNumber;
    this.selectedMonth = today.month;
    this.selectedYear = today.year;
    this.currentWeek = this.calendarService.getCurrentWeek(today);
    this.timeStateService.updateSelectedDate(today.toJSDate());
    this.timeStateService.selectedDateSignal().subscribe(() => {
      this.weekDays = this.timeStateService.currentWeek;
    });

    this.loadProjects();
    this.fetchHolidays();
  }

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

  private updateStartEndDates() {
    if (this.currentWeek.start && this.currentWeek.end) {
      this.startDate = this.currentWeek.start;
      this.endDate = this.currentWeek.end;
    }
  }

  setActiveDay(day: DateTime): void {
    this.activeDay.next(day);
    this.currentWeek = this.calendarService.getCurrentWeek(day);
    this.timeStateService.updateSelectedDate(day.toJSDate());
    this.selectedWeek = day.weekNumber;
    this.selectedMonth = day.month;
    this.selectedYear = day.year;

    this.updateStartEndDates();
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
    const isExpanded =
      project && project.id_project !== undefined && this.expandedProjects.has(project.id_project);
    return isExpanded;
  }

  toggleAllProjects(): void {
    if (this.areAllProjectsExpanded()) {
      this.expandedProjects.clear();
      this.saveExpandedState();
    } else {
      this.projects
        .filter((project) => project.is_selected)
        .concat(this.fixedRows.map((project) => project.id_project))
        .forEach((project) => this.expandedProjects.add(project.id_project));
      this.saveExpandedState();
    }
  }

  areAllProjectsExpanded(): boolean {
    const totalProjects = this.projects
      .filter((project) => project.is_selected)
      .concat(this.fixedRows);
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

    this.updateStartEndDates();
    this.loadProjects();
  }

  onMonthChange(): void {
    this.updateToFirstWeekOfMonth();
  }

  onYearChange(): void {
    this.updateToFirstWeekOfMonth();
  }

  private updateToFirstWeekOfMonth(): void {
    const newDate = this.firstDayOfActiveMonth
      .getValue()
      .set({ year: this.selectedYear, month: this.selectedMonth });

    const date =
      this.getWeeksInYear(newDate.year) !== 53 && newDate.weekNumber === 53 && newDate.month === 1
        ? this.getFirstDayOfMonth(newDate)
        : newDate;

    this.firstDayOfActiveMonth.next(date);
    this.selectedWeek = date.weekNumber;
    this.weeksNumbers = this.getWeeksArray(date.year);

    this.currentWeek = this.calendarService.getCurrentWeek(date);
    this.timeStateService.updateSelectedDate(date.toJSDate());
    if (date.weekNumber >= 52) {
      if (this.currentWeek.start) {
        this.weeksNumbers = this.getWeeksArray(this.currentWeek.start.year);
        this.selectedWeek = this.currentWeek.start.weekNumber;
      }
    } else {
      if (this.currentWeek.end) {
        this.weeksNumbers = this.getWeeksArray(this.currentWeek.end.year);
        this.selectedWeek = this.currentWeek.end.weekNumber;
      }
    }
    this.updateStartEndDates();
    this.loadProjects();
  }

  private getFirstDayOfMonth(date: DateTime): DateTime {
    const firstDayOfMonth = date.startOf('month');
    let firstMonday = firstDayOfMonth.set({ weekday: 1 });
    if (firstMonday.month !== firstDayOfMonth.month) {
      firstMonday = firstMonday.plus({ weeks: 1 });
    }
    return firstMonday;
  }

  onWeekChange(): void {
    const startOfSelectedWeek = DateTime.fromObject({
      weekYear: this.selectedYear,
      weekNumber: this.selectedWeek,
      weekday: 1,
    });
    this.currentWeek = this.calendarService.getCurrentWeek(startOfSelectedWeek);
    this.updateCurrentWeek();
  }

  isHoliday(date: Date | DateTime): boolean {
    const dateTime = date instanceof Date ? DateTime.fromJSDate(date) : date;
    return this.calendarService.isHoliday(dateTime);
  }

  goToPreviousWeek(): void {
    this.currentWeek = this.calendarService.goToPreviousWeek(this.currentWeek);
    this.updateCurrentWeek();
  }

  goToNextWeek(): void {
    this.currentWeek = this.calendarService.goToNextWeek(this.currentWeek);
    this.updateCurrentWeek();
  }

  private updateCurrentWeek(): void {
    if (this.currentWeek.start && this.currentWeek.end) {
      const currentWeekNumber = this.currentWeek.start.weekNumber;
      const selectedWeekDay =
        currentWeekNumber == 1 ? this.currentWeek.end : this.currentWeek.start;
      this.timeStateService.updateSelectedDate(this.currentWeek.start.toJSDate());
      this.selectedWeek = selectedWeekDay.weekNumber;
      this.selectedMonth = selectedWeekDay.month;
      this.selectedYear = selectedWeekDay.year;
      this.weeksNumbers = this.getWeeksArray(selectedWeekDay.year);
      if (selectedWeekDay.month !== this.firstDayOfActiveMonth.getValue().month) {
        this.firstDayOfActiveMonth.next(selectedWeekDay.startOf('month'));
        this.updateStartEndDates();
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

    if (!project.list_action || !Array.isArray(project.list_action)) {
      return { hours: 0 };
    }

    const action = project.list_action.find((a: any) => a.id_action === actionId);
    if (!action) return { hours: 0 };

    if (!action.list_time || !Array.isArray(action.list_time)) {
      return { hours: 0 };
    }

    const timeEntry = action.list_time.find(
      (t: any) => new Date(t.date).toISOString().split('T')[0] === formattedDate
    );

    return timeEntry ? { hours: Number(timeEntry.duration) } : { hours: 0 };
  }

  private updateTimeEntry(
    value: number,
    projectId: number,
    end_date: Date,
    actionId: number,
    date: string,
    inputRef: HTMLInputElement,
    initialValue: number
  ) {
    if (isNaN(value) || value < 0) {
      value = initialValue;
      inputRef.value = initialValue.toString();
      return;
    }
    const formattedDate = new Date(date).toISOString().split('T')[0];

    let source;
    if (projectId === 0) {
      source = this.fixedRows;
    } else {
      source = this.projects;
    }
    const project = source.find((p) => p.id_project === projectId);
    if (!project) return;

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

  saveTimeEntry(
    inputValue: number | string,
    projectId: number,
    end_date: Date,
    actionId: number,
    date: string,
    inputRef: HTMLInputElement,
    initialValue: number
  ) {
    if (inputValue === '' || inputValue == null) {
      inputRef.value = '0';
      inputValue = 0;
    }
    const valueNum = Number(inputValue);
    const formattedDate = new Date(date);

    // Validate project end date
    if (projectId !== 0 && end_date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);

      const projectEndDate = new Date(end_date);
      projectEndDate.setHours(0, 0, 0, 0);

      if (selectedDate > projectEndDate) {
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
    }

    // Validate daily and project hours limit
    const currentTotal = this.calculateDayTotal(formattedDate).total;
    const hoursLimit = this.computeMinHoursLimit(projectId, formattedDate);
    const newTotal = currentTotal + valueNum - initialValue;

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

    if (valueNum != 0 && hoursLimit && newTotal > hoursLimit) {
      this.dialog.open(PopupMessageComponent, {
        data: {
          title: 'Avertissement',
          message: `Attention : saisie supérieure à ${hoursLimit}h uniquement si déplacement`,
        },
      });
    }

    // Update time entry
    if (valueNum !== initialValue) {
      this.updateTimeEntry(valueNum, projectId, end_date, actionId, date, inputRef, initialValue);
    }
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

  calculateDayTotal(date: Date): {
    total: number;
    totalNotDisplayed: number;
    actionsNotDisplayed: string;
  } {
    let total = 0;
    let totalNotDisplayed = 0;
    const actionsNotDisplayed: { project: string; action: string }[] = [];

    const formattedDate = this.formatApiDate(this.toLuxonDate(date));

    if (!this.projects || !Array.isArray(this.projects)) {
      console.warn("calculateDayTotal: this.projects est undefined ou n'est pas un tableau");
      return {
        total: total,
        totalNotDisplayed: totalNotDisplayed,
        actionsNotDisplayed: '',
      };
    }

    this.projects.forEach(
      (project: {
        id_project: number;
        name: string;
        list_action: { id_action: number; is_selected: boolean; name: string }[];
      }) => {
        if (!project.list_action || !Array.isArray(project.list_action)) {
          console.warn(
            `calculateDayTotal: project.list_action est undefined ou n'est pas un tableau pour project ${project.id_project}`
          );
          return;
        }

        project.list_action.forEach(
          (action: { id_action: number; is_selected: boolean; name: string }) => {
            const entry = this.getTimeEntry(project.id_project, action.id_action, formattedDate);
            if (entry && typeof entry.hours === 'number') {
              total += entry.hours;
              if (!action.is_selected) {
                totalNotDisplayed += entry.hours;
                actionsNotDisplayed.push({ project: project.name, action: action.name });
              }
            }
          }
        );
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

    return {
      total: total,
      totalNotDisplayed: totalNotDisplayed,
      actionsNotDisplayed: actionsNotDisplayed
        .map(
          (action: { project: string; action: string }) => `${action.project} - ${action.action}`
        )
        .join(', '),
    };
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

  private loadProjects(): void {
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
          error: (response) => {
            this.isLoadingResults = false;
            console.error(`Error loading project: ${response.error.message}`);
          },
          complete: () => {
            this.isLoadingResults = false;
            console.info('Projects loaded successfully');
          },
        });
    }
  }

  private initializeExpandedProjects(): void {
    const currentProjectsIds = this.projects
      .filter((project) => project.is_selected)
      .map((project) => project.id_project)
      .concat(this.fixedRows.map((project) => project.id_project));
    // By default, expand all the displayed projects
    currentProjectsIds.forEach((projectId) => this.expandedProjects.add(projectId));

    const savedState = localStorage.getItem(this.EXPANDED_PROJECTS_KEY);
    if (savedState) {
      try {
        const savedExpandedIds = JSON.parse(savedState);
        const savedExpandedIdsActive = savedExpandedIds.filter((projectId: number) =>
          currentProjectsIds.includes(projectId)
        );
        this.expandedProjects = new Set<number>(savedExpandedIdsActive);
        this.saveExpandedState();
      } catch (e) {
        console.warn('Error parsing expanded projects state from localStorage', e);
      }
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

  blockNegativeInput(event: KeyboardEvent): void {
    if (event.key === '-') {
      event.preventDefault();
    }
  }
}
