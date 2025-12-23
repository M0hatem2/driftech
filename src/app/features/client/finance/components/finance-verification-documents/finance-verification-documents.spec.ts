import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceVerificationDocuments } from './finance-verification-documents';

describe('FinanceVerificationDocuments', () => {
  let component: FinanceVerificationDocuments;
  let fixture: ComponentFixture<FinanceVerificationDocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceVerificationDocuments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceVerificationDocuments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
