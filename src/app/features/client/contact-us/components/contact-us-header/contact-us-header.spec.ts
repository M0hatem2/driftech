import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsHeader } from './contact-us-header';

describe('ContactUsHeader', () => {
  let component: ContactUsHeader;
  let fixture: ComponentFixture<ContactUsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactUsHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
