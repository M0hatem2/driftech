import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { WhichDrifterCardData } from '../../../../../shared/which-drifter-card/which-drifter-card';

@Component({
  selector: 'app-drifter-details-popup',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './drifter-details-popup.html',
  styleUrl: './drifter-details-popup.scss',
})
export class DrifterDetailsPopup {
  @Input() showPopup = false;
  @Input() selectedCard: WhichDrifterCardData | null = null;

  @Output() closePopupEvent = new EventEmitter<void>();
  @Output() buttonClickedEvent = new EventEmitter<WhichDrifterCardData>();

  onClose() {
    this.closePopupEvent.emit();
  }

  onButtonClick() {
    if (this.selectedCard) {
      this.buttonClickedEvent.emit(this.selectedCard);
      this.onClose();
    }
  }
}
