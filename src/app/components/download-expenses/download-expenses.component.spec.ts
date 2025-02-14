import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadExpensesComponent } from './download-expenses.component';

describe('DownloadExpensesComponent', () => {
  let component: DownloadExpensesComponent;
  let fixture: ComponentFixture<DownloadExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadExpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
