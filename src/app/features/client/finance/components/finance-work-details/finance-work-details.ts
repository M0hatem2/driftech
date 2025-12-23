import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { WorkDetailsStateService } from './services/work-details-state.service';

@Component({
  selector: 'app-finance-work-details',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './finance-work-details.html',
  styleUrl: './finance-work-details.scss',
})
export class FinanceWorkDetails implements OnInit, OnDestroy {
  // Form fields
  occupationType = '';
  jobTitle = '';
  monthlyIncome = '';
  workExperience = '';
  workAddress = '';
  workPhone = '';

  private destroy$ = new Subject<void>();

  constructor(
    private stateService: WorkDetailsStateService
  ) {}

  ngOnInit(): void {
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
    this.occupationType = savedData.occupationType || '';
    this.jobTitle = savedData.jobTitle || '';
    this.monthlyIncome = savedData.monthlyIncome || '';
    this.workExperience = savedData.workExperience || '';
    this.workAddress = savedData.workAddress || '';
    this.workPhone = savedData.workPhone || '';
    console.log('Loaded saved work details form data:', savedData);
  }

  /**
   * Subscribe to form data changes from state service
   */
  private subscribeToFormDataChanges(): void {
    this.stateService.formData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log('Work details form data changed from state service:', data);
        this.occupationType = data.occupationType || '';
        this.jobTitle = data.jobTitle || '';
        this.monthlyIncome = data.monthlyIncome || '';
        this.workExperience = data.workExperience || '';
        this.workAddress = data.workAddress || '';
        this.workPhone = data.workPhone || '';
      });
  }

  /**
   * Handle form field changes and update state service
   */
  private updateFormField(field: string, value: string): void {
    this.stateService.updateField(field as any, value);
  }

  /**
   * Handle occupation type change
   */
  onOccupationTypeChange(): void {
    this.updateFormField('occupationType', this.occupationType);
  }

  /**
   * Handle job title change
   */
  onJobTitleChange(): void {
    this.updateFormField('jobTitle', this.jobTitle);
  }

  /**
   * Handle monthly income change
   */
  onMonthlyIncomeChange(): void {
    this.updateFormField('monthlyIncome', this.monthlyIncome);
  }

  /**
   * Handle work experience change
   */
  onWorkExperienceChange(): void {
    this.updateFormField('workExperience', this.workExperience);
  }

  /**
   * Handle work address change
   */
  onWorkAddressChange(): void {
    this.updateFormField('workAddress', this.workAddress);
  }

  /**
   * Handle work phone change
   */
  onWorkPhoneChange(): void {
    this.updateFormField('workPhone', this.workPhone);
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.isFormValid()) {
      console.log('Form submitted successfully:', this.getFormData());
      // Add navigation logic here or emit event to parent component
      // this.stateService.submitForm();
    } else {
      console.warn('Form validation failed');
      // You could add visual feedback for invalid form here
    }
  }

  /**
   * Handle navigation to previous step
   */
  onPrevious(): void {
    console.log('Navigating to previous step');
    // Add navigation logic here or emit event to parent component
    // this.stateService.navigateToPrevious();
  }

  /**
   * Get form validation state
   */
  isFormValid(): boolean {
    return !!(
      this.occupationType &&
      this.jobTitle.trim() &&
      this.monthlyIncome.trim() &&
      this.workExperience &&
      this.workAddress.trim()
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
}
