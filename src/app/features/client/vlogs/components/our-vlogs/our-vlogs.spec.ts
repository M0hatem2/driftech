import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurVlogs } from './our-vlogs';

describe('OurVlogs', () => {
  let component: OurVlogs;
  let fixture: ComponentFixture<OurVlogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurVlogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurVlogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
