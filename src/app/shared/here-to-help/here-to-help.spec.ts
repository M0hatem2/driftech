import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HereToHelp } from './here-to-help';

describe('HereToHelp', () => {
  let component: HereToHelp;
  let fixture: ComponentFixture<HereToHelp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HereToHelp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HereToHelp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
