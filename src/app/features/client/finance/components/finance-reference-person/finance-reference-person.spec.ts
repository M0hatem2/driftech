import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceReferencePerson } from './finance-reference-person';

describe('FinanceReferencePerson', () => {
  let component: FinanceReferencePerson;
  let fixture: ComponentFixture<FinanceReferencePerson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceReferencePerson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceReferencePerson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
