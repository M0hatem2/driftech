import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationOTP } from './verification-otp';

describe('VerificationOTP', () => {
  let component: VerificationOTP;
  let fixture: ComponentFixture<VerificationOTP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationOTP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationOTP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
