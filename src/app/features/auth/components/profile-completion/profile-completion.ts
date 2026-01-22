import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
 import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-completion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './profile-completion.html',
  styleUrl: './profile-completion.scss',
})
export class ProfileCompletion implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.profileForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        phone_number: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
        date_of_birth: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit() {
    // Get the email from auth service and auto-fill it
    const currentUser = this.authService.getUser();
    if (currentUser && currentUser.email) {
      this.profileForm.patchValue({
        email: currentUser.email,
      });
    } else {
      this.errorMessage = 'Email not found. Please go back and try again.';
    }
  }

  // Custom validator to check if passwords match
  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const passwordConfirmation = control.get('password_confirmation');

    if (!password || !passwordConfirmation) {
      return null;
    }

    if (password.value !== passwordConfirmation.value) {
      passwordConfirmation.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.profileForm.value;

    // Get current user data
    const currentUser = this.authService.getUser();
    if (!currentUser || !currentUser.id) {
      this.isLoading = false;
      this.errorMessage =
        'User data not found. Please go back and try the registration process again.';
      return;
    }

    // Format the date properly
    const formattedData = {
      user_id: currentUser.id,
      name: formData.name,
      phone: formData.phone_number,
      email: formData.email,
      gender: formData.gender,
      date_of_birth: formData.date_of_birth,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    };

    this.authService.completeProfile(formattedData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Profile completed successfully!';

        // Update stored user data
        if (response.user) {
          this.authService.storeUserData(response.user);
        }

        // Redirect to account profile after a short delay
        setTimeout(() => {
          this.router.navigate(['/account/profile']);
        }, 1500);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to complete profile. Please try again.';
       },
    });
  }

  // Helper method to mark all form fields as touched to show validation errors
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
