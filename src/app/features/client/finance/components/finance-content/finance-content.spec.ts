import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceContent } from './finance-content';

describe('FinanceContent', () => {
  let component: FinanceContent;
  let fixture: ComponentFixture<FinanceContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
