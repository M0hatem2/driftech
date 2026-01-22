import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeAutoFinance } from '../../../home/components/home-auto-finance/home-auto-finance';
import { FinanceChooseYourCarCard } from '../../../../../shared/finance-choose-your-car-card/finance-choose-your-car-card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FinancePaymentCalculator } from '../finance-payment-calculator/finance-payment-calculator';
import { FinancePersonalInformation } from '../finance-personal-information/finance-personal-information';
import { FinanceWorkDetails } from '../finance-work-details/finance-work-details';
import { FinanceReferencePerson } from '../finance-reference-person/finance-reference-person';
import { FinanceIdentityVerification } from '../finance-identity-verification/finance-identity-verification';
import { FinanceVerificationDocuments } from '../finance-verification-documents/finance-verification-documents';
import { FinanceFinalResult } from '../finance-final-result/finance-final-result';
import { FinanceDataCollectionService } from '../../../../../shared/services/finance-data-collection.service';
import { FinancingRequestService } from '../../../../../shared/services/financing-request.service';
 import { LoginRequiredPopup } from '../../../../../shared/login-required-popup/login-required-popup';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-finance-content',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FinancePaymentCalculator,
    FinancePersonalInformation,
    FinanceWorkDetails,
    FinanceReferencePerson,
    FinanceIdentityVerification,
    FinanceVerificationDocuments,
    FinanceFinalResult,
    LoginRequiredPopup,
  ],
  templateUrl: './finance-content.html',
  styleUrl: './finance-content.scss',
})
export class FinanceContent implements OnInit {
  steps = [1, 2, 3];
  currentStep = 0;
  formData: { [key: string]: string } = {
    step1: '',
    step2: '',
    step3: '',
  };

  // Submission states
  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;

  // Contact information for submission
  contactInfo = {
    fullName: '',
    phoneNumber: '',
    email: '',
  };

  // Authentication popup state
  showAuthPopup = false;

  // Error popup state
  showErrorPopup = false;
  errorDetails = {
    titleKey: '',
    messageKey: '',
    message: '',
    missingFields: [] as string[],
    isServerError: false,
  };

  constructor(
    private dataCollectionService: FinanceDataCollectionService,
    private financingRequestService: FinancingRequestService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  nextStep(): void {
    // Check if user is authenticated before proceeding with cleanup
    const isAuth = this.authService.forceAuthCheck();
     
    if (!isAuth) {
       this.showAuthPopup = true;
      return;
    }

    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  // Alternative nextStep method with better authentication handling
  async nextStepAsync(): Promise<void> {
    // First try immediate check
    let isAuth = this.authService.isAuthenticated();
 
    // If not authenticated, wait a bit for potential timing issues
    if (!isAuth) {
       isAuth = await this.authService.waitForAuth(3000);
    }

    
    if (!isAuth) {
       this.showAuthPopup = true;
      return;
    }

    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  /**
   * Handle form submission
   *
   * NOTE: File validation should be handled in the personal information component (Step 1)
   * Files are uploaded in finance-personal-information component and stored locally
   * The main validation for files happens in the PersonalInformation component's isFormValid() method
   */
  submit(): void {
    this.isSubmitting = true;
    this.submitMessage = '';
    this.submitSuccess = false;

    try {
      // Check if all data is complete
      const validation = this.dataCollectionService.isAllDataComplete();
      if (!validation.isComplete) {
        this.errorDetails = {
          titleKey: 'MISSING_REQUIRED_FIELDS',
          messageKey: 'PLEASE_COMPLETE_REQUIRED_FIELDS',
          message: '',
          missingFields: validation.missingFields,
          isServerError: false,
        };
        this.showErrorPopup = true;
        this.isSubmitting = false;
        return;
      }

      // Get contact information from the collected form data
      const collectedData = this.dataCollectionService.collectAllFormData();
      const contactInfo = {
        fullName: collectedData.personalInfo.fullName,
        phoneNumber: collectedData.personalInfo.phoneNumber,
        email: collectedData.personalInfo.email,
      };

      // Get files from the personal information state service
      const uploadedFiles = this.dataCollectionService.getUploadedFiles();

      // Convert collected data to financing request format
      // Files are now optional - pass files only if they exist
      const financingRequestData = this.dataCollectionService.convertToFinancingRequestData(
        uploadedFiles.cardFrontFile || null,
        uploadedFiles.cardBackFile || null,
        contactInfo
      );

      
      // Submit to API
      this.financingRequestService.submitFinancingRequest(financingRequestData).subscribe({
        next: (response) => {
           this.isSubmitting = false;

          if (response.can_apply) {
            // Success case - new financing request created
            this.submitSuccess = true;
            this.submitMessage = response.message || 'FINANCING_REQUEST_SENT_SUCCESSFULLY';

            // Clear form data after successful submission
            setTimeout(() => {
              this.dataCollectionService.clearAllData();
              this.resetForm();
            }, 3000);
          } else {
            // User already has a financing request in process
            this.errorDetails = {
              titleKey: 'FINANCING_REQUEST_EXISTS',
              messageKey: response.message ? '' : 'ALREADY_HAVE_FINANCING_REQUEST',
              message: response.message || '',
              missingFields: [],
              isServerError: true,
            };
            this.showErrorPopup = true;
          }
        },
        error: (error) => {
           this.isSubmitting = false;

          // Handle specific error cases
          if (error.message.includes('Authentication required')) {
            this.errorDetails = {
              titleKey: 'LOGIN_REQUIRED_TITLE',
              messageKey: 'REQUIRES_LOGIN_FIRST',
              message: '',
              missingFields: [],
              isServerError: true,
            };
          } else if (error.message.includes('لديك بالفعل طلب تمويل')) {
            this.errorDetails = {
              titleKey: 'FINANCING_REQUEST_EXISTS',
              messageKey: 'WAIT_FOR_CURRENT_REQUEST',
              message: '',
              missingFields: [],
              isServerError: true,
            };
          } else if (error.message.includes('Validation errors')) {
            this.errorDetails = {
              titleKey: 'ERROR_IN_ENTERED_DATA',
              messageKey: '',
              message: error.message,
              missingFields: [],
              isServerError: true,
            };
          } else {
            this.errorDetails = {
              titleKey: 'ERROR_IN_SENDING',
              messageKey: '',
              message: error.message || '',
              missingFields: [],
              isServerError: true,
            };
          }
          this.showErrorPopup = true;
        },
      });
    } catch (error) {
       this.errorDetails = {
        titleKey: 'UNEXPECTED_ERROR',
        messageKey: 'UNEXPECTED_ERROR_OCCURRED',
        message: '',
        missingFields: [],
        isServerError: true,
      };
      this.showErrorPopup = true;
      this.isSubmitting = false;
    }
  }

  /**
   * Reset form after successful submission
   */
  private resetForm(): void {
    this.currentStep = 0;
    this.formData = {
      step1: '',
      step2: '',
      step3: '',
    };
    this.contactInfo = {
      fullName: '',
      phoneNumber: '',
      email: '',
    };
    this.submitMessage = '';
    this.submitSuccess = false;
    this.hideErrorPopup();
  }

  /**
   * Hide authentication popup
   */
  hideAuthPopup(): void {
    this.showAuthPopup = false;
  }

  /**
   * Hide error popup
   */
  hideErrorPopup(): void {
    this.showErrorPopup = false;
    this.errorDetails = {
      titleKey: '',
      messageKey: '',
      message: '',
      missingFields: [],
      isServerError: false,
    };
  }

  /**
   * Navigate to login page
   */
  navigateToLogin(): void {
    this.hideAuthPopup();
    this.router.navigate(['/auth/login']);
  }

  /**
   * Navigate to register page
   */
  navigateToRegister(): void {
    this.hideAuthPopup();
    this.router.navigate(['/auth/register']);
  }

  /**
   * Get data summary for debugging
   */
  getDataSummary(): string {
    return this.dataCollectionService.getDataSummary();
  }
}
