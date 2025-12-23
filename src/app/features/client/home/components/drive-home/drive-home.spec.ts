import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveHome } from './drive-home';

describe('DriveHome', () => {
  let component: DriveHome;
  let fixture: ComponentFixture<DriveHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriveHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriveHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
