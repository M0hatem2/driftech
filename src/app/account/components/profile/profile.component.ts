import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from './services/profile.service';
import { User } from './models/profile.interface';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  user: User | null = null;
  showEditPhoneModal = false;
  phoneEditForm: FormGroup;
  isUpdatingPhone = false;
  phoneUpdateError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      gender: ['', Validators.required],
    });

    this.phoneEditForm = this.fb.group({
      new_phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadUserProfile();
    // Disable all form controls since this is a view-only profile
    this.profileForm.disable();
  }

  loadUserProfile() {
    this.isLoading = true;
    this.profileService.getUserProfile().subscribe({
      next: (response) => {
        this.user = response.user;
        this.profileForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          phone: this.user.phone,
          date_of_birth: this.user.date_of_birth,
          gender: this.user.gender,
        });
        this.isLoading = false;
       },
      error: (error) => {
         this.isLoading = false;
      },
    });
  }

  openEditPhoneModal() {
    this.phoneEditForm.reset();
    this.phoneUpdateError = null;
    this.showEditPhoneModal = true;
  }

  closeEditPhoneModal() {
    this.showEditPhoneModal = false;
    this.phoneEditForm.reset();
  }

  updatePhone() {
    if (this.phoneEditForm.invalid) {
      this.markFormGroupTouched(this.phoneEditForm);
      return;
    }

    this.isUpdatingPhone = true;
    const formData = this.phoneEditForm.value;

    this.authService.updatePhone(formData.new_phone, formData.password).subscribe({
      next: (response) => {
        this.isUpdatingPhone = false;
        // Update the user object and form with new phone number
        if (this.user) {
          this.user.phone = formData.new_phone;
          this.profileForm.patchValue({ phone: formData.new_phone });
        }
        this.closeEditPhoneModal();
       },
      error: (error) => {
        this.isUpdatingPhone = false;
         this.phoneUpdateError =
          error.error?.error || 'An error occurred while updating phone number';
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
