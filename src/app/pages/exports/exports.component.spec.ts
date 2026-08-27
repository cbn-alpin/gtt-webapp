import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ExportsComponent } from './exports.component';

@Component({ selector: 'app-projects-export', template: '' })
class MockProjectsExportComponent {}

@Component({ selector: 'app-expenses-export', template: '' })
class MockExpensesExportComponent {}

describe('ExportsComponent', () => {
  let component: ExportsComponent;
  let fixture: ComponentFixture<ExportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportsComponent, MockProjectsExportComponent, MockExpensesExportComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain download-projects and download-expenses', () => {
    expect(fixture.debugElement.query(By.directive(MockProjectsExportComponent))).not.toBeNull();
    expect(fixture.debugElement.query(By.directive(MockExpensesExportComponent))).not.toBeNull();
  });
});
