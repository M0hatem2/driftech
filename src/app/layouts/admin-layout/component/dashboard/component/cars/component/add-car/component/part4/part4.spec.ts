import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Part4 } from './part4';

describe('Part4', () => {
  let component: Part4;
  let fixture: ComponentFixture<Part4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Part4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Part4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
