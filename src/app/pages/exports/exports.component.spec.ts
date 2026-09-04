import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ExpensesExportComponent } from './expenses-export/expenses-export.component';
import { ExportsComponent } from './exports.component';
import { ProjectsExportComponent } from './projects-export/projects-export.component';

@Component({ selector: 'app-projects-export', template: '', standalone: true })
class MockProjectsExportComponent {}

@Component({ selector: 'app-expenses-export', template: '', standalone: true })
class MockExpensesExportComponent {}

describe('ExportsComponent', () => {
  let component: ExportsComponent;
  let fixture: ComponentFixture<ExportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ExportsComponent, {
        remove: { imports: [ProjectsExportComponent, ExpensesExportComponent] },
        add: { imports: [MockProjectsExportComponent, MockExpensesExportComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ExportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain projects-export and expenses-export components', () => {
    expect(fixture.debugElement.query(By.directive(MockProjectsExportComponent))).not.toBeNull();
    expect(fixture.debugElement.query(By.directive(MockExpensesExportComponent))).not.toBeNull();
  });
});
