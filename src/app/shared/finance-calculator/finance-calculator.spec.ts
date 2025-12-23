import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceCalculator } from './finance-calculator';

describe('FinanceCalculator', () => {
  let component: FinanceCalculator;
  let fixture: ComponentFixture<FinanceCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceCalculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
