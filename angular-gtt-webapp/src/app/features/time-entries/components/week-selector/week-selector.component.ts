import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TimeStateService } from '../../services/time-state.service';

@Component({
  selector: 'app-week-selector',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="week-selector">
      <button mat-icon-button (click)="previousWeek()">
        <mat-icon>chevron_left</mat-icon>
      </button>
      
      <span>{{ currentWeekDisplay() }}</span>
      
      <button mat-icon-button (click)="nextWeek()">
        <mat-icon>chevron_right</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .week-selector {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm);
      background: var(--white);
      border-radius: 4px;
      box-shadow: var(--box-shadow);
    }

    span {
      min-width: 240px;
      text-align: center;
      font-weight: 500;
    }
  `]
})
export class WeekSelectorComponent {
  constructor(private timeStateService: TimeStateService) { }

  currentWeekDisplay = computed(() => {
    const selectedDate = this.timeStateService.selectedDate();
    const firstDay = this.timeStateService.currentWeek()[0].date;

    const year = firstDay.getFullYear();
    const month = firstDay.toLocaleString('fr-FR', { month: 'long' });
    const weekNumber = this.getWeekNumber(firstDay);

    return `Année ${year} - ${month} - Semaine ${weekNumber}`;
  });

  previousWeek() {
    const currentDate = this.timeStateService.selectedDate();
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    this.timeStateService.updateSelectedDate(newDate);
  }

  nextWeek() {
    const currentDate = this.timeStateService.selectedDate();
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    this.timeStateService.updateSelectedDate(newDate);
  }

  private getWeekNumber(date: Date): number {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    target.setDate(target.getDate() + 3 - (target.getDay() + 6) % 7);
    const firstWeek = new Date(target.getFullYear(), 0, 4);
    return 1 + Math.round(((target.getTime() - firstWeek.getTime()) / 86400000
      - 3 + (firstWeek.getDay() + 6) % 7) / 7);
  }
}
