import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsCards } from './contact-us-cards';

describe('ContactUsCards', () => {
  let component: ContactUsCards;
  let fixture: ComponentFixture<ContactUsCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactUsCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
