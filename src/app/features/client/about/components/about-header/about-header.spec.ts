import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutHeader } from './about-header';

describe('AboutHeader', () => {
  let component: AboutHeader;
  let fixture: ComponentFixture<AboutHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
