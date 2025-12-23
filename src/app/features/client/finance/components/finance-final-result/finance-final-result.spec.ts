import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceFinalResult } from './finance-final-result';

describe('FinanceFinalResult', () => {
  let component: FinanceFinalResult;
  let fixture: ComponentFixture<FinanceFinalResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceFinalResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceFinalResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
