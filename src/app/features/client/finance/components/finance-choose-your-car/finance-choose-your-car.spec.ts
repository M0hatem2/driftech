import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceChooseYourCar } from './finance-choose-your-car';

describe('FinanceChooseYourCar', () => {
  let component: FinanceChooseYourCar;
  let fixture: ComponentFixture<FinanceChooseYourCar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceChooseYourCar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceChooseYourCar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
