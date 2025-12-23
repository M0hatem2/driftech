import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PersonalInformationData {
  fullName: string;
  phoneNumber: string;
  email: string;
  governorate: string;
  cardFrontFile?: File | null;
  cardBackFile?: File | null;
}

@Injectable({
  providedIn: 'root'
})
export class PersonalInformationStateService {
  private readonly STORAGE_KEY = 'finance_personal_info_data';
  
  // Default form data
  private readonly defaultData: PersonalInformationData = {
    fullName: '',
    phoneNumber: '',
    email: '',
    governorate: '',
    cardFrontFile: null,
    cardBackFile: null
  };

  private formDataSubject = new BehaviorSubject<PersonalInformationData>(this.loadFromStorage());
  public formData$ = this.formDataSubject.asObservable();

  constructor() {
    // Auto-save when data changes
    this.formData$.subscribe(data => {
      this.saveToStorage(data);
    });
  }

  /**
   * Get current form data
   */
  getFormData(): PersonalInformationData {
    return this.formDataSubject.value;
  }

  /**
   * Update form data
   */
  updateFormData(data: Partial<PersonalInformationData>): void {
    const currentData = this.formDataSubject.value;
    const updatedData = { ...currentData, ...data };
    this.formDataSubject.next(updatedData);
   }

  /**
   * Update specific field
   */
  updateField(field: keyof PersonalInformationData, value: string | File | null): void {
    const currentData = this.formDataSubject.value;
    const updatedData = { ...currentData, [field]: value };
    this.formDataSubject.next(updatedData);
  }

  /**
   * Upload card front file
   */
  uploadCardFrontFile(file: File | null): void {
    this.updateField('cardFrontFile', file);
   }

  /**
   * Upload card back file
   */
  uploadCardBackFile(file: File | null): void {
    this.updateField('cardBackFile', file);
   }

  /**
   * Get uploaded files
   */
  getUploadedFiles(): { cardFrontFile: File | null; cardBackFile: File | null } {
    const data = this.formDataSubject.value;
    return {
      cardFrontFile: data.cardFrontFile || null,
      cardBackFile: data.cardBackFile || null
    };
  }

  /**
   * Check if files are uploaded
   */
  hasFiles(): boolean {
    const data = this.formDataSubject.value;
    return !!(data.cardFrontFile && data.cardBackFile);
  }

  /**
   * Check if form has any data
   */
  hasData(): boolean {
    const data = this.formDataSubject.value;
    return Object.values(data).some(value => value.trim() !== '');
  }

  /**
   * Check if form is completely filled
   */
  isFormComplete(): boolean {
    const data = this.formDataSubject.value;
    return Object.values(data).every(value => value.trim() !== '');
  }

  /**
   * Clear all form data
   */
  clearFormData(): void {
    this.formDataSubject.next({ ...this.defaultData });
    this.clearStorage();
   }

  /**
   * Reset to default state
   */
  reset(): void {
    this.formDataSubject.next({ ...this.defaultData });
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(data: PersonalInformationData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
     }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): PersonalInformationData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
         return { ...this.defaultData, ...parsedData };
      }
    } catch (error) {
     }
    return { ...this.defaultData };
  }

  /**
   * Clear localStorage
   */
  private clearStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
     }
  }

  /**
   * Export data for debugging
   */
  exportData(): string {
    return JSON.stringify(this.formDataSubject.value, null, 2);
  }
}