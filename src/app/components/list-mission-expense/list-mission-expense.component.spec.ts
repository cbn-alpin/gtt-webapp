import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMissionExpenseComponent } from './list-mission-expense.component';

describe('ListMissionExpenseComponent', () => {
  let component: ListMissionExpenseComponent;
  let fixture: ComponentFixture<ListMissionExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMissionExpenseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMissionExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
