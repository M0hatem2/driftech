import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineTypes } from './engine-types';

describe('EngineTypes', () => {
  let component: EngineTypes;
  let fixture: ComponentFixture<EngineTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EngineTypes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
