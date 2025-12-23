import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rpm } from './rpm';

describe('Rpm', () => {
  let component: Rpm;
  let fixture: ComponentFixture<Rpm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rpm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rpm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
