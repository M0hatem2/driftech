import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanToggle } from '../../../shared/lan-toggle/lan-toggle';
 import { NotificationIcon } from '../../../shared/notification-icon/notification-icon';
import path from 'node:path';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, TranslateModule, LanToggle, NotificationIcon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  mobileOpen = false;
  currentLang = 'en';

  constructor(private authService: AuthService) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  menu = [
    { label: 'HOME', path: '' },
    { label: 'FINANCE', path: '/finance' },
    { label: 'ABOUT', path: '/about' },
    { label: 'CONTACT_US', path: '/contact-us' },
    {label:'VLOGS',path:'/vlogs'}
  ];

  toggleMenu() {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMenu() {
    this.mobileOpen = false;
  }

  toggleLang() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
  }
}
