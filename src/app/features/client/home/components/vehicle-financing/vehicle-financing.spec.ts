import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleFinancing } from './vehicle-financing';

describe('VehicleFinancing', () => {
  let component: VehicleFinancing;
  let fixture: ComponentFixture<VehicleFinancing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleFinancing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleFinancing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
