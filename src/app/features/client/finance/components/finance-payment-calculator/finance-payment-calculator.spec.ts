import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancePaymentCalculator } from './finance-payment-calculator';

describe('FinancePaymentCalculator', () => {
  let component: FinancePaymentCalculator;
  let fixture: ComponentFixture<FinancePaymentCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancePaymentCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancePaymentCalculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
