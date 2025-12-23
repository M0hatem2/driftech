import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { CarModelsService } from './services/car-models.service';
import { ReferencePersonStateService } from './services/reference-person-state.service';
import { CarModel, GroupedCarModels } from './models/car-model.interface';

@Component({
  selector: 'app-finance-reference-person',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './finance-reference-person.html',
  styleUrl: './finance-reference-person.scss',
})
export class FinanceReferencePerson implements OnInit, OnDestroy {
  // API data
  groupedCarModels: GroupedCarModels = {};
  brandNames: string[] = [];

  // Loading states
  isLoadingCarModels = true;
  errorMessage = '';

  // Car type options
  carTypes = [
    { value: 'sedan', labelKey: 'SEDAN' },
    { value: 'suv', labelKey: 'SUV' },
    { value: 'hatchback', labelKey: 'HATCHBACK' },
    { value: 'pickup', labelKey: 'PICKUP' },
    { value: 'coupe', labelKey: 'COUPE' },
    { value: 'convertible', labelKey: 'CONVERTIBLE' },
  ];

  // Form fields
  totalPrice = '';
  downPayment = '';
  hasSpecificCar = '';

  // Specific car details
  specificCarBrand = '';
  specificCarModel = '';
  specificCarYear = '';
  specificCarPrice = '';

  // Car search details
  selectedCarTypes: string[] = [];
  searchCarBrand = '';
  searchCarModel = '';

  private destroy$ = new Subject<void>();

  constructor(
    private carModelsService: CarModelsService,
    private stateService: ReferencePersonStateService
  ) {}

  ngOnInit(): void {
    this.loadCarModels();
    this.loadSavedFormData();
    this.subscribeToFormDataChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load car models from API
   */
  private loadCarModels(): void {
    this.isLoadingCarModels = true;
    this.errorMessage = '';

    this.carModelsService
      .loadCarModels()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.groupedCarModels = this.carModelsService.getCachedGroupedModels();
          this.brandNames = this.carModelsService.getBrandNames();
          this.isLoadingCarModels = false;
         },
        error: (error) => {
          this.errorMessage = 'Failed to load car models. Please refresh the page.';
          this.isLoadingCarModels = false;
         },
      });

    // If data is already cached, use it immediately
    if (this.carModelsService.isCarModelsLoaded()) {
      this.groupedCarModels = this.carModelsService.getCachedGroupedModels();
      this.brandNames = this.carModelsService.getBrandNames();
      this.isLoadingCarModels = false;
    }
  }

  /**
   * Load saved form data from state service
   */
  private loadSavedFormData(): void {
    const savedData = this.stateService.getFormData();
    this.totalPrice = savedData.totalPrice;
    this.downPayment = savedData.downPayment;
    this.hasSpecificCar = savedData.hasSpecificCar;
    this.specificCarBrand = savedData.specificCarBrand;
    this.specificCarModel = savedData.specificCarModel;
    this.specificCarYear = savedData.specificCarYear;
    this.specificCarPrice = savedData.specificCarPrice;
    this.selectedCarTypes = [...savedData.selectedCarTypes];
    this.searchCarBrand = savedData.searchCarBrand;
    this.searchCarModel = savedData.searchCarModel;
   }

  /**
   * Subscribe to form data changes from state service
   */
  private subscribeToFormDataChanges(): void {
    this.stateService.formData$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
       this.totalPrice = data.totalPrice;
      this.downPayment = data.downPayment;
      this.hasSpecificCar = data.hasSpecificCar;
      this.specificCarBrand = data.specificCarBrand;
      this.specificCarModel = data.specificCarModel;
      this.specificCarYear = data.specificCarYear;
      this.specificCarPrice = data.specificCarPrice;
      this.selectedCarTypes = [...data.selectedCarTypes];
      this.searchCarBrand = data.searchCarBrand;
      this.searchCarModel = data.searchCarModel;
    });
  }

  /**
   * Handle form field changes and update state service
   */
  private updateFormField(field: string, value: any): void {
    this.stateService.updateField(field as any, value);
  }

  /**
   * Handle price changes
   */
  onTotalPriceChange(): void {
    this.updateFormField('totalPrice', this.totalPrice);
  }

  onDownPaymentChange(): void {
    this.updateFormField('downPayment', this.downPayment);
  }

  /**
   * Handle car selection change
   */
  onCarSelectionChange(): void {
    this.updateFormField('hasSpecificCar', this.hasSpecificCar);
  }

  /**
   * Handle specific car details changes
   */
  onSpecificCarBrandChange(): void {
    this.updateFormField('specificCarBrand', this.specificCarBrand);
    // Reset model when brand changes
    this.specificCarModel = '';
    this.updateFormField('specificCarModel', '');
  }

  onSpecificCarModelChange(): void {
    this.updateFormField('specificCarModel', this.specificCarModel);
  }

  onSpecificCarYearChange(): void {
    this.updateFormField('specificCarYear', this.specificCarYear);
  }

  onSpecificCarPriceChange(): void {
    this.updateFormField('specificCarPrice', this.specificCarPrice);
  }

  /**
   * Handle car type selection (checkbox)
   */
  onCarTypeChange(carType: string, isChecked: boolean): void {
    if (isChecked) {
      this.stateService.addCarType(carType);
    } else {
      this.stateService.removeCarType(carType);
    }
  }

  /**
   * Handle search car details changes
   */
  onSearchCarBrandChange(): void {
    this.updateFormField('searchCarBrand', this.searchCarBrand);
    // Reset model when brand changes
    this.searchCarModel = '';
    this.updateFormField('searchCarModel', '');
  }

  onSearchCarModelChange(): void {
    this.updateFormField('searchCarModel', this.searchCarModel);
  }

  /**
   * Get models for selected brand (specific car)
   */
  getSpecificCarModels(): CarModel[] {
    if (!this.specificCarBrand) return [];
    return this.carModelsService.getModelsForBrand(this.specificCarBrand);
  }

  /**
   * Get models for selected brand (search)
   */
  getSearchCarModels(): CarModel[] {
    if (!this.searchCarBrand) return [];
    return this.carModelsService.getModelsForBrand(this.searchCarBrand);
  }

  /**
   * Check if car type is selected
   */
  isCarTypeSelected(carType: string): boolean {
    return this.selectedCarTypes.includes(carType);
  }

  /**
   * Refresh car models data
   */
  refreshCarModels(): void {
    this.carModelsService.clearCache();
    this.loadCarModels();
  }

  /**
   * Get form validation state
   */
  isFormValid(): boolean {
    return this.stateService.isFormComplete();
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
