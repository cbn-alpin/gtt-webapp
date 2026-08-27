import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  const createMockProjects = () => [
    {
      id_project: 1,
      name: 'Projet Test',
      is_selected: true,
      list_action: [
        {
          id_action: 10,
          numero_action: 'ACT-01',
          name: 'Action Test',
          is_selected: true,
          total_duration: 0,
        },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, CalendarComponent, MatDialogModule, NoopAnimationsModule],
      providers: [MatDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the total hours for a week', () => {
    spyOn(component, 'getTimeEntry').and.returnValue({ hours: 2 });

    component.weekDays = [
      { date: new Date(), isWeekend: false, isToday: false, name: 'Lundi' },
      { date: new Date(), isWeekend: false, isToday: false, name: 'Mardi' },
    ];

    const total = component.calculateWeeklyTotalByAction(1, 1);
    expect(total).toBe(4);
  });

  it('should calculate the total hours for a day', () => {
    component.projects = [{ id_project: 1, list_action: [{ id_action: 1, is_selected: true }] }];

    spyOn(component, 'getTimeEntry').and.returnValue({ hours: 3 });

    const total = component.calculateDayTotal(new Date());
    expect(total).toEqual({ total: 3, totalNotDisplayed: 0, actionsNotDisplayed: '' });
  });

  it('should track by date correctly', () => {
    const item = { date: new Date('2024-02-12') };
    expect(component.trackByDate(0, item)).toBe(item.date.toISOString());
  });

  it('should track by ID correctly', () => {
    const item = { id_action: 5 };
    expect(component.trackById(0, item)).toBe(5);
  });

  it('should update time entry when input changes', () => {
    spyOn(component, 'saveTimeEntry');
    component.projects = createMockProjects();
    component.expandedProjects.add(1);

    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('[data-qa="action-input-cell"]'));
    expect(input).not.toBeNull();

    input.triggerEventHandler('blur', null);
    fixture.detectChanges();

    expect(component.saveTimeEntry).toHaveBeenCalled();
  });

  it('should apply weekend style to weekend days', () => {
    component.weekDays = [
      { date: new Date('2024-02-10'), isWeekend: true, isToday: false, name: 'Mardi' },
    ];
    fixture.detectChanges();

    const weekendCell = fixture.debugElement.query(By.css('.weekend-input'));
    expect(weekendCell).toBeTruthy();
  });
});
