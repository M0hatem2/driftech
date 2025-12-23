import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriftechVlogs } from './driftech-vlogs';

describe('DriftechVlogs', () => {
  let component: DriftechVlogs;
  let fixture: ComponentFixture<DriftechVlogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriftechVlogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriftechVlogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
