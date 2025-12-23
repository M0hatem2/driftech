import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAutoFinance } from './home-auto-finance';

describe('HomeAutoFinance', () => {
  let component: HomeAutoFinance;
  let fixture: ComponentFixture<HomeAutoFinance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeAutoFinance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeAutoFinance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
