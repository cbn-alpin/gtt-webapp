import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CalendarComponent } from './calendar/calendar.component';
import { TimesheetComponent } from './timesheet.component';

@Component({ selector: 'app-calendar', template: '', standalone: true })
class MockCalendarComponent {}

describe('TimesheetComponent', () => {
  let component: TimesheetComponent;
  let fixture: ComponentFixture<TimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimesheetComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(TimesheetComponent, {
        remove: { imports: [CalendarComponent] },
        add: { imports: [MockCalendarComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain calendar component', () => {
    expect(fixture.debugElement.query(By.directive(MockCalendarComponent))).not.toBeNull();
  });
});
