import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NewlineToBrPipe } from '../../../../../shared/pipes/newline-to-br-pipe';
import { scrollFadeUp } from '../../../../../shared/animations/scroll.animations';
import { AnimateOnScrollDirective } from '../../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-drive-home',
  imports: [RouterLink, TranslateModule, NewlineToBrPipe, AnimateOnScrollDirective],
  templateUrl: './drive-home.html',
  styleUrl: './drive-home.scss',
  animations: [scrollFadeUp],
})
export class DriveHome {
  animationState: 'hidden' | 'visible' = 'hidden';

  onAnimate(): void {
    this.animationState = 'visible';
  }
}
