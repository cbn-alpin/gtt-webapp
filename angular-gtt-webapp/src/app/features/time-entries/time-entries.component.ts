import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { WeekSelectorComponent } from './components/week-selector/week-selector.component';
import { TimeSheetComponent } from './components/time-sheet/time-sheet.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { TimeStateService } from './services/time-state.service';

@Component({
  selector: 'app-time-entries',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    WeekSelectorComponent,
    TimeSheetComponent,
    CalendarComponent
  ],
  providers: [TimeStateService],
  template: `
    <div class="time-entries-container">
      <div class="header">
        <app-calendar></app-calendar>
        <app-week-selector></app-week-selector>
      </div>
      <app-time-sheet></app-time-sheet>
    </div>
  `,
  styles: [`
    .time-entries-container {
      padding: var(--spacing-md);
    }

    .header {
      display: flex;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }
  `]
})
export class TimeEntriesComponent { }
