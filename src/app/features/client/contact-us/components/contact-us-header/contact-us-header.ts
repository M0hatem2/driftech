import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { scrollFadeUp } from '../../../../../shared/animations/scroll.animations';
import { AnimateOnScrollDirective } from '../../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-contact-us-header',
  imports: [TranslateModule, AnimateOnScrollDirective],
  templateUrl: './contact-us-header.html',
  styleUrl: './contact-us-header.scss',
  animations: [scrollFadeUp],
})
export class ContactUsHeader {
  animationState: 'hidden' | 'visible' = 'hidden';

  onAnimate(): void {
    this.animationState = 'visible';
  }
}
