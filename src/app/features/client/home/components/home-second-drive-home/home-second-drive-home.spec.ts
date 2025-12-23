import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSecondDriveHome } from './home-second-drive-home';

describe('HomeSecondDriveHome', () => {
  let component: HomeSecondDriveHome;
  let fixture: ComponentFixture<HomeSecondDriveHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSecondDriveHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSecondDriveHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
