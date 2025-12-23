import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriftechVlogsCards } from './driftech-vlogs-cards';

describe('DriftechVlogsCards', () => {
  let component: DriftechVlogsCards;
  let fixture: ComponentFixture<DriftechVlogsCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriftechVlogsCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriftechVlogsCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
