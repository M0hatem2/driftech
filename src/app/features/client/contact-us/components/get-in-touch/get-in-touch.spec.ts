import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetInTouch } from './get-in-touch';

describe('GetInTouch', () => {
  let component: GetInTouch;
  let fixture: ComponentFixture<GetInTouch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetInTouch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetInTouch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
