import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface FinancingRequestResponse {
  can_apply: boolean;
  message: string;
  data?: FinancingRequestData;
  errors?: { [key: string]: string[] };
}

export interface FinancingRequestData {
  id: number;
  user_id: number;
  full_name: string;
  phone_number: string;
  email: string;
  governorate_id: number;
  occupation_type: number;
  monthly_income: string;
  job_title: string;
  area_id: number;
  card_front: string;
  card_back: string;
  down_payment: string;
  car_model: string;
  model_year: string;
  preferred_brand: string | null;
  car_price: string;
  car_brand: string;
  status: string;
  created_at: string | null;
  updated_at: string | null;
  reference_phone_number: string | null;
  person_relation: string | null;
}

export interface FinancingRequestFormData {
  full_name: string;
  phone_number: string;
  email: string;
  governorate_id: number;
  area_id?: number;
  occupation_type: string;
  monthly_income: string;
  job_title: string;
  car_brand: string;
  car_model: string;
  model_year: string;
  preferred_brand?: string | null;
  car_price: number;
  down_payment: number;
  card_front?: File;
  card_back?: File;
}

@Injectable({
  providedIn: 'root',
})
export class FinancingRequestService {
  private readonly BASE_URL = 'https://driftech.tech/dashboard/public/api';

  constructor(private http: HttpClient) {}

  /**
   * Submit financing request with multipart form data
   */
  submitFinancingRequest(formData: FinancingRequestFormData): Observable<FinancingRequestResponse> {
    // Check if running in browser
    if (typeof window === 'undefined') {
      return throwError(
        () => new Error('Financing requests can only be submitted from the browser')
      );
    }

    const formDataToSubmit = new FormData();

    // Add all required form fields
    formDataToSubmit.append('full_name', formData.full_name);
    formDataToSubmit.append('phone_number', formData.phone_number);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('governorate_id', formData.governorate_id.toString());
    formDataToSubmit.append('occupation_type', formData.occupation_type);
    formDataToSubmit.append('monthly_income', formData.monthly_income);
    formDataToSubmit.append('job_title', formData.job_title);
    formDataToSubmit.append('car_brand', formData.car_brand);
    formDataToSubmit.append('car_model', formData.car_model);
    formDataToSubmit.append('model_year', formData.model_year);
    formDataToSubmit.append('car_price', formData.car_price.toString());
    formDataToSubmit.append('down_payment', formData.down_payment.toString());

    // Add optional fields
    if (formData.area_id) {
      formDataToSubmit.append('area_id', formData.area_id.toString());
    }

    if (formData.preferred_brand) {
      formDataToSubmit.append('preferred_brand', formData.preferred_brand);
    }

    // Add file fields - ensure they are valid image files
    if (formData.card_front && formData.card_front.size > 0) {
      // Validate the file is an image
      const frontValidation = this.validateFile(formData.card_front);
      if (!frontValidation.isValid) {
        return throwError(
          () => new Error(`Card front validation failed: ${frontValidation.error}`)
        );
      }
      formDataToSubmit.append('card_front', formData.card_front, formData.card_front.name);
    }

    if (formData.card_back && formData.card_back.size > 0) {
      // Validate the file is an image
      const backValidation = this.validateFile(formData.card_back);
      if (!backValidation.isValid) {
        return throwError(() => new Error(`Card back validation failed: ${backValidation.error}`));
      }
      formDataToSubmit.append('card_back', formData.card_back, formData.card_back.name);
    }

    console.log('Submitting financing request with files:', {
      card_front: formData.card_front
        ? {
            name: formData.card_front.name,
            type: formData.card_front.type,
            size: formData.card_front.size,
          }
        : null,
      card_back: formData.card_back
        ? {
            name: formData.card_back.name,
            type: formData.card_back.type,
            size: formData.card_back.size,
          }
        : null,
    });

    // Debug: Log FormData entries
    console.log('FormData entries being sent:');
    for (let [key, value] of formDataToSubmit.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    // Don't set Content-Type header manually - let browser set it for FormData
    return this.http
      .post<FinancingRequestResponse>(`${this.BASE_URL}/auth/financing-requests`, formDataToSubmit)
      .pipe(
        map((response) => {
          console.log('Financing request response:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Check if user can apply for financing
   */
  checkFinancingEligibility(): Observable<FinancingRequestResponse> {
    // This would be a separate endpoint to check eligibility
    // For now, we'll just try to submit and handle the response
    // Create valid image files for testing
    const createValidImageFile = (): File => {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 100, 100);
      }
      return new File([canvas.toDataURL()], 'test.jpg', { type: 'image/jpeg' });
    };

    return this.submitFinancingRequest({
      full_name: '',
      phone_number: '',
      email: '',
      governorate_id: 0,
      occupation_type: '',
      monthly_income: '',
      job_title: '',
      car_brand: '',
      car_model: '',
      model_year: '',
      car_price: 0,
      down_payment: 0,
      card_front: createValidImageFile(),
      card_back: createValidImageFile(),
    }).pipe(
      catchError((error) => {
        // If it's an eligibility check, we don't want to show errors for empty data
        if (error.status === 422) {
          return throwError(() => new Error('Validation failed - please fill all required fields'));
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'حدث خطأ غير معروف';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `خطأ في العميل: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'يتطلب تسجيل الدخول. يرجى تسجيل الدخول لإرسال طلب التمويل.';
      } else if (error.status === 400) {
        // Check for "already has financing request" message
        if (error.error?.message?.includes('already have a financing request in process')) {
          errorMessage = 'لديك بالفعل طلب تمويل قيد المعالجة.';
        } else {
          errorMessage = error.error?.message || 'خطأ في الطلب';
        }
      } else if (error.status === 422) {
        if (error.error?.errors) {
          // Validation errors
          const validationErrors = Object.keys(error.error.errors)
            .map((key) => `${key}: ${error.error.errors[key].join(', ')}`)
            .join('; ');
          errorMessage = `أخطاء في التحقق: ${validationErrors}`;
        } else {
          errorMessage =
            error.error?.message || 'فشل في التحقق من البيانات. يرجى مراجعة البيانات المدخلة.';
        }
      } else if (error.status === 500) {
        errorMessage = 'خطأ داخلي في الخادم. يرجى المحاولة بعد 5 دقائق.';
      } else if (error.status === 0) {
        errorMessage = 'خطأ في الشبكة. يرجى التحقق من الاتصال بالإنترنت.';
      } else {
        errorMessage = `خطأ في الخادم: ${error.status} - ${error.message}`;
      }
    }

    console.error('Financing request error:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Validate file before upload
   */
  validateFile(
    file: File,
    maxSize: number = 4 * 1024 * 1024
  ): { isValid: boolean; error?: string } {
    if (!file) {
      return { isValid: false, error: 'File is required' };
    }

    if (file.size > maxSize) {
      return { isValid: false, error: `File size must be less than ${maxSize / (1024 * 1024)}MB` };
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
    }

    return { isValid: true };
  }

  /**
   * Create a preview URL for image file
   */
  createImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Revoke object URL to free memory
   */
  revokeImagePreview(url: string): void {
    URL.revokeObjectURL(url);
  }
}
