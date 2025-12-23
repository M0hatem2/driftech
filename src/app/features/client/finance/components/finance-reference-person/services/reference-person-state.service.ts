import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ReferencePersonData {
  totalPrice: string;
  downPayment: string;
  hasSpecificCar: string; // 'yes' or 'no'
  
  // Specific car details
  specificCarBrand: string;
  specificCarModel: string;
  specificCarYear: string;
  specificCarPrice: string;
  
  // Car search details
  selectedCarTypes: string[]; // array of car types
  searchCarBrand: string;
  searchCarModel: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReferencePersonStateService {
  private readonly STORAGE_KEY = 'finance_reference_person_data';
  
  // Default form data
  private readonly defaultData: ReferencePersonData = {
    totalPrice: '',
    downPayment: '',
    hasSpecificCar: '',
    specificCarBrand: '',
    specificCarModel: '',
    specificCarYear: '',
    specificCarPrice: '',
    selectedCarTypes: [],
    searchCarBrand: '',
    searchCarModel: ''
  };

  private formDataSubject = new BehaviorSubject<ReferencePersonData>(this.loadFromStorage());
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
  getFormData(): ReferencePersonData {
    return this.formDataSubject.value;
  }

  /**
   * Update form data
   */
  updateFormData(data: Partial<ReferencePersonData>): void {
    const currentData = this.formDataSubject.value;
    const updatedData = { ...currentData, ...data };
    this.formDataSubject.next(updatedData);
   }

  /**
   * Update specific field
   */
  updateField(field: keyof ReferencePersonData, value: any): void {
    const currentData = this.formDataSubject.value;
    const updatedData = { ...currentData, [field]: value };
    this.formDataSubject.next(updatedData);
  }

  /**
   * Add car type to selected types
   */
  addCarType(carType: string): void {
    const currentData = this.formDataSubject.value;
    const selectedTypes = [...currentData.selectedCarTypes];
    if (!selectedTypes.includes(carType)) {
      selectedTypes.push(carType);
    }
    this.updateField('selectedCarTypes', selectedTypes);
  }

  /**
   * Remove car type from selected types
   */
  removeCarType(carType: string): void {
    const currentData = this.formDataSubject.value;
    const selectedTypes = currentData.selectedCarTypes.filter(type => type !== carType);
    this.updateField('selectedCarTypes', selectedTypes);
  }

  /**
   * Check if form has any data
   */
  hasData(): boolean {
    const data = this.formDataSubject.value;
    return (
      data.totalPrice.trim() !== '' ||
      data.downPayment.trim() !== '' ||
      data.hasSpecificCar !== '' ||
      data.specificCarBrand.trim() !== '' ||
      data.specificCarModel.trim() !== '' ||
      data.specificCarYear.trim() !== '' ||
      data.specificCarPrice.trim() !== '' ||
      data.selectedCarTypes.length > 0 ||
      data.searchCarBrand.trim() !== '' ||
      data.searchCarModel.trim() !== ''
    );
  }

  /**
   * Check if form is completely filled
   */
  isFormComplete(): boolean {
    const data = this.formDataSubject.value;
    
    // Basic financial data
    if (!data.totalPrice.trim() || !data.downPayment.trim() || !data.hasSpecificCar) {
      return false;
    }
    
    // If specific car
    if (data.hasSpecificCar === 'yes') {
      return (
        data.specificCarBrand.trim() !== '' &&
        data.specificCarModel.trim() !== '' &&
        data.specificCarYear.trim() !== '' &&
        data.specificCarPrice.trim() !== ''
      );
    }
    
    // If car search
    if (data.hasSpecificCar === 'no') {
      return (
        data.selectedCarTypes.length > 0 &&
        data.searchCarBrand.trim() !== '' &&
        data.searchCarModel.trim() !== ''
      );
    }
    
    return false;
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
  private saveToStorage(data: ReferencePersonData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
     }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): ReferencePersonData {
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