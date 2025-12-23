import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface WorkDetailsData {
  occupationType: string;
  jobTitle: string;
  monthlyIncome: string;
  workExperience: string;
  workAddress: string;
  workPhone: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkDetailsStateService {
  private readonly STORAGE_KEY = 'finance_work_details_data';
  
  // Default form data
  private readonly defaultData: WorkDetailsData = {
    occupationType: '',
    jobTitle: '',
    monthlyIncome: '',
     workExperience: '',
    workAddress: '',
    workPhone: ''
  };

  private formDataSubject = new BehaviorSubject<WorkDetailsData>(this.loadFromStorage());
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
  getFormData(): WorkDetailsData {
    return this.formDataSubject.value;
  }

  /**
   * Update form data
   */
  updateFormData(data: Partial<WorkDetailsData>): void {
    const currentData = this.formDataSubject.value;
    const updatedData = { ...currentData, ...data };
    this.formDataSubject.next(updatedData);
    console.log('Work details form data updated:', updatedData);
  }

  /**
   * Update specific field
   */
  updateField(field: keyof WorkDetailsData, value: string): void {
    const currentData = this.formDataSubject.value;
    const updatedData = { ...currentData, [field]: value };
    this.formDataSubject.next(updatedData);
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
    console.log('Work details form data cleared');
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
  private saveToStorage(data: WorkDetailsData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Could not save to localStorage:', error);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): WorkDetailsData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        console.log('Loaded work details form data from storage:', parsedData);
        return { ...this.defaultData, ...parsedData };
      }
    } catch (error) {
      console.warn('Could not load from localStorage:', error);
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
      console.warn('Could not clear localStorage:', error);
    }
  }

  /**
   * Export data for debugging
   */
  exportData(): string {
    return JSON.stringify(this.formDataSubject.value, null, 2);
  }
}