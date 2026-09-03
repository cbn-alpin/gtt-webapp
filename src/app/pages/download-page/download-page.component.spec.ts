import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DownloadPageComponent } from './download-page.component';

@Component({ selector: 'app-download-projects', template: '' })
class MockDownloadProjectsComponent {}

@Component({ selector: 'app-download-expenses', template: '' })
class MockDownloadExpensesComponent {}

describe('DownloadPageComponent', () => {
  let component: DownloadPageComponent;
  let fixture: ComponentFixture<DownloadPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DownloadPageComponent,
        MockDownloadProjectsComponent,
        MockDownloadExpensesComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain download-projects and download-expenses', () => {
    expect(fixture.debugElement.query(By.directive(MockDownloadProjectsComponent))).not.toBeNull();
    expect(fixture.debugElement.query(By.directive(MockDownloadExpensesComponent))).not.toBeNull();
  });
});
