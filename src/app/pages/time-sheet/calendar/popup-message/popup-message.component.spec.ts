import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PopupMessageComponent } from './popup-message.component';

describe('PopupMessageComponent', () => {
  let component: PopupMessageComponent;
  let fixture: ComponentFixture<PopupMessageComponent>;

  const mockData = { title: 'One title', message: 'One long message.' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopupMessageComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockData }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
