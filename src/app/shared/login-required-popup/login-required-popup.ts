import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoginPopupService } from '../login-popup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-required-popup',
  imports: [CommonModule],
  templateUrl: './login-required-popup.html',
  styleUrl: './login-required-popup.scss',
})
export class LoginRequiredPopup implements OnInit, OnDestroy {
  isVisible = false;
  
  // Authentication popup state
  showAuthPopup = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private loginPopupService: LoginPopupService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription = this.loginPopupService.showPopup$.subscribe((show) => {
      this.isVisible = show;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
 navigateToLogin(): void {
    this.hideAuthPopup();
    this.router.navigate(['/login']);
  }
  hideAuthPopup(): void {
    this.showAuthPopup = false;
  }

  /**
   * Navigate to register page
   */
  navigateToRegister(): void {
    this.hideAuthPopup();
    this.router.navigate(['/register']);
  }
  closePopup() {
    this.loginPopupService.hidePopup();
  }

  goToLogin() {
    this.loginPopupService.hidePopup();
    window.location.href = '/login';
  }

  goToRegister() {
    this.loginPopupService.hidePopup();
    window.location.href = '/sign-up';
  }
}
