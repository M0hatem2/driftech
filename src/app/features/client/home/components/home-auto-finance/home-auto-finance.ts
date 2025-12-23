import { Component } from '@angular/core';
import { FinanceCalculator } from '../../../../../shared/finance-calculator/finance-calculator';
import { TranslateModule } from '@ngx-translate/core';
import { scrollFadeUp } from '../../../../../shared/animations/scroll.animations';
import { AnimateOnScrollDirective } from '../../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-home-auto-finance',
  imports: [FinanceCalculator, TranslateModule, AnimateOnScrollDirective],
  templateUrl: './home-auto-finance.html',
  styleUrl: './home-auto-finance.scss',
  animations: [scrollFadeUp],
})
export class HomeAutoFinance {
  animationState: 'hidden' | 'visible' = 'hidden';

  onAnimate(): void {
    this.animationState = 'visible';
  }
}
