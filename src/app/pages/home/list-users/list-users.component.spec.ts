import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { UserService } from 'src/app/services/user/user.service';
import { ListUsersComponent } from './list-users.component';

describe('ListUsersComponent', () => {
  let component: ListUsersComponent;
  let fixture: ComponentFixture<ListUsersComponent>;

  const mockUserService = {
    getAllUsers: jasmine.createSpy('getAllUsers').and.returnValue(of([])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListUsersComponent],
      providers: [{ provide: UserService, useValue: mockUserService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ListUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an empty state message when no users are found', () => {
    mockUserService.getAllUsers.and.returnValue(of([]));
    component.fetchUsers();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-qa="empty-no-users"]')?.textContent).toContain(
      'Aucun agent trouvé.'
    );
  });

  it('should display an error message when fetching users fails', () => {
    mockUserService.getAllUsers.and.returnValue(throwError(() => new Error('Test error')));
    component.fetchUsers();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-qa="error-no-users"]')?.textContent).toContain(
      'Une erreur est survenue lors de la récupération des agents.'
    );
  });
});
