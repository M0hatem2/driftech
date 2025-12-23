import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceIdentityVerification } from './finance-identity-verification';

describe('FinanceIdentityVerification', () => {
  let component: FinanceIdentityVerification;
  let fixture: ComponentFixture<FinanceIdentityVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceIdentityVerification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceIdentityVerification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
