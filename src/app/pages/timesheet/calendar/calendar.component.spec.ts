import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DateTime } from 'luxon';

import { CalendarComponent } from './calendar.component';

fdescribe('CalendarComponent', () => {
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

  it('should apply weekend style to weekend days', () => {
    component.weekDays = [
      { date: new Date('2024-02-10'), isWeekend: true, isToday: false, name: 'Mardi' },
    ];
    fixture.detectChanges();

    const weekendCell = fixture.debugElement.query(By.css('.weekend-input'));
    expect(weekendCell).toBeTruthy();
  });

  describe('getInputId()', () => {
    it('should generate input ID correctly', () => {
      const projectId = 1;
      const actionId = 10;
      const dateIso = '2024-02-12';
      const date = new Date(dateIso);
      const inputId = `input-${projectId}-${actionId}-${dateIso}`;

      spyOn(component as any, 'getLocaleDateString').and.returnValue(dateIso);
      expect(component.getInputId(projectId, actionId, date)).toBe(inputId);
    });
  });

  describe('trackByDate()', () => {
    it('should track by date correctly', () => {
      const item = { date: new Date('2024-02-12') };
      expect(component.trackByDate(0, item)).toBeCloseTo(item.date.getTime());
    });
  });

  describe('trackById()', () => {
    it('should track by ID correctly', () => {
      const item = { id_action: 5 };
      expect(component.trackById(0, item)).toBe(5);
    });
  });

  describe('getLocaleDateString()', () => {
    it('should formate date to ISO format YYYY-MM-DD', () => {
      const date = new Date('2026-09-10 16:29:20');
      expect((component as any).getLocaleDateString(date)).toBe('2026-09-10');
    });
  });

  describe('formatApiDate()', () => {
    it('should return format YYYY-MM-DDTHH:MM:SS when time is provided', () => {
      const date = DateTime.fromJSDate(new Date('2026-09-10 16:29:20'));
      expect(component.formatApiDate(date)).toBe('2026-09-10T16:29:20');
    });

    it('should return same day when time is 00:00:00', () => {
      const date = DateTime.fromJSDate(new Date('2026-09-10 00:00'));
      expect(component.formatApiDate(date)).toBe('2026-09-10T00:00:00');
    });
  });

  describe('toLuxonDate()', () => {
    it('should return a luxon date from a date', () => {
      const date = new Date('2026-09-10');
      expect(component.toLuxonDate(date)).toBeInstanceOf(DateTime);
    });
  });

  describe('onFocus()', () => {
    it('should empty the input', () => {
      component.projects = createMockProjects();
      component.expandedProjects.add(1);

      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('[data-qa="action-input-cell"]'));
      expect(input).not.toBeNull();
      input.nativeElement.value = 0;
      expect(input.nativeElement.value).toBe('0');

      input.triggerEventHandler('focus', null);
      fixture.detectChanges();

      expect(input.nativeElement.value).toBe('');
    });
  });

  describe('blockNegativeInput()', () => {
    it('should block the negative input (prevent default action)', () => {
      const mockEvent = new KeyboardEvent('keydown', { key: '-' });

      spyOn(mockEvent, 'preventDefault');
      component.blockNegativeInput(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should allow other keys to be pressed', () => {
      const mockEvent = new KeyboardEvent('keydown', { key: '5' });
      spyOn(mockEvent, 'preventDefault');
      component.blockNegativeInput(mockEvent);

      // Never call preventDefault() for other keys
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('onBlur()', () => {
    it('should call the time entry recording function', () => {
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
  });

  describe('calculateWeeklyTotalByAction()', () => {
    it('should calculate the total hours for a week', () => {
      spyOn(component, 'getTimeEntry').and.returnValue({ hours: 2 });

      component.weekDays = [
        { date: new Date(), isWeekend: false, isToday: false, name: 'Lundi' },
        { date: new Date(), isWeekend: false, isToday: false, name: 'Mardi' },
      ];

      const total = component.calculateWeeklyTotalByAction(1, 1);
      expect(total).toBe(4);
    });
  });

  describe('calculateDayTotal()', () => {
    it('should calculate the total hours for a day', () => {
      component.projects = [{ id_project: 1, list_action: [{ id_action: 1, is_selected: true }] }];

      spyOn(component, 'getTimeEntry').and.returnValue({ hours: 3 });

      const total = component.calculateDayTotal(new Date());
      expect(total).toEqual({ total: 3, totalNotDisplayed: 0, actionsNotDisplayed: '' });
    });
  });

  describe('calculateWeeklyTotal()', () => {
    beforeEach(() => {
      component.weekDays = [
        { date: new Date('2024-02-12'), isWeekend: false, isToday: false, name: 'Lundi' },
        { date: new Date('2024-02-13'), isWeekend: false, isToday: false, name: 'Mardi' },
      ];
      component.projects = [{ id_project: 1, list_action: [{ id_action: 10 }] }] as any;
      component.fixedRows = [{ id_project: 2, list_action: [{ id_action: 20 }] }] as any;
      spyOn(component, 'formatApiDate').and.returnValue('mock-date');
      spyOn(component, 'toLuxonDate').and.returnValue({} as any);
    });

    it('should calculate the total hours across all projects and fixed rows', () => {
      spyOn(component, 'getTimeEntry').and.callFake((projectId, actionId, dateStr) => {
        if (projectId === 1 && actionId === 10) return { hours: 2 } as any;
        if (projectId === 2 && actionId === 20) return { hours: 3 } as any;
        return null;
      });

      // 2 days * (2 hours for project 1 + 3 hours for project 2) = 10 hours
      const total = component.calculateWeeklyTotal();
      expect(total).toBe(10);
    });

    it('should calculate the total in working days if options.byDay is true', () => {
      spyOn(component, 'getTimeEntry').and.returnValue({ hours: 3.5 } as any); // 7 hours per day across projects
      spyOn(component, 'transformToWorkingDays').and.callFake((totalHours) => totalHours / 7);

      // 2 days * (3.5 hours for project 1 + 3.5 hours for project 2) = 14 hours
      // 14 hours / 7 = 2 working days
      const total = component.calculateWeeklyTotal({ byDay: true });
      expect(total).toBe(2);
      expect(component.transformToWorkingDays).toHaveBeenCalledWith(14);
    });
  });
});
