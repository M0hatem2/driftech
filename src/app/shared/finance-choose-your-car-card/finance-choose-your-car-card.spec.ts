import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceChooseYourCarCard } from './finance-choose-your-car-card';

describe('FinanceChooseYourCarCard', () => {
  let component: FinanceChooseYourCarCard;
  let fixture: ComponentFixture<FinanceChooseYourCarCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceChooseYourCarCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceChooseYourCarCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
