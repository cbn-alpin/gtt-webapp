import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import { CalendarComponent } from './calendar/calendar.component';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  templateUrl: './timesheet.component.html',
  imports: [CalendarComponent, MatDialogModule],
})
export class TimesheetComponent {}
