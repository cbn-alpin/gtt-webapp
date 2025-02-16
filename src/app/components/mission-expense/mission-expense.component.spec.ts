import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionExpenseComponent } from './mission-expense.component';

describe('MissionExpenseComponent', () => {
  let component: MissionExpenseComponent;
  let fixture: ComponentFixture<MissionExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionExpenseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
