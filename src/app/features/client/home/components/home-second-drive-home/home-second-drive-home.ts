import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NewlineToBrPipe } from '../../../../../shared/pipes/newline-to-br-pipe';
import { scrollFadeUp } from '../../../../../shared/animations/scroll.animations';
import { AnimateOnScrollDirective } from '../../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-home-second-drive-home',
  imports: [TranslateModule, NewlineToBrPipe, AnimateOnScrollDirective],
  templateUrl: './home-second-drive-home.html',
  styleUrl: './home-second-drive-home.scss',
  animations: [scrollFadeUp],
})
export class HomeSecondDriveHome {
  animationState: 'hidden' | 'visible' = 'hidden';

  onAnimate(): void {
    this.animationState = 'visible';
  }
}
