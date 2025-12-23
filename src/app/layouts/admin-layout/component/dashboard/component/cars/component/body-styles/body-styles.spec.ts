import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyStyles } from './body-styles';

describe('BodyStyles', () => {
  let component: BodyStyles;
  let fixture: ComponentFixture<BodyStyles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyStyles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyStyles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
