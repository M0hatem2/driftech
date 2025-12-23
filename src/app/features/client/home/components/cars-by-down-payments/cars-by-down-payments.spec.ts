import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsByDownPayments } from './cars-by-down-payments';

describe('CarsByDownPayments', () => {
  let component: CarsByDownPayments;
  let fixture: ComponentFixture<CarsByDownPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarsByDownPayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarsByDownPayments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
