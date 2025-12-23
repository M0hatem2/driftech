import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthPopupService {
  private showPopupSubject = new BehaviorSubject<boolean>(false);
  public showPopup$ = this.showPopupSubject.asObservable();
  
  private authSubscription: Subscription | null = null;

  constructor(private authService: AuthService) {
    // Subscribe to auth changes to automatically hide popup when user logs in
    this.startAuthMonitoring();
  }

  private startAuthMonitoring(): void {
    // Check auth state every second to detect login
    this.authSubscription = new Subscription();
    
    const checkAuth = () => {
      if (this.showPopupSubject.value && this.authService.isAuthenticated()) {
        this.hidePopup();
      }
      
      // Check again in 1 second
      setTimeout(checkAuth, 1000);
    };
    
    checkAuth();
  }

  /**
   * Check if user is authenticated, if not show popup
   * @returns true if authenticated, false if popup is shown
   */
  checkAuthAndShowPopup(): boolean {
     if (this.authService.isAuthenticated()) {
       return true;
    } else {
       this.showPopup();
      return false;
    }
  }

  /**
   * Show the login required popup
   */
  showPopup(): void {
     this.showPopupSubject.next(true);
   }

  /**
   * Hide the login required popup
   */
  hidePopup(): void {
     this.showPopupSubject.next(false);
   }

  /**
   * Get current popup state
   */
  isPopupVisible(): boolean {
    return this.showPopupSubject.value;
  }

  /**
   * Clean up subscriptions
   */
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}