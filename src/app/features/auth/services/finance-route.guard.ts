import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthPopupService } from './auth-popup.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FinanceRouteGuard implements CanActivate {
  
  constructor(
    private authPopupService: AuthPopupService,
    private authService: AuthService
  ) {}

  canActivate(): boolean {
     
    // Use the AuthService's isAuthenticated method instead of direct localStorage access
    const isAuthenticated = this.authService.isAuthenticated();
     
    if (isAuthenticated) {
       return true;
    } else {
       // Show popup instead of redirecting
      this.authPopupService.showPopup();
      return false;
    }
  }
}