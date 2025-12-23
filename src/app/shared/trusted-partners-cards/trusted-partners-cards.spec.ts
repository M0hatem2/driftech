import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustedPartnersCards } from './trusted-partners-cards';

describe('TrustedPartnersCards', () => {
  let component: TrustedPartnersCards;
  let fixture: ComponentFixture<TrustedPartnersCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustedPartnersCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustedPartnersCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
