import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Part3 } from './part3';

describe('Part3', () => {
  let component: Part3;
  let fixture: ComponentFixture<Part3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Part3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Part3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
