import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthsRpm } from './months-rpm';

describe('MonthsRpm', () => {
  let component: MonthsRpm;
  let fixture: ComponentFixture<MonthsRpm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthsRpm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthsRpm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
