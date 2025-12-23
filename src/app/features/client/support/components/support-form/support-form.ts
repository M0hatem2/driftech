import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { HelpRequestService, HelpRequestData } from '../../services/help-request.service';
import { LoginRequiredPopupComponent } from '../../../../auth/components/login-required-popup/login-required-popup.component';

@Component({
  selector: 'app-support-form',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, LoginRequiredPopupComponent],
  templateUrl: './support-form.html',
  styleUrl: './support-form.scss',
})
export class SupportForm implements OnInit {
  supportForm: FormGroup;
  isAuthenticated = false;
  showLoginPopup = false;
  showSuccessPopup = false;
  isSubmitting = false;
  submitError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private helpRequestService: HelpRequestService
  ) {
    this.supportForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mobile_number: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      sub_type: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      // Pre-fill email if user is authenticated
      const user = this.authService.getUser();
      if (user?.email) {
        this.supportForm.patchValue({ email: user.email });
      }
    }
  }

  onSubmit(): void {
    if (!this.isAuthenticated) {
      this.showLoginPopup = true;
      return;
    }

    if (this.supportForm.valid) {
      this.submitForm();
    } else {
      this.markFormGroupTouched();
    }
  }

  private submitForm(): void {
    this.isSubmitting = true;
    this.submitError = null;

    const formData: HelpRequestData = {
      ...this.supportForm.value,
      type: 'support',
    };

    this.helpRequestService.submitHelpRequest(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.status) {
          this.showSuccessPopup = true;
          this.supportForm.reset();
        } else {
          this.submitError = response.message || 'Failed to submit request';
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error submitting help request:', error);
        this.submitError = 'An error occurred while submitting your request. Please try again.';
      },
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.supportForm.controls).forEach((key) => {
      const control = this.supportForm.get(key);
      control?.markAsTouched();
    });
  }

  closeLoginPopup(): void {
    this.showLoginPopup = false;
  }

  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
  }

  // Helper methods for form validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.supportForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.supportForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }
}
