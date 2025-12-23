import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleStatuses } from './vehicle-statuses';

describe('VehicleStatuses', () => {
  let component: VehicleStatuses;
  let fixture: ComponentFixture<VehicleStatuses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleStatuses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleStatuses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
