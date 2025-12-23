import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  WhichDrifterCard,
  WhichDrifterCardData,
} from '../../../../../shared/which-drifter-card/which-drifter-card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { scrollFadeUp } from '../../../../../shared/animations/scroll.animations';
import { AnimateOnScrollDirective } from '../../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-home-which-drifter',
  imports: [CommonModule, WhichDrifterCard, TranslateModule, RouterLink, AnimateOnScrollDirective],
  templateUrl: './home-which-drifter.html',
  styleUrl: './home-which-drifter.scss',
  animations: [scrollFadeUp],
})
export class HomeWhichDrifter implements OnInit, OnDestroy {
  whichDrifterCards: WhichDrifterCardData[] = [];
  showPopup = false;
  selectedCard: WhichDrifterCardData | null = null;
  private langChangeSubscription: Subscription = new Subscription();
  animationState: 'hidden' | 'visible' = 'hidden';

  constructor(private translate: TranslateService, private router: Router) {}

  ngOnInit() {
    this.loadTranslatedCards();

    // Subscribe to language changes
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadTranslatedCards();
    });
  }

  ngOnDestroy() {
    this.langChangeSubscription.unsubscribe();
  }

  onAnimate(): void {
    this.animationState = 'visible';
  }

  private loadTranslatedCards() {
    this.whichDrifterCards = [
      {
        kind: 'drift_now',
        badgeTitle: this.translate.instant('DRIFT_NOW_BADGE'),
        headline: this.translate.instant('DRIFT_NOW_HEADLINE'),
        subHeadline: this.translate.instant('DRIFT_NOW_SUBHEADLINE'),
        bullets: [
          this.translate.instant('DRIFT_NOW_BULLET_1'),
          this.translate.instant('DRIFT_NOW_BULLET_2'),
        ],
        ctaText: this.translate.instant('DRIFT_NOW_CTA'),
        carAsset: '/assets/img/drifter/pop/WhatsApp Image 2025-12-06 at 19.52.33_604c5ba9.jpg',
        cardImage: '/assets/img/drifter/Yellow Classic Scooter For Rent Instagram Post (10).png',
        logoAsset: 'assets/images/identity/logo.png',
      },
      {
        kind: 'trade_in',
        badgeTitle: this.translate.instant('DRIFT_TRADE_BADGE'),
        headline: this.translate.instant('DRIFT_TRADE_HEADLINE'),
        subHeadline: this.translate.instant('DRIFT_TRADE_SUBHEADLINE'),
        bullets: [
          this.translate.instant('DRIFT_TRADE_BULLET_1'),
          this.translate.instant('DRIFT_TRADE_BULLET_2'),
        ],
        ctaText: this.translate.instant('DRIFT_TRADE_CTA'),
        carAsset: '/assets/img/drifter/pop/WhatsApp Image 2025-12-06 at 19.52.44_891a3ffa.jpg',
        cardImage: '/assets/img/drifter/Yellow Classic Scooter For Rent Instagram Post (13).png',
      },
      {
        kind: 'drift_fleet',
        badgeTitle: this.translate.instant('DRIFT_FLEET_BADGE'),
        headline: this.translate.instant('DRIFT_FLEET_HEADLINE'),
        subHeadline: this.translate.instant('DRIFT_FLEET_SUBHEADLINE'),
        bullets: [
          this.translate.instant('DRIFT_FLEET_BULLET_1'),
          this.translate.instant('DRIFT_FLEET_BULLET_2'),
        ],
        ctaText: this.translate.instant('DRIFT_FLEET_CTA'),
        carAsset: '/assets/img/drifter/pop/WhatsApp Image 2025-12-06 at 19.52.28_db94b897.jpg',
        cardImage: '/assets/img/drifter/Yellow Classic Scooter For Rent Instagram Post (11).png',
      },
      {
        kind: 'drift_save',
        badgeTitle: this.translate.instant('DRIFT_SAVE_BADGE'),
        headline: this.translate.instant('DRIFT_SAVE_HEADLINE'),
        subHeadline: this.translate.instant('DRIFT_SAVE_SUBHEADLINE'),
        bullets: [
          this.translate.instant('DRIFT_SAVE_BULLET_1'),
          this.translate.instant('DRIFT_SAVE_BULLET_2'),
        ],
        ctaText: this.translate.instant('DRIFT_SAVE_CTA'),
        carAsset: '/assets/img/drifter/pop/WhatsApp Image 2025-12-06 at 19.52.38_c923e777.jpg',
        cardImage: '/assets/img/drifter/WhatsApp Image 2025-11-27 at 08.49.46_950fc507.jpg',
      },
    ];
  }

  onCardClick(card: WhichDrifterCardData) {
    this.selectedCard = card;
    this.showPopup = true;
  }

  onCardButtonClick(card: WhichDrifterCardData) {
    // Navigate to different routes based on card type
    switch (card.kind) {
      case 'drift_now':
        this.router.navigate(['/finance'], { queryParams: { type: 'drift-now' } });
        break;
      case 'trade_in':
        this.router.navigate(['/finance'], { queryParams: { type: 'trade-in' } });
        break;
      case 'drift_fleet':
        this.router.navigate(['/finance'], { queryParams: { type: 'fleet' } });
        break;
      case 'drift_save':
        this.router.navigate(['/finance'], { queryParams: { type: 'save' } });
        break;
      default:
        this.router.navigate(['/finance']);
    }
  }

  closePopup() {
    this.showPopup = false;
    this.selectedCard = null;
  }
}
