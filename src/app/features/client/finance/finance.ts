import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FinanceHeader } from './components/finance-header/finance-header';
import { FinanceContent } from './components/finance-content/finance-content';
import { FinanceChooseYourCar } from './components/finance-choose-your-car/finance-choose-your-car';
import { LoginRequiredPopupComponent } from '../../auth/components/login-required-popup/login-required-popup.component';
import { AuthPopupService } from '../../auth/services/auth-popup.service';
import { Subscription } from 'rxjs';
import { scrollFadeUp } from '../../../shared/animations/scroll.animations';
import { AnimateOnScrollDirective } from '../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-finance',
  imports: [
    CommonModule,
    FinanceHeader,
    FinanceContent,
    FinanceChooseYourCar,
    LoginRequiredPopupComponent,
    AnimateOnScrollDirective,
  ],
  templateUrl: './finance.html',
  animations: [scrollFadeUp],
})
export class Finance implements OnInit, OnDestroy {
  showLoginPopup = false; // Set to false - will be controlled by guard
  private popupSubscription: Subscription | null = null;
  animationState: 'hidden' | 'visible' = 'hidden';

  constructor(private authPopupService: AuthPopupService, private router: Router) {}

  ngOnInit(): void {
 
    // Check authentication on component initialization
    this.checkAuthentication();

    // Subscribe to popup state changes
    this.popupSubscription = this.authPopupService.showPopup$.subscribe((showPopup) => {
       this.showLoginPopup = showPopup;
    });
  }

  private checkAuthentication(): void {
 
    // Check if user is authenticated, if not show popup
    const isAuthenticated = this.authPopupService.checkAuthAndShowPopup();
   }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.popupSubscription) {
      this.popupSubscription.unsubscribe();
    }
  }

  onAnimate(): void {
    this.animationState = 'visible';
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
