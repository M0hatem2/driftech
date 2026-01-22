import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 import { VerificationOTP } from '../verification-otp/verification-otp';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, VerificationOTP, TranslateModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  showOtpPopup = false;
  emailAddress = '';

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(email: string): void {
    if (!email || email.trim() === '') {
      this.errorMessage = 'Please enter your email';
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    if (email.length > 255) {
      this.errorMessage = 'Email must be 255 characters or less';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(email).subscribe({
      next: (response: any) => {
        this.isLoading = false;
         this.successMessage = 'OTP sent to your email. Please check your inbox.';
        // Show OTP popup instead of navigating
        this.emailAddress = email;
        this.showOtpPopup = true;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to send OTP. Please try again.';
       },
    });
  }

  closeOtpPopup(): void {
    this.showOtpPopup = false;
    this.emailAddress = '';
    this.successMessage = '';
  }
}
