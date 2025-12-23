import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-verification-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './verification-otp.html',
  styleUrl: './verification-otp.scss',
})
export class VerificationOTP implements OnInit {
  @Input() email = '';
  @Output() closePopupEvent = new EventEmitter<void>();

  otpCode = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Component initialized with email as input property
   }

  onOtpInputChange(event: any): void {
    const input = event.target;
    let value = input.value;

    // Only allow digits and limit to 6 characters
    value = value.replace(/[^0-9]/g, '');
    if (value.length > 6) {
      value = value.substring(0, 6);
    }

    input.value = value;
    this.otpCode = value;
  }

  verifyOtp(): void {
    if (!this.otpCode || this.otpCode.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit OTP code';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Convert OTP to integer as required by the API
    const otpNumber = parseInt(this.otpCode, 10);

    this.authService.verifyOtp(this.email, otpNumber).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = 'OTP verified successfully!';
 
        // Store authentication data
        this.authService.storeAuthData(response);

        // Close popup and navigate to profile completion
        setTimeout(() => {
          this.closePopupEvent.emit();
          this.router.navigate(['/auth/profile-completion']);
        }, 1500);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Invalid OTP code. Please try again.';
       },
    });
  }

  onClosePopup(): void {
    this.closePopupEvent.emit();
  }

  resendOtp(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // For now, we'll just show a message since the register endpoint sends OTP
    // In a real implementation, you might have a separate resend endpoint
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Please use the register form to resend OTP.';
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }, 1000);
  }
}
