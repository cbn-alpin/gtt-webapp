import { Injectable, signal, computed } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class TimeStateService {
  private selectedDateSignal = signal<Date>(new Date());

  // Make selected date observable
  selectedDate = computed(() => this.selectedDateSignal());

  private weekDays = computed(() => {
    const selected = this.selectedDateSignal();
    const monday = this.getMonday(selected);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);

      return {
        date: new Date(date),
        name: this.getDayName(date),
        isWeekend: i >= 5,
        isToday: this.isToday(date)
      };
    });
  });

  currentWeek = computed(() => this.weekDays());

  updateSelectedDate(date: Date) {
    this.selectedDateSignal.set(new Date(date));
  }

  private getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  private getDayName(date: Date): string {
    return date.toLocaleDateString('fr-FR', { weekday: 'long' });
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }
}
