import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { scrollFadeUp } from '../../../../../shared/animations/scroll.animations';
import { AnimateOnScrollDirective } from '../../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-finance-header',
  standalone: true,
  imports: [TranslateModule, AnimateOnScrollDirective],
  templateUrl: './finance-header.html',
  styleUrl: './finance-header.scss',
  animations: [scrollFadeUp],
})
export class FinanceHeader {
  animationState: 'hidden' | 'visible' = 'hidden';

  onAnimate(): void {
    this.animationState = 'visible';
  }
}
