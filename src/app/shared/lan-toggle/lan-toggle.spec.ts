import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanToggle } from './lan-toggle';

describe('LanToggle', () => {
  let component: LanToggle;
  let fixture: ComponentFixture<LanToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanToggle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
