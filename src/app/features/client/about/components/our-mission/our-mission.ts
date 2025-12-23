import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { scrollFadeUp } from '../../../../../shared/animations/scroll.animations';
import { AnimateOnScrollDirective } from '../../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-our-mission',
  imports: [TranslateModule, AnimateOnScrollDirective],
  templateUrl: './our-mission.html',
  styleUrl: './our-mission.scss',
  animations: [scrollFadeUp],
})
export class OurMission {
  animationState: 'hidden' | 'visible' = 'hidden';

  onAnimate(): void {
    this.animationState = 'visible';
  }
}
