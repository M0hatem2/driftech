import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceWorkDetails } from './finance-work-details';

describe('FinanceWorkDetails', () => {
  let component: FinanceWorkDetails;
  let fixture: ComponentFixture<FinanceWorkDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceWorkDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceWorkDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
