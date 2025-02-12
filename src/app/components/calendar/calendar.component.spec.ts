import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [ FormsModule, CalendarComponent, MatDialogModule ],
      providers: [MatDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
  });

  fit('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the total hours for a week', () => {
    spyOn(component, 'getTimeEntry').and.returnValue({ hours: 2 });

    component.weekDays = [
      { date: new Date(), isWeekend: false, isToday: false, name: 'Lundi' },
      { date: new Date(), isWeekend: false, isToday: false, name: 'Mardi' }
    ];

    const total = component.calculateWeekTotal(1, 1);
    expect(total).toBe(4);
  });

  it('should calculate the total hours for a day', () => {
    component.projects = [
      { id_project: 1, list_action: [{ id_action: 1 }] }
    ];

    spyOn(component, 'getTimeEntry').and.returnValue({ hours: 3 });

    const total = component.calculateDayTotal(new Date());
    expect(total).toBe(3);
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
    spyOn(component, 'updateTimeEntryDelayed');

    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));

    input.triggerEventHandler('ngModelChange', 4);
    fixture.detectChanges();

    expect(component.updateTimeEntryDelayed).toHaveBeenCalled();
  });

  it('should apply weekend style to weekend days', () => {
    component.weekDays = [{ date: new Date('2024-02-10'), isWeekend: true, isToday: false, name: 'Mardi' }];
    fixture.detectChanges();

    const weekendCell = fixture.debugElement.query(By.css('.weekend-input'));
    expect(weekendCell).toBeTruthy();
  });
});
