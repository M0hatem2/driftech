import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
 
@Component({
  selector: 'app-account-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-popup.component.html',
  styleUrls: ['./account-popup.component.scss'],
})
export class AccountPopupComponent {
  @Input() showPopup = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  closePopup(): void {
    this.showPopup = false;
  }

  cancel(): void {
    this.closePopup();
  }

  logout(): void {
    this.authService.logout();
    this.closePopup();
    this.router.navigate(['/auth/login']);
  }

  getAccountName(): string {
    const currentUser = this.authService.getUser();
    return currentUser?.name || currentUser?.email || 'User';
  }
}
