import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from 'src/app/services/user/user.service';
import { ModifyPasswordComponent } from './modify-password.component';

describe('ModifyPasswordComponent', () => {
  let component: ModifyPasswordComponent;
  let fixture: ComponentFixture<ModifyPasswordComponent>;

  const mockUserService = {
    updateUserById: jasmine.createSpy('updateUserById'),
  };
  const mockSnackBar = {
    open: jasmine.createSpy('open'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyPasswordComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifyPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
