import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface WhichDrifterCardData {
  kind: string;
  badgeTitle: string;
  headline: string;
  subHeadline: string;
  bullets: string[];
  ctaText: string;
  carAsset?: string;
  cardImage?: string;
  logoAsset?: string;
}

@Component({
  selector: 'app-which-drifter-card',
  imports: [CommonModule],
  templateUrl: './which-drifter-card.html',
  styleUrl: './which-drifter-card.scss',
})
export class WhichDrifterCard {
  @Input() cardData: WhichDrifterCardData = {
    kind: 'drift_now',
    badgeTitle: 'Drift NOW',
    headline: 'Need a fast decision? Drift Now is for customers who are ready to finance and drive immediately, with quick approvals and a streamlined process.',
    subHeadline: 'Drive today, pay your way',
    bullets: [
      '✔ You know exactly which car you want (new or used) from any seller.',
      "✔ You're ready to move fast and want to complete the process within 48 hours.",
      "✔ Your down payment is ready, and you're looking for immediate delivery.",
    ],
    ctaText: 'Apply Now',
    carAsset: 'assets/images/identity/drift_now_banner.png',
    logoAsset: 'assets/images/identity/logo.png',
  };

  @Output() cardClicked = new EventEmitter<WhichDrifterCardData>();
  @Output() buttonClicked = new EventEmitter<WhichDrifterCardData>();

  onCardClick() {
    this.cardClicked.emit(this.cardData);
  }

  onButtonClick(event: Event) {
    event.stopPropagation(); // Prevent card click
    this.buttonClicked.emit(this.cardData);
  }
}
