import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceHeader } from './finance-header';

describe('FinanceHeader', () => {
  let component: FinanceHeader;
  let fixture: ComponentFixture<FinanceHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
