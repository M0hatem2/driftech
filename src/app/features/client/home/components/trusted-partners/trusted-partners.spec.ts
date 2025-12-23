import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustedPartners } from './trusted-partners';

describe('TrustedPartners', () => {
  let component: TrustedPartners;
  let fixture: ComponentFixture<TrustedPartners>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustedPartners]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustedPartners);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
