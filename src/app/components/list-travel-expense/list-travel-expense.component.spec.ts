import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTravelExpenseComponent } from './list-travel-expense.component';

describe('ListTravelExpenseComponent', () => {
  let component: ListTravelExpenseComponent;
  let fixture: ComponentFixture<ListTravelExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTravelExpenseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTravelExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
