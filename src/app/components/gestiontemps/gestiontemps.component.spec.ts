import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestiontempsComponent } from './gestiontemps.component';

describe('GestiontempsComponent', () => {
  let component: GestiontempsComponent;
  let fixture: ComponentFixture<GestiontempsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestiontempsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestiontempsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
