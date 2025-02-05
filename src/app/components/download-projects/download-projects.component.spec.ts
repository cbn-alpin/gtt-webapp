import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadProjectsComponent } from './download-projects.component';

describe('DownloadProjectsComponent', () => {
  let component: DownloadProjectsComponent;
  let fixture: ComponentFixture<DownloadProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadProjectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
