import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TimeSheetComponent } from './time-sheet.component';

@Component({ selector: 'app-calendar', template: '' })
class MockCalendarComponent {}

describe('TimeSheetComponent', () => {
  let component: TimeSheetComponent;
  let fixture: ComponentFixture<TimeSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeSheetComponent, MockCalendarComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeSheetComponent);
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
