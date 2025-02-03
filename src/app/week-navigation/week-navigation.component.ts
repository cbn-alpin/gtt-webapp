import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-week-navigation',
  templateUrl: './week-navigation.component.html',
  styleUrls: ['./week-navigation.component.scss']
})
export class WeekNavigationComponent {
  @Input() selectedMonth: number | undefined;
  @Input() selectedYear: number | undefined;
  @Input() months: { name: string; index: number }[] | undefined;
  @Input() years: number[] | undefined;

  @Output() monthChanged = new EventEmitter<number>();
  @Output() yearChanged = new EventEmitter<number>();
  @Output() goToPreviousWeek = new EventEmitter<void>();
  @Output() goToNextWeek = new EventEmitter<void>();

  onMonthChange(): void {
    this.monthChanged.emit(this.selectedMonth);
  }

  onYearChange(): void {
    this.yearChanged.emit(this.selectedYear);
  }
}
