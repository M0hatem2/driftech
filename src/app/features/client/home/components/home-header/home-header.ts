import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../../../../core/services/translation.service';
import { AuthService } from '../../../../../features/auth/services/auth.service';
import { ChatVisibilityService } from '../../../../../shared/services/chat-visibility.service';
import { LoginRequiredPopupComponent } from '../../../../../features/auth/components/login-required-popup/login-required-popup.component';
import { CommonModule } from '@angular/common';
import { fadeUp } from '../../../../../shared/animations/animations';
import { scrollFadeUp } from '../../../../../shared/animations/scroll.animations';
import { AnimateOnScrollDirective } from '../../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.html',
  imports: [ TranslateModule, LoginRequiredPopupComponent, CommonModule,AnimateOnScrollDirective],
  animations: [scrollFadeUp],
})
export class HomeHeaderComponent {
  showLoginPopup = false;
  animationState: 'hidden' | 'visible' = 'hidden';

  onAnimate(): void {
    this.animationState = 'visible';
  }
  constructor(
    private router: Router,
    private translationService: TranslationService,
    private authService: AuthService,
    private chatVisibilityService: ChatVisibilityService
  ) {}

  get backgroundImage(): string {
    return this.translationService.getCurrentLang() === 'ar'
      ? 'url("assets/img/image copy.png")'
      : 'url("assets/img/image.png")';
  }

  showDevelopmentPopup(): void {
    alert('This feature is under development');
  }

  openMatchNow(): void {
    if (this.authService.isAuthenticated()) {
      // User is logged in, open chat bot
      this.chatVisibilityService.openChat();
    } else {
      // User is not logged in, show login required popup
      this.showLoginPopup = true;
    }
  }

  closeLoginPopup(): void {
    this.showLoginPopup = false;
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  scrollToAutoFinance(): void {
    console.log('Scroll to auto finance triggered');

    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
      // First try: Find element by ID
      let element = document.getElementById('home-auto-finance');

      if (!element) {
        console.log('ID search failed, trying attribute selector');
        // Second try: Find element by attribute selector
        element = document.querySelector('[id="home-auto-finance"]');
      }

      if (element) {
        console.log('Element found, scrolling...');
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } else {
        console.log('Element still not found, using fallback');
        // Fallback: Scroll to a position approximately where the component should be
        const estimatedPosition = document.body.scrollHeight * 0.4; // 40% down the page
        window.scrollTo({
          top: estimatedPosition,
          behavior: 'smooth',
        });
      }
    }, 200);
  }
}
