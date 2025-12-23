import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
  AfterViewInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { Part1 } from './component/part1/part1';
import { Part2, CarPart2Data } from './component/part2/part2';
import { Part3 } from './component/part3/part3';
import { Part4 } from "./component/part4/part4";

interface AccordionState {
  isExpanded: boolean;
  target: HTMLElement;
  button: HTMLElement;
  icon: HTMLElement;
}

interface CarData {
  brand: string;
  model: string;
  model_year: number;
  license_expire_date: string;
  body_style: string;
  type: string;
  min_fuel_economy: number;
  max_fuel_economy: number;
  color_ar: string;
  color_en: string;
  location_ar: string;
  location_en: string;
  description_en: string;
  description_ar: string;
  vehicle_category_en: string;
  vehicle_category_ar: string;
  length: number;
  width: number;
  height: number;
  engine_type: string;
  mileage: number;
  vehicle_status: string;
  refurbishment_status: string;
  transmission_type: string;
  drive_type: string;
  engine_capacity: number;
  min_horse_power: number;
  max_horse_power: number;
}

@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, Part1, Part2, Part3, Part4],
  templateUrl: './add-car.html',
  styleUrl: './add-car.scss',
})
export class AddCar implements OnInit, OnDestroy, AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private renderer = inject(Renderer2);
  private fb = inject(FormBuilder);
  private accordionStates: Map<string, AccordionState> = new Map();
  private animationDuration = 300;

  // Form and state management
  public carForm!: FormGroup;
  public isSubmitting = false;
  public submitMessage = '';
  public submitSuccess = false;

  // Part2 integration
  public part2Data: CarPart2Data = {
    engine_type: '',
    mileage: null,
    vehicle_status: '',
    refurbishment_status: '',
    transmission_type: '',
    drive_type: '',
    engine_capacity: null,
    min_horse_power: null,
    max_horse_power: null,
  };
  public isPart2Valid = false;

  constructor() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.carForm = this.fb.group({
      // Basic Information
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      model_year: [
        '',
        [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)],
      ],

      // Specifications
      license_expire_date: [''],
      body_style: [''],
      type: [''],

      // Performance
      min_fuel_economy: ['', [Validators.min(0)]],
      max_fuel_economy: ['', [Validators.min(0)]],

      // Bilingual Information
      color_ar: [''],
      color_en: [''],
      location_ar: [''],
      location_en: [''],
      description_en: [''],
      description_ar: [''],
      vehicle_category_en: [''],
      vehicle_category_ar: [''],

      // Dimensions
      length: ['', [Validators.min(0)]],
      width: ['', [Validators.min(0)]],
      height: ['', [Validators.min(0)]],

      // Additional Information
      engine_type: [''],
      mileage: ['', [Validators.min(0)]],
      vehicle_status: [''],
      refurbishment_status: [''],
      transmission_type: [''],
      drive_type: [''],
      engine_capacity: ['', [Validators.min(0)]],
      min_horse_power: ['', [Validators.min(0)]],
      max_horse_power: ['', [Validators.min(0)]],
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeWithDelay(100);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeWithDelay(200);
    }
  }

  private initializeWithDelay(delay: number) {
    setTimeout(() => {
      this.initializeProfessionalAccordion();
    }, delay);
  }

  private initializeProfessionalAccordion() {
    try {
      // Initialize Flowbite
      initFlowbite();
      this.setupProfessionalAccordion();
    } catch (error) {
      console.warn('Flowbite initialization failed, using manual setup:', error);
      this.setupProfessionalAccordion();
    }
  }

  private setupProfessionalAccordion() {
    const accordionButtons = document.querySelectorAll('[data-accordion-target]');

    accordionButtons.forEach((button, index) => {
      const targetId = button.getAttribute('data-accordion-target');
      if (targetId) {
        const target = document.querySelector(targetId) as HTMLElement;
        const icon = button.querySelector('[data-accordion-icon]') as HTMLElement;
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        if (target) {
          // Store accordion state
          this.accordionStates.set(targetId, {
            isExpanded,
            target,
            button: button as HTMLElement,
            icon,
          });

          // Ensure proper initial state
          if (!isExpanded) {
            this.renderer.addClass(target, 'hidden');
          }

          // Add professional event listener with debouncing
          this.addProfessionalEventListener(button as HTMLElement, targetId);

          // Add keyboard accessibility
          this.addKeyboardAccessibility(button as HTMLElement, targetId);
        }
      }
    });
  }

  private addProfessionalEventListener(button: HTMLElement, targetId: string) {
    let clickTimeout: number;

    button.addEventListener('click', (event) => {
      event.preventDefault();

      // Debounce rapid clicks
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }

      clickTimeout = window.setTimeout(() => {
        this.professionalToggleAccordion(targetId);
      }, 50);
    });
  }

  private addKeyboardAccessibility(button: HTMLElement, targetId: string) {
    // Make buttons focusable
    button.setAttribute('tabindex', '0');
    button.setAttribute('role', 'button');

    // Add Enter and Space key support
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.professionalToggleAccordion(targetId);
      }
    });
  }

  private professionalToggleAccordion(targetId: string) {
    const state = this.accordionStates.get(targetId);
    if (!state) return;

    const { target, button, icon } = state;
    const isCurrentlyExpanded = state.isExpanded;

    // Add loading state
    this.renderer.addClass(button, 'accordion-loading');

    // Calculate animation properties
    if (isCurrentlyExpanded) {
      this.closeAccordionWithAnimation(state);
    } else {
      this.openAccordionWithAnimation(state);
    }
  }

  private openAccordionWithAnimation(state: AccordionState) {
    const { target, button, icon } = state;

    // Remove hidden class to make element visible
    this.renderer.removeClass(target, 'hidden');

    // Set initial height for animation
    this.renderer.setStyle(target, 'height', '0px');
    this.renderer.setStyle(target, 'overflow', 'hidden');
    this.renderer.setStyle(target, 'opacity', '0');

    // Force reflow
    target.offsetHeight;

    // Animate open
    this.renderer.setStyle(target, 'height', target.scrollHeight + 'px');
    this.renderer.setStyle(target, 'opacity', '1');

    // Update icon
    this.updateIconRotation(icon, 180);

    // Update ARIA attributes
    this.renderer.setAttribute(button, 'aria-expanded', 'true');

    // Clean up styles after animation
    setTimeout(() => {
      this.renderer.removeStyle(target, 'height');
      this.renderer.removeStyle(target, 'overflow');
      this.renderer.removeStyle(target, 'opacity');
      this.renderer.removeClass(button, 'accordion-loading');
      state.isExpanded = true;
    }, this.animationDuration);
  }

  private closeAccordionWithAnimation(state: AccordionState) {
    const { target, button, icon } = state;

    // Set current height for animation
    const currentHeight = target.scrollHeight;
    this.renderer.setStyle(target, 'height', currentHeight + 'px');
    this.renderer.setStyle(target, 'overflow', 'hidden');

    // Force reflow
    target.offsetHeight;

    // Animate close
    this.renderer.setStyle(target, 'height', '0px');
    this.renderer.setStyle(target, 'opacity', '0');

    // Update icon
    this.updateIconRotation(icon, 0);

    // Update ARIA attributes
    this.renderer.setAttribute(button, 'aria-expanded', 'false');

    // Hide element after animation
    setTimeout(() => {
      this.renderer.addClass(target, 'hidden');
      this.renderer.removeStyle(target, 'height');
      this.renderer.removeStyle(target, 'overflow');
      this.renderer.removeStyle(target, 'opacity');
      this.renderer.removeClass(button, 'accordion-loading');
      state.isExpanded = false;
    }, this.animationDuration);
  }

  private updateIconRotation(icon: HTMLElement, degrees: number) {
    if (icon) {
      this.renderer.setStyle(icon, 'transform', `rotate(${degrees}deg)`);
      this.renderer.setStyle(icon, 'transition', 'transform 0.3s ease-in-out');
    }
  }

  // Public method to programmatically open accordion (useful for external controls)
  public openAccordion(targetId: string) {
    const state = this.accordionStates.get(targetId);
    if (state && !state.isExpanded) {
      this.professionalToggleAccordion(targetId);
    }
  }

  // Public method to programmatically close accordion
  public closeAccordion(targetId: string) {
    const state = this.accordionStates.get(targetId);
    if (state && state.isExpanded) {
      this.professionalToggleAccordion(targetId);
    }
  }

  // Helper method to get field error message
  public getFieldError(fieldName: string): string {
    const field = this.carForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        return 'هذا الحقل مطلوب';
      }
      if (field.errors['min']) {
        return `القيمة يجب أن تكون أكبر من ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `القيمة يجب أن تكون أقل من ${field.errors['max'].max}`;
      }
    }
    return '';
  }

  // Utility method to check if field has error
  public hasFieldError(fieldName: string): boolean {
    const field = this.carForm.get(fieldName);
    return !!(field?.errors && field?.touched);
  }

  // Part2 Integration Methods
  public onPart2DataChange(data: CarPart2Data): void {
    this.part2Data = { ...data };
    console.log('Part2 data changed:', this.part2Data);
  }

  public onPart2ValidityChange(isValid: boolean): void {
    this.isPart2Valid = isValid;
    console.log('Part2 validity changed:', isValid);
  }

  public onPart2SaveAndContinue(): void {
    // Move to next accordion section
    this.openAccordion('#accordion-collapse-body-3');
  }

  // Enhanced form submission handler
  public onSubmit(): void {
    if (this.isFormValid() && this.isPart2Valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitMessage = '';
      this.submitSuccess = false;

      // Combine all form data including Part2
      const completeCarData = {
        ...this.carForm.value,
        ...this.part2Data,
      };

      console.log('Complete car data to be submitted:', completeCarData);

      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.submitMessage = 'تم إضافة المركبة بنجاح!';

        // Reset form after successful submission
        setTimeout(() => {
          this.carForm.reset();
          this.resetAllComponents();
          this.submitMessage = '';
          this.submitSuccess = false;
        }, 3000);
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.carForm.controls).forEach((key) => {
        this.carForm.get(key)?.markAsTouched();
      });

      this.submitMessage = 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح';
      this.submitSuccess = false;
    }
  }

  // Check if entire form is valid
  public isFormValid(): boolean {
    return this.carForm.valid && this.isPart2Valid;
  }

  // Reset all components
  private resetAllComponents(): void {
    // Reset Part2 component data if there's a reference to it
    this.part2Data = {
      engine_type: '',
      mileage: null,
      vehicle_status: '',
      refurbishment_status: '',
      transmission_type: '',
      drive_type: '',
      engine_capacity: null,
      min_horse_power: null,
      max_horse_power: null,
    };
    this.isPart2Valid = false;
  }

  // Public method to get complete form data
  public getCompleteFormData(): CarData & CarPart2Data {
    return {
      ...this.carForm.value,
      ...this.part2Data,
    };
  }

  ngOnDestroy() {
    // Clean up all event listeners
    this.accordionStates.clear();
  }
}
