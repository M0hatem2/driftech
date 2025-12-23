import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { scrollFadeUp } from '../../../../../shared/animations/scroll.animations';
import { AnimateOnScrollDirective } from '../../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-about-header',
  imports: [TranslateModule, AnimateOnScrollDirective],
  templateUrl: './about-header.html',
  styleUrl: './about-header.scss',
  animations: [scrollFadeUp],
})
export class AboutHeader {
  animationState: 'hidden' | 'visible' = 'hidden';

  onAnimate(): void {
    this.animationState = 'visible';
  }
}
