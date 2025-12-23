import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveTypes } from './drive-types';

describe('DriveTypes', () => {
  let component: DriveTypes;
  let fixture: ComponentFixture<DriveTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriveTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriveTypes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
