import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsByDownPaymentsCard } from './cars-by-down-payments-card';

describe('CarsByDownPaymentsCard', () => {
  let component: CarsByDownPaymentsCard;
  let fixture: ComponentFixture<CarsByDownPaymentsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarsByDownPaymentsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarsByDownPaymentsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
