import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancePersonalInformation } from './finance-personal-information';

describe('FinancePersonalInformation', () => {
  let component: FinancePersonalInformation;
  let fixture: ComponentFixture<FinancePersonalInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancePersonalInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancePersonalInformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
