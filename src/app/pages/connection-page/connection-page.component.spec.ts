import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { of } from 'rxjs';

import { AuthService } from 'src/app/core/auth/auth.service';
import { ConnectionPageComponent } from './connection-page.component';

describe('ConnectionPageComponent', () => {
  let component: ConnectionPageComponent;
  let fixture: ComponentFixture<ConnectionPageComponent>;

  const mockAuthService = {
    loginWithNativeAuth: jasmine.createSpy('loginWithNativeAuth').and.returnValue(of({})),
    loginWithGoogleToken: jasmine.createSpy('loginWithGoogleToken').and.returnValue(of({})),
    loginWithGoogleCode: jasmine.createSpy('loginWithGoogleCode').and.returnValue(of({})),
  };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };
  const mockSnackBar = {
    open: jasmine.createSpy('open'),
  };

  beforeEach(async () => {
    (window as any).google = {
      accounts: {
        id: {
          initialize: jasmine.createSpy('initialize'),
          prompt: jasmine.createSpy('prompt'),
        },
        oauth2: {
          initCodeClient: jasmine.createSpy('initCodeClient').and.returnValue({
            requestCode: jasmine.createSpy('requestCode'),
          }),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ConnectionPageComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize Google accounts', () => {
    expect((window as any).google.accounts.id.initialize).toHaveBeenCalledWith(jasmine.anything());
    expect((window as any).google.accounts.id.prompt).toHaveBeenCalled();
  });

  it('should initialize code client', () => {
    expect((window as any).google.accounts.oauth2.initCodeClient).toHaveBeenCalledWith(
      jasmine.anything()
    );
  });
});
