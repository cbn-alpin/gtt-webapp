import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalendarService } from '../services/calendar.service';
import { TimeStateService } from '../services/time-state-service.service';

@Component({
  selector: 'app-time-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss']
})
export class TimeSheetComponent {
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

  constructor(
    private timeStateService: TimeStateService,
    private calendarService: CalendarService
  ) { }

  ngOnInit() {
    this.timeStateService.selectedDateSignal().subscribe(date => {
      this.weekDays = this.timeStateService.currentWeek;
    });
  }
  onWeekChanged(newWeekStartDate: Date) {
    this.timeStateService.updateSelectedDate(newWeekStartDate);
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
    return this.calculateWeekTotal(projectId, actionId) * 4; // Mock
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
