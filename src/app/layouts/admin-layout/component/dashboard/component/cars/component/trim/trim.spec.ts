import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trim } from './trim';

describe('Trim', () => {
  let component: Trim;
  let fixture: ComponentFixture<Trim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Trim]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Trim);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
