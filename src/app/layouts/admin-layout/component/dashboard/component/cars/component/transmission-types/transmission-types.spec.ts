import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmissionTypes } from './transmission-types';

describe('TransmissionTypes', () => {
  let component: TransmissionTypes;
  let fixture: ComponentFixture<TransmissionTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransmissionTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransmissionTypes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
