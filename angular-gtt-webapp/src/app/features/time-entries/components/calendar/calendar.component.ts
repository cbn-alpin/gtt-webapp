import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TimeStateService } from '../../services/time-state.service';

interface CalendarDay {
  date: Date;
  isWeekend: boolean;
  isHoliday: boolean;
  isCurrentMonth: boolean;
}

interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="calendar">
      <div class="calendar-header">
        <div class="month-year">{{ currentMonthYear() }}</div>
      </div>

      <div class="calendar-body">
        <div class="weekdays">
          <div class="weekday">Lun</div>
          <div class="weekday">Mar</div>
          <div class="weekday">Mer</div>
          <div class="weekday">Jeu</div>
          <div class="weekday">Ven</div>
          <div class="weekday weekend">Sam</div>
          <div class="weekday weekend">Dim</div>
        </div>

        @for (week of weeks(); track week.weekNumber) {
          <div class="week" [class.current-week]="isCurrentWeek(week)">
            <div class="week-number">{{ week.weekNumber }}</div>
            @for (day of week.days; track day.date) {
              <div class="day" 
                   [class.weekend]="day.isWeekend"
                   [class.holiday]="day.isHoliday"
                   [class.other-month]="!day.isCurrentMonth"
                   [class.selected]="isSelectedDay(day.date)"
                   (click)="selectDate(day.date)">
                {{ day.date.getDate() }}
              </div>
            }
          </div>
        }
      </div>
    </mat-card>
  `,
  styles: [`
    .calendar {
      width: 300px;
    }

    .calendar-header {
      padding: var(--spacing-sm);
      text-align: center;
      font-weight: 500;
      border-bottom: 1px solid var(--light-grey);
    }

    .weekdays {
      display: grid;
      grid-template-columns: auto repeat(7, 1fr);
      text-align: center;
      font-weight: 500;
      padding: var(--spacing-xs) 0;
      border-bottom: 1px solid var(--light-grey);
    }

    .weekday {
      padding: var(--spacing-xs);
      font-size: 0.9em;

      &.weekend {
        color: var(--primary);
      }
    }

    .week {
      display: grid;
      grid-template-columns: auto repeat(7, 1fr);
      text-align: center;
      
      &.current-week {
        background-color: var(--light-color);
      }
    }

    .day {
      padding: var(--spacing-xs);
      cursor: pointer;
      
      &:hover {
        background-color: var(--light-color);
      }

      &.weekend {
        color: var(--primary);
      }

      &.holiday {
        color: var(--color-alert);
      }

      &.other-month {
        color: var(--grey);
      }

      &.selected {
        background-color: var(--primary);
        color: var(--white);
        border-radius: 50%;
      }
    }

    .week-number {
      padding: var(--spacing-xs);
      color: var(--grey);
      font-size: 0.9em;
    }
  `]
})
export class CalendarComponent implements OnInit {
  weeks = signal<CalendarWeek[]>([]);

  currentMonthYear = computed(() => {
    const date = this.timeStateService.selectedDate();
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long'
    }).format(date);
  });

  constructor(private timeStateService: TimeStateService) { }

  ngOnInit() {
    this.generateCalendar();
  }

  private generateCalendar() {
    const date = this.timeStateService.selectedDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const start = new Date(firstDay);
    start.setDate(start.getDate() - (start.getDay() - 1 + 7) % 7);

    const calendarWeeks: CalendarWeek[] = [];
    let currentWeek: CalendarDay[] = [];
    const current = new Date(start);

    while (current <= lastDay || currentWeek.length > 0) {
      if (currentWeek.length === 0) {
        calendarWeeks.push({
          weekNumber: this.getWeekNumber(current),
          days: currentWeek
        });
      }

      currentWeek.push({
        date: new Date(current),
        isWeekend: current.getDay() === 0 || current.getDay() === 6,
        isHoliday: this.isHoliday(current),
        isCurrentMonth: current.getMonth() === month
      });

      if (currentWeek.length === 7) {
        currentWeek = [];
      }

      current.setDate(current.getDate() + 1);
    }

    this.weeks.set(calendarWeeks);
  }

  private getWeekNumber(date: Date): number {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    target.setDate(target.getDate() + 3 - (target.getDay() + 6) % 7);
    const firstWeek = new Date(target.getFullYear(), 0, 4);
    return 1 + Math.round(((target.getTime() - firstWeek.getTime()) / 86400000
      - 3 + (firstWeek.getDay() + 6) % 7) / 7);
  }

  private isHoliday(date: Date): boolean {
    // TODO: Implement holiday checking
    return false;
  }

  isCurrentWeek(week: CalendarWeek): boolean {
    const today = new Date();
    return week.weekNumber === this.getWeekNumber(today);
  }

  isSelectedDay(date: Date): boolean {
    const selected = this.timeStateService.selectedDate();
    return date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear();
  }

  selectDate(date: Date) {
    this.timeStateService.updateSelectedDate(date);
    this.generateCalendar();
  }
}
