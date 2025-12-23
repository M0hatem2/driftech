import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeWhichDrifter } from './home-which-drifter';

describe('HomeWhichDrifter', () => {
  let component: HomeWhichDrifter;
  let fixture: ComponentFixture<HomeWhichDrifter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeWhichDrifter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeWhichDrifter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
