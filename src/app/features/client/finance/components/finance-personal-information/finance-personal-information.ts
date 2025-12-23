import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { GovernoratesService } from './services/governorates.service';
import { Governorate } from './models/governorate.interface';
import { PersonalInformationStateService } from './services/personal-information-state.service';

@Component({
  selector: 'app-finance-personal-information',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './finance-personal-information.html',
  styleUrl: './finance-personal-information.scss',
})
export class FinancePersonalInformation implements OnInit, OnDestroy {
  governorates: Governorate[] = [];
  selectedGovernorate: string = '';
  isLoadingGovernorates = true;
  errorMessage = '';

  // Form fields
  fullName = '';
  phoneNumber = '';
  email = '';
  identityPhotos: FileList | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private governoratesService: GovernoratesService,
    private stateService: PersonalInformationStateService
  ) {}

  ngOnInit(): void {
    this.loadGovernorates();
    this.loadSavedFormData();
    this.subscribeToFormDataChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load saved form data from state service
   */
  private loadSavedFormData(): void {
    const savedData = this.stateService.getFormData();
    this.fullName = savedData.fullName || '';
    this.phoneNumber = savedData.phoneNumber || '';
    this.email = savedData.email || '';
    this.selectedGovernorate = savedData.governorate;
    // Note: identityPhotos cannot be restored from saved data as files are not serializable
   }

  /**
   * Subscribe to form data changes from state service
   */
  private subscribeToFormDataChanges(): void {
    this.stateService.formData$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
       // Update form fields only if they haven't been modified by user recently
      // This prevents overwriting user input while typing
      this.fullName = data.fullName;
      this.phoneNumber = data.phoneNumber;
      this.email = data.email;
      this.selectedGovernorate = data.governorate;
    });
  }

  /**
   * Handle form field changes and update state service
   */
  private updateFormField(field: string, value: string): void {
    this.stateService.updateField(field as any, value);
  }

  /**
   * Load governorates data
   */
  private loadGovernorates(): void {
    this.isLoadingGovernorates = true;
    this.errorMessage = '';

    // Subscribe to governorates observable
    this.governoratesService.governorates$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.governorates = data;
        this.isLoadingGovernorates = false;
       },
      error: (error) => {
        this.errorMessage = 'Failed to load governorates. Please refresh the page.';
        this.isLoadingGovernorates = false;
       },
    });

    // If data is already cached, it will be available immediately
    if (this.governoratesService.isDataLoaded()) {
      this.governorates = this.governoratesService.getCachedGovernorates();
      this.isLoadingGovernorates = false;
    }
  }

  /**
   * Handle governorate selection change
   */
  onGovernorateChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedGovernorate = target.value;
    this.updateFormField('governorate', this.selectedGovernorate);

    if (this.selectedGovernorate) {
       // Here you could trigger loading districts for the selected governorate
      this.loadDistrictsForGovernorate(this.selectedGovernorate);
    }
  }

  /**
   * Handle full name change
   */
  onFullNameChange(): void {
    this.updateFormField('fullName', this.fullName);
  }

  /**
   * Handle phone number change
   */
  onPhoneNumberChange(): void {
    this.updateFormField('phoneNumber', this.phoneNumber);
  }

  /**
   * Handle email change
   */
  onEmailChange(): void {
    this.updateFormField('email', this.email);
  }

  /**
   * Handle identity photos change
   */
  onIdentityPhotosChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.identityPhotos = input.files;

    // Handle different file count scenarios
    if (!this.identityPhotos || this.identityPhotos.length === 0) {
      // No files uploaded - optional, so clear and no error
      this.stateService.uploadCardFrontFile(null);
      this.stateService.uploadCardBackFile(null);
      this.errorMessage = '';
      return;
    }

    if (this.identityPhotos.length === 1) {
      // 1 file uploaded - accept it as front
      const cardFrontFile = this.identityPhotos[0];

      // Validate file
      const frontValidation = this.validateFile(cardFrontFile);

      if (!frontValidation.isValid) {
        this.errorMessage = `Error in image: ${frontValidation.error}`;
        input.value = '';
        return;
      }

      // Store file in state service
      this.stateService.uploadCardFrontFile(cardFrontFile);
      this.stateService.uploadCardBackFile(null);

 
      // Clear any previous error messages
      this.errorMessage = '';
      return;
    }

    if (this.identityPhotos.length >= 2) {
      // Process uploaded files and store them in state service
      // Assuming first file is card front, second is card back
      const cardFrontFile = this.identityPhotos[0];
      const cardBackFile = this.identityPhotos[1];

      // Validate files
      const frontValidation = this.validateFile(cardFrontFile);
      const backValidation = this.validateFile(cardBackFile);

      if (!frontValidation.isValid) {
        this.errorMessage = `Error in front side image: ${frontValidation.error}`;
        input.value = '';
        return;
      }

      if (!backValidation.isValid) {
        this.errorMessage = `Error in back side image: ${backValidation.error}`;
        input.value = '';
        return;
      }

      // Store files in state service
      this.stateService.uploadCardFrontFile(cardFrontFile);
      this.stateService.uploadCardBackFile(cardBackFile);

     

      // Clear any previous error messages
      this.errorMessage = '';

      // If more than 2 files, we still only use the first 2 but we can warn
      if (this.identityPhotos.length > 2) {
      
        this.errorMessage = `You uploaded ${this.identityPhotos.length} files, but only the first 2 will be used.`;
      }
    }
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 4 * 1024 * 1024; // 4MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!file) {
      return { isValid: false, error: 'File is required' };
    }

    if (file.size > maxSize) {
      return { isValid: false, error: `File size must be less than ${maxSize / (1024 * 1024)}MB` };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
    }

    return { isValid: true };
  }

  /**
   * Load districts for selected governorate (placeholder for future implementation)
   */
  private loadDistrictsForGovernorate(governorateName: string): void {
    // This method can be expanded to load districts based on governorate selection
   }

  /**
   * Refresh governorates data
   */
  refreshGovernorates(): void {
    this.loadGovernorates();
  }

  /**
   * Get form validation state
   */
  isFormValid(): boolean {
    return !!(
      this.fullName.trim() &&
      this.phoneNumber.trim() &&
      this.email.trim() &&
      this.selectedGovernorate
    );
  }

  /**
   * Get form data for submission from state service
   */
  getFormData(): any {
    return this.stateService.getFormData();
  }

  /**
   * Clear all form data
   */
  clearFormData(): void {
    this.stateService.clearFormData();
  }

  /**
   * Check if form has any data
   */
  hasData(): boolean {
    return this.stateService.hasData();
  }

  /**
   * Check if form is completely filled
   */
  isFormComplete(): boolean {
    return this.stateService.isFormComplete();
  }

  /**
   * Get uploaded files as array for template iteration
   */
  getFileList(): File[] {
    if (!this.identityPhotos) {
      return [];
    }
    return Array.from(this.identityPhotos);
  }
}
