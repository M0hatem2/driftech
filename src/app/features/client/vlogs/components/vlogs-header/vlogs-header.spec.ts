import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlogsHeader } from './vlogs-header';

describe('VlogsHeader', () => {
  let component: VlogsHeader;
  let fixture: ComponentFixture<VlogsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VlogsHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VlogsHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
