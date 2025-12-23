import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-account-layout',
  standalone: false,
  templateUrl: './account-layout.component.html',
  styleUrls: ['./account-layout.component.scss'],
})
export class AccountLayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  navigationItems = [
    {
      path: '/account/profile',
      icon: 'fas fa-user',
      title: 'PROFILE',
      arabicTitle: 'PROFILE',
    },
    {
      path: '/account/finance-status',
      icon: 'fas fa-chart-line',
      title: 'FINANCE_STATUS',
      arabicTitle: 'FINANCE_STATUS',
    },
    {
      path: '/account/how-it-works',
      icon: 'fas fa-question-circle',
      title: 'HOW_IT_WORKS',
      arabicTitle: 'HOW_IT_WORKS',
    },
    {
      path: '',
      icon: 'fas fa-sign-out-alt',
      title: 'LOGOUT',
      arabicTitle: 'LOGOUT',
      isLogout: true,
    },

    //{
    //   path: '/account/support',
    //   icon: 'fas fa-headset',
    //   title: 'SUPPORT',
    //   arabicTitle: 'SUPPORT'
    // }
  ];

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
