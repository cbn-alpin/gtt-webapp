import { Injectable } from '@angular/core';
import { DateTime, Info, Interval } from 'luxon';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  holidays: { [date: string]: string } = {};

  constructor(private http: HttpClient) {}

  today(): DateTime {
    return DateTime.local();
  }

  getWeekDays(): string[] {
    const weekdays = Info.weekdays('short');
    return [...weekdays.slice(1), weekdays[0]];
  }

  getDaysOfMonth(date: DateTime): DateTime[] {
    return Interval.fromDateTimes(
      date.startOf('week'),
      date.endOf('month').endOf('week')
    )
      .splitBy({ days: 1 })
      .map((interval) => interval.start as DateTime);
  }

  isToday(day: DateTime): boolean {
    return day.hasSame(this.today(), 'day');
  }

  getCurrentWeek(day: DateTime): Interval {
    return Interval.fromDateTimes(day.startOf('week'), day.endOf('week'));
  }

  isInCurrentWeek(day: DateTime, currentWeek: Interval): boolean {
    return currentWeek.contains(day);
  }

  fetchHolidays(): Observable<{ [date: string]: string }> {
    return this.http.get<{ [date: string]: string }>(
      'https://calendrier.api.gouv.fr/jours-feries/metropole.json'
    );
  }

  isHoliday(day: DateTime): boolean {
    const dateString = day.toISODate();
    return dateString ? this.holidays.hasOwnProperty(dateString) : false;
  }

  setHolidays(data: { [date: string]: string }): void {
    this.holidays = data;
  }

  goToPreviousMonth(date: DateTime): DateTime {
    return date.minus({ months: 1 });
  }

  goToNextMonth(date: DateTime): DateTime {
    return date.plus({ months: 1 });
  }

  goToPreviousWeek(currentWeek: Interval): Interval {
    const start = currentWeek.start || DateTime.local().startOf('week');
    const end = currentWeek.end || DateTime.local().endOf('week');

    return Interval.fromDateTimes(
      start.minus({ weeks: 1 }),
      end.minus({ weeks: 1 })
    );
  }

  goToNextWeek(currentWeek: Interval): Interval {
    const start = currentWeek.start || DateTime.local().startOf('week');
    const end = currentWeek.end || DateTime.local().endOf('week');

    return Interval.fromDateTimes(
      start.plus({ weeks: 1 }),
      end.plus({ weeks: 1 })
    );
  }
}
