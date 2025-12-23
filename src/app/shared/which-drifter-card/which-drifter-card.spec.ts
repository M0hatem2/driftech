import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhichDrifterCard } from './which-drifter-card';

describe('WhichDrifterCard', () => {
  let component: WhichDrifterCard;
  let fixture: ComponentFixture<WhichDrifterCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhichDrifterCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhichDrifterCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
