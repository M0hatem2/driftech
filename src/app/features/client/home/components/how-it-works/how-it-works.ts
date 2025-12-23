import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { scrollFadeUp } from '../../../../../shared/animations/scroll.animations';
import { AnimateOnScrollDirective } from '../../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-how-it-works',
  imports: [TranslateModule, AnimateOnScrollDirective],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.scss',
  animations: [scrollFadeUp],
})
export class HowItWorks {
  animationState: 'hidden' | 'visible' = 'hidden';

  onAnimate(): void {
    this.animationState = 'visible';
  }
}
