import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

export interface CarPart2Data {
  engine_type: string;
  mileage: number | null;
  vehicle_status: string;
  refurbishment_status: string;
  transmission_type: string;
  drive_type: string;
  engine_capacity: number | null;
  min_horse_power: number | null;
  max_horse_power: number | null;
}

export interface Part2ValidationErrors {
  [key: string]: string;
}

// Debounce utility for performance optimization
class Debouncer {
  private timeout: number | null = null;

  debounce<T extends (...args: any[]) => any>(fn: T, delay: number = 300): T {
    return ((...args: any[]) => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = window.setTimeout(() => fn.apply(this, args), delay);
    }) as T;
  }
}

// Memoization utility for expensive calculations
class Memoizer {
  private cache = new Map<string, any>();

  get<T>(key: string, factory: () => T): T {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const value = factory();
    this.cache.set(key, value);
    return value;
  }

  clear(): void {
    this.cache.clear();
  }
}

@Component({
  selector: 'app-part2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './part2.html',
  styleUrl: './part2.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Part2 implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() initialData: Partial<CarPart2Data> = {};
  @Input() parentForm: FormGroup | null = null;
  @Output() dataChange = new EventEmitter<CarPart2Data>();
  @Output() formValidityChange = new EventEmitter<boolean>();
  @Output() saveAndContinueRequested = new EventEmitter<void>();

  public carData: CarPart2Data = {
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

  public part2Form!: FormGroup;
  public powerValidationMessage = '';
  private validationErrors: Part2ValidationErrors = {};
  private isDestroyed = false;

  // Performance optimization instances
  private debouncer = new Debouncer();
  private memoizer = new Memoizer();

  // Loading states for better UX
  public isValidatingPower = false;
  public isFieldFocused = false;
  public focusedField = '';

  // Real-time suggestions and smart defaults
  public smartSuggestions = {
    suggestedEngineCapacity: null as number | null,
    suggestedHorsePowerRange: null as { min: number; max: number } | null,
    validationHints: [] as string[],
  };

  // Optimized dropdown options with better structure
  public engineTypes = [
    { value: '1', label: 'بنزين', icon: 'fas fa-gas-pump', group: 'traditional' },
    { value: '2', label: 'ديزل', icon: 'fas fa-oil-can', group: 'traditional' },
    { value: '3', label: 'كهربائي', icon: 'fas fa-bolt', group: 'modern' },
    { value: '4', label: 'هايبرد', icon: 'fas fa-leaf', group: 'modern' },
    { value: '5', label: 'هايبرد قابل للشحن', icon: 'fas fa-charging-station', group: 'modern' },
    { value: '6', label: 'خلايا وقود الهيدروجين', icon: 'fas fa-atom', group: 'modern' },
    { value: '7', label: 'غاز طبيعي مضغوط (CNG)', icon: 'fas fa-cloud', group: 'traditional' },
    { value: '8', label: 'غاز البترول المسال (LPG)', icon: 'fas fa-fire', group: 'traditional' },
    { value: '9', label: 'وقود مرن', icon: 'fas fa-adjust', group: 'traditional' },
    { value: '10', label: 'توربوcharged', icon: 'fas fa-rocket', group: 'traditional' },
  ];

  public vehicleStatuses = [
    { value: '1', label: 'جديد', icon: 'fas fa-star', color: 'text-green-600' },
    { value: '2', label: 'مستعمل', icon: 'fas fa-clock', color: 'text-blue-600' },
    { value: '4', label: 'كهربائي', icon: 'fas fa-bolt', color: 'text-yellow-600' },
    { value: '5', label: 'معتمد مستعمل', icon: 'fas fa-certificate', color: 'text-purple-600' },
    { value: '6', label: 'خسارة', icon: 'fas fa-ban', color: 'text-red-600' },
    { value: '7', label: 'تالف', icon: 'fas fa-wrench', color: 'text-orange-600' },
    { value: '8', label: 'للأجزاء', icon: 'fas fa-cogs', color: 'text-gray-600' },
    { value: '9', label: 'إعادة بناء', icon: 'fas fa-hammer', color: 'text-indigo-600' },
    { value: '10', label: 'مجدد', icon: 'fas fa-sync', color: 'text-teal-600' },
    { value: '11', label: 'مؤجر', icon: 'fas fa-key', color: 'text-pink-600' },
    { value: '12', label: 'للتصدير فقط', icon: 'fas fa-plane', color: 'text-cyan-600' },
  ];

  public refurbishmentStatuses = [
    { value: 'empty', label: 'فارغ', icon: 'fas fa-minus' },
    { value: 'limited_offer', label: 'عرض محدود', icon: 'fas fa-tag' },
    { value: 'fully_refurbished', label: 'مجدد بالكامل', icon: 'fas fa-check-circle' },
    { value: 'certified_refurbished', label: 'مجدد معتمد', icon: 'fas fa-certificate' },
  ];

  public transmissionTypes = [
    { value: '1', label: 'يدوي', icon: 'fas fa-hand-paper', category: 'manual' },
    { value: '2', label: 'أوتوماتيكي', icon: 'fas fa-cog', category: 'automatic' },
    { value: '3', label: 'CVT', icon: 'fas fa-infinity', category: 'automatic' },
    { value: '4', label: 'ثنائي القابض', icon: 'fas fa-exchange-alt', category: 'automatic' },
    { value: '5', label: 'Tiptronic', icon: 'fas fa-level-up-alt', category: 'automatic' },
    { value: '6', label: 'شبه أوتوماتيكي', icon: 'fas fa-hand-rock', category: 'semi-automatic' },
    {
      value: '7',
      label: 'Direct Shift Gearbox (DSG)',
      icon: 'fas fa-sync-alt',
      category: 'automatic',
    },
    { value: '8', label: 'يدوي متتالي', icon: 'fas fa-step-forward', category: 'manual' },
    { value: '9', label: 'يدوي آلي', icon: 'fas fa-robot', category: 'semi-automatic' },
  ];

  public driveTypes = [
    {
      value: 'fwd',
      label: 'جر أمامي (FWD)',
      icon: 'fas fa-arrow-right',
      description: 'اقتصادي في الوقود',
    },
    {
      value: 'rwd',
      label: 'جر خلفي (RWD)',
      icon: 'fas fa-arrow-left',
      description: 'أداء رياضي أفضل',
    },
    {
      value: 'awd',
      label: 'جر رباعي (AWD)',
      icon: 'fas fa-arrows-alt',
      description: 'ثبات في جميع الظروف',
    },
    { value: '4wd', label: '4WD', icon: 'fas fa-truck', description: 'للطرق الوعرة' },
    { value: '2wd', label: '2WD', icon: 'fas fa-arrows-h', description: 'بسيط وموثوق' },
  ];

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit() {
    if (this.initialData) {
      this.carData = { ...this.carData, ...this.initialData };
    }

    if (this.parentForm) {
      this.integrateWithParentForm();
    }

    this.emitDataChange();
    this.validateForm();
    this.updateSmartSuggestions();
  }

  ngOnDestroy() {
    this.isDestroyed = true;
    this.memoizer.clear();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData'] && !changes['initialData'].firstChange) {
      this.carData = { ...this.carData, ...changes['initialData'].currentValue };
      this.updateSmartSuggestions();
      this.validateForm();
    }
  }

  ngAfterViewInit(): void {
    this.addKeyboardNavigation();
  }

  private initializeForm(): void {
    this.part2Form = this.fb.group({
      engine_type: ['', [Validators.required]],
      mileage: ['', [Validators.min(0)]],
      vehicle_status: ['', [Validators.required]],
      refurbishment_status: [''],
      transmission_type: ['', [Validators.required]],
      drive_type: ['', [Validators.required]],
      engine_capacity: ['', [Validators.min(0)]],
      min_horse_power: ['', [Validators.min(0), Validators.max(2000)]],
      max_horse_power: ['', [Validators.min(0), Validators.max(2000)]],
    });

    // Debounced form validation for better performance
    const debouncedValidation = this.debouncer.debounce(() => {
      if (!this.isDestroyed) {
        this.validateForm();
        this.emitDataChange();
      }
    }, 300);

    this.part2Form.valueChanges.subscribe(() => {
      if (!this.isDestroyed) {
        this.updateSmartSuggestions();
        debouncedValidation();
      }
    });
  }

  private integrateWithParentForm(): void {
    if (this.parentForm) {
      Object.keys(this.part2Form.controls).forEach((key) => {
        if (!this.parentForm!.get(key)) {
          this.parentForm!.addControl(key, this.part2Form.get(key)!);
        }
      });
    }
  }

  private emitDataChange(): void {
    if (!this.isDestroyed) {
      this.dataChange.emit(this.carData);
    }
  }

  private validateForm(): void {
    if (this.isDestroyed) return;

    this.validationErrors = {};

    // Validate individual fields with optimized error handling
    const formGroup = this.part2Form;
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control?.errors && control?.touched) {
        this.setValidationError(key, control);
      }
    });

    // Cross-field validation with performance optimization
    this.validateHorsePowerRange();
    this.validateEngineDependencies();
    this.validateTransmissionCompatibility();

    // Emit form validity
    const isValid = Object.keys(this.validationErrors).length === 0 && this.part2Form.valid;
    this.formValidityChange.emit(isValid);
  }

  private setValidationError(fieldName: string, control: AbstractControl): void {
    const errors = control.errors;
    if (!errors) return;

    let errorMessage = '';

    if (errors['required']) {
      errorMessage = 'هذا الحقل مطلوب';
    } else if (errors['min']) {
      errorMessage = `القيمة يجب أن تكون أكبر من ${errors['min'].min}`;
    } else if (errors['max']) {
      errorMessage = `القيمة يجب أن تكون أقل من ${errors['max'].max}`;
    } else if (errors['pattern']) {
      errorMessage = 'تنسيق غير صحيح';
    }

    this.validationErrors[fieldName] = errorMessage;
  }

  private validateHorsePowerRange(): void {
    if (this.carData.min_horse_power && this.carData.max_horse_power) {
      if (this.carData.min_horse_power > this.carData.max_horse_power) {
        this.validationErrors['horse_power_range'] =
          'الحد الأدنى للقوة يجب أن يكون أقل من الحد الأقصى';
      }

      // Intelligent horse power validation
      const range = this.carData.max_horse_power - this.carData.min_horse_power;
      if (range < 5) {
        this.validationErrors['horse_power_range_small'] =
          'الفرق بين الحد الأدنى والأقصى صغير جداً';
      }

      // Realistic horse power ranges for different engine types
      this.validateHorsePowerByEngineType();
    }
  }

  private validateHorsePowerByEngineType(): void {
    if (!this.carData.engine_type || !this.carData.min_horse_power) return;

    const engineHorsePowerRanges = {
      '1': { min: 60, max: 800 }, // Petrol
      '2': { min: 70, max: 600 }, // Diesel
      '3': { min: 50, max: 1200 }, // Electric
      '4': { min: 80, max: 400 }, // Hybrid
      '5': { min: 100, max: 450 }, // Plugin Hybrid
    };

    const range =
      engineHorsePowerRanges[this.carData.engine_type as keyof typeof engineHorsePowerRanges];
    if (range) {
      if (this.carData.min_horse_power < range.min) {
        this.validationErrors[
          'min_horse_power'
        ] = `بالنسبة لنوع المحرك المختار، الحد الأدنى للقوة يجب أن يكون ${range.min} حصان على الأقل`;
      }
      if (this.carData.max_horse_power !== null && this.carData.max_horse_power > range.max) {
        this.validationErrors[
          'max_horse_power'
        ] = `بالنسبة لنوع المحرك المختار، الحد الأقصى للقوة يجب أن يكون ${range.max} حصان`;
      }
    }
  }

  private validateEngineDependencies(): void {
    // Electric cars should have specific engine capacity ranges
    if (this.carData.engine_type === '3') {
      // Electric
      if (this.carData.engine_capacity && this.carData.engine_capacity > 0) {
        this.validationErrors['engine_capacity'] = 'المركبات الكهربائية لا تحتاج سعة محرك تقليدية';
      }
    }

    // Engine capacity validation by engine type
    if (this.carData.engine_type && this.carData.engine_capacity) {
      const capacityRanges = {
        '1': { min: 800, max: 8000 }, // Petrol
        '2': { min: 1200, max: 10000 }, // Diesel
        '4': { min: 1000, max: 4000 }, // Hybrid
        '5': { min: 1200, max: 4000 }, // Plugin Hybrid
      };

      const range = capacityRanges[this.carData.engine_type as keyof typeof capacityRanges];
      if (range) {
        if (this.carData.engine_capacity < range.min) {
          this.validationErrors[
            'engine_capacity'
          ] = `سعة المحرك صغيرة جداً لهذا النوع (الحد الأدنى ${range.min}cc)`;
        }
        if (this.carData.engine_capacity > range.max) {
          this.validationErrors[
            'engine_capacity'
          ] = `سعة المحرك كبيرة جداً لهذا النوع (الحد الأقصى ${range.max}cc)`;
        }
      }
    }
  }

  private validateTransmissionCompatibility(): void {
    if (!this.carData.transmission_type || !this.carData.drive_type) return;

    // Manual transmission is more common with FWD and RWD
    const manualTransmissions = ['1', '8', '9'];
    if (manualTransmissions.includes(this.carData.transmission_type)) {
      if (this.carData.drive_type === 'awd' || this.carData.drive_type === '4wd') {
        // This is fine, just a common combination
      }
    }
  }

  private updateSmartSuggestions(): void {
    if (this.isDestroyed) return;

    this.memoizer.clear();

    // Smart engine capacity suggestions
    this.smartSuggestions.suggestedEngineCapacity = this.memoizer.get(
      `capacity_${this.carData.engine_type}`,
      () => this.calculateSuggestedEngineCapacity()
    );

    // Smart horse power range suggestions
    this.smartSuggestions.suggestedHorsePowerRange = this.memoizer.get(
      `power_${this.carData.engine_type}`,
      () => this.calculateSuggestedHorsePowerRange()
    );

    // Validation hints
    this.smartSuggestions.validationHints = this.generateValidationHints();
  }

  private calculateSuggestedEngineCapacity(): number | null {
    if (!this.carData.engine_type) return null;

    const capacitySuggestions = {
      '1': 1800, // Petrol
      '2': 2000, // Diesel
      '4': 1600, // Hybrid
      '5': 1800, // Plugin Hybrid
    };

    return (
      capacitySuggestions[this.carData.engine_type as keyof typeof capacitySuggestions] || null
    );
  }

  private calculateSuggestedHorsePowerRange(): { min: number; max: number } | null {
    if (!this.carData.engine_type) return null;

    const powerSuggestions = {
      '1': { min: 100, max: 400 }, // Petrol
      '2': { min: 120, max: 350 }, // Diesel
      '3': { min: 150, max: 500 }, // Electric
      '4': { min: 140, max: 250 }, // Hybrid
      '5': { min: 160, max: 300 }, // Plugin Hybrid
    };

    return powerSuggestions[this.carData.engine_type as keyof typeof powerSuggestions] || null;
  }

  private generateValidationHints(): string[] {
    const hints: string[] = [];

    if (this.carData.engine_type === '3' && this.carData.engine_capacity) {
      hints.push('المركبات الكهربائية لا تحتاج سعة محرك تقليدية');
    }

    if (this.carData.transmission_type === '2' && this.carData.drive_type === 'fwd') {
      hints.push('ناقل حركة أوتوماتيكي مع جر أمامي - مزيج شائع وفعال');
    }

    if (this.carData.vehicle_status === '5' && !this.carData.refurbishment_status) {
      hints.push('يُنصح بتحديد حالة التجديد للمركبات المعتمدة المستعملة');
    }

    return hints;
  }

  // Enhanced event handlers with better performance
  public onEngineTypeChange(value: string): void {
    this.carData.engine_type = value;
    this.part2Form.get('engine_type')?.setValue(value);
    this.updateSmartSuggestions();
    this.debouncedValidation();
    this.emitDataChange();
  }

  public onMileageChange(value: number | null): void {
    this.carData.mileage = value;
    this.part2Form.get('mileage')?.setValue(value);
    this.debouncedValidation();
    this.emitDataChange();
  }

  public onVehicleStatusChange(value: string): void {
    this.carData.vehicle_status = value;
    this.part2Form.get('vehicle_status')?.setValue(value);
    this.updateSmartSuggestions();
    this.debouncedValidation();
    this.emitDataChange();
  }

  public onRefurbishmentStatusChange(value: string): void {
    this.carData.refurbishment_status = value;
    this.part2Form.get('refurbishment_status')?.setValue(value);
    this.debouncedValidation();
    this.emitDataChange();
  }

  public onTransmissionTypeChange(value: string): void {
    this.carData.transmission_type = value;
    this.part2Form.get('transmission_type')?.setValue(value);
    this.updateSmartSuggestions();
    this.debouncedValidation();
    this.emitDataChange();
  }

  public onDriveTypeChange(value: string): void {
    this.carData.drive_type = value;
    this.part2Form.get('drive_type')?.setValue(value);
    this.updateSmartSuggestions();
    this.debouncedValidation();
    this.emitDataChange();
  }

  public onEngineCapacityChange(value: number | null): void {
    this.carData.engine_capacity = value;
    this.part2Form.get('engine_capacity')?.setValue(value);
    this.debouncedValidation();
    this.emitDataChange();
  }

  public onMinHorsePowerChange(value: number | null): void {
    this.carData.min_horse_power = value;
    this.part2Form.get('min_horse_power')?.setValue(value);
    this.debouncedValidation();
    this.emitDataChange();
  }

  public onMaxHorsePowerChange(value: number | null): void {
    this.carData.max_horse_power = value;
    this.part2Form.get('max_horse_power')?.setValue(value);
    this.debouncedValidation();
    this.emitDataChange();
  }

  // Debounced validation method
  private debouncedValidation = this.debouncer.debounce(() => {
    this.validateForm();
    this.emitDataChange();
  }, 200);

  // Enhanced utility methods
  public getFieldError(fieldName: string): string {
    return this.validationErrors[fieldName] || '';
  }

  public hasValidationErrors(): boolean {
    return Object.keys(this.validationErrors).length > 0;
  }

  public getValidationErrors(): string[] {
    return Object.values(this.validationErrors);
  }

  public isFormValid(): boolean {
    return !this.hasValidationErrors() && this.part2Form.valid;
  }

  // Enhanced action methods with loading states
  public validateHorsePower(): void {
    this.isValidatingPower = true;

    setTimeout(() => {
      this.powerValidationMessage = '';

      if (!this.carData.min_horse_power || !this.carData.max_horse_power) {
        this.powerValidationMessage = 'يرجى إدخال كلا من الحد الأدنى والأقصى للقوة';
        this.isValidatingPower = false;
        return;
      }

      if (this.carData.min_horse_power > this.carData.max_horse_power) {
        this.powerValidationMessage = 'الحد الأدنى يجب أن يكون أقل من الحد الأقصى';
        this.isValidatingPower = false;
        return;
      }

      const powerRange = this.carData.max_horse_power - this.carData.min_horse_power;

      if (powerRange < 5) {
        this.powerValidationMessage = 'الفرق بين الحد الأدنى والأقصى صغير جداً';
        this.isValidatingPower = false;
        return;
      }

      this.powerValidationMessage = '✓ نطاق القوة صحيح ومقبول';
      this.isValidatingPower = false;
    }, 800);
  }

  public resetForm(): void {
    this.carData = {
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

    this.part2Form.reset();
    this.validationErrors = {};
    this.powerValidationMessage = '';
    this.smartSuggestions = {
      suggestedEngineCapacity: null,
      suggestedHorsePowerRange: null,
      validationHints: [],
    };
    this.memoizer.clear();
    this.debouncedValidation();
    this.emitDataChange();
  }

  public saveAndContinue(): void {
    // Mark all fields as touched to show validation errors
    Object.keys(this.part2Form.controls).forEach((key) => {
      this.part2Form.get(key)?.markAsTouched();
    });

    if (this.isFormValid()) {
      this.saveAndContinueRequested.emit();
    } else {
      this.debouncedValidation();
    }
  }

  // Enhanced keyboard navigation
  private addKeyboardNavigation(): void {
    // Check if we're in browser environment (not SSR)
    if (typeof window !== 'undefined' && document) {
      const inputs = document.querySelectorAll('.part2-field input, .part2-field select');
      inputs.forEach((input, index) => {
        input.addEventListener('keydown', (event) => {
          const keyEvent = event as KeyboardEvent;
          if (keyEvent.key === 'Enter' || keyEvent.key === 'Tab') {
            event.preventDefault();
            const nextIndex = (index + 1) % inputs.length;
            (inputs[nextIndex] as HTMLElement).focus();
          }
        });
      });
    }
  }

  // Focus management
  public onFieldFocus(fieldName: string): void {
    this.isFieldFocused = true;
    this.focusedField = fieldName;
  }

  public onFieldBlur(): void {
    this.isFieldFocused = false;
    this.focusedField = '';

    // Trigger validation on blur for immediate feedback
    setTimeout(() => {
      this.debouncedValidation();
    }, 100);
  }

  // Public method to set data from parent
  public setData(data: Partial<CarPart2Data>): void {
    this.carData = { ...this.carData, ...data };

    Object.keys(data).forEach((key) => {
      const value = data[key as keyof CarPart2Data];
      this.part2Form.get(key)?.setValue(value);
    });

    this.updateSmartSuggestions();
    this.debouncedValidation();
    this.emitDataChange();
  }

  // Public method to get current data
  public getData(): CarPart2Data {
    return { ...this.carData };
  }

  // Auto-save functionality
  private autoSave = this.debouncer.debounce(() => {
    const dataToSave = {
      ...this.carData,
      timestamp: Date.now(),
      formVersion: '2.0',
    };

    try {
      localStorage.setItem('part2_autosave', JSON.stringify(dataToSave));
     } catch (error) {
     }
  }, 2000);

  // Call auto-save when data changes
  public triggerAutoSave(): void {
    this.autoSave();
  }

  // Load auto-saved data
  public loadAutoSavedData(): void {
    try {
      const savedData = localStorage.getItem('part2_autosave');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const age = Date.now() - parsed.timestamp;
        // Load data if it's less than 24 hours old
        if (age < 24 * 60 * 60 * 1000) {
          this.setData(parsed);
         }
      }
    } catch (error) {
     }
  }

  // Progress tracking methods
  public getCompletionPercentage(): number {
    const totalFields = this.getTotalFieldsCount();
    const filledFields = this.getFilledFieldsCount();
    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  }

  public getFilledFieldsCount(): number {
    let count = 0;
    
    if (this.carData.engine_type) count++;
    if (this.carData.mileage !== null && this.carData.mileage > 0) count++;
    if (this.carData.vehicle_status) count++;
    if (this.carData.refurbishment_status) count++;
    if (this.carData.transmission_type) count++;
    if (this.carData.drive_type) count++;
    if (this.carData.engine_capacity !== null && this.carData.engine_capacity > 0) count++;
    if (this.carData.min_horse_power !== null && this.carData.min_horse_power > 0) count++;
    if (this.carData.max_horse_power !== null && this.carData.max_horse_power > 0) count++;
    
    return count;
  }

  public getTotalFieldsCount(): number {
    return 9; // Total number of fields in the form
  }

  // Icon and visual helper methods
  public getEngineTypeIcon(engineType: string): string {
    const engine = this.engineTypes.find(e => e.value === engineType);
    return engine ? engine.icon : 'fas fa-cog text-gray-500';
  }

  public getMileageStatusIcon(): string {
    if (!this.carData.mileage) return 'fas fa-question-circle text-gray-400';
    
    if (this.carData.mileage < 10000) return 'fas fa-star text-green-500';
    if (this.carData.mileage < 50000) return 'fas fa-check-circle text-blue-500';
    if (this.carData.mileage < 100000) return 'fas fa-info-circle text-yellow-500';
    return 'fas fa-exclamation-triangle text-orange-500';
  }

  public getMileageStatusText(): string {
    if (!this.carData.mileage) return 'غير محدد';
    
    if (this.carData.mileage < 10000) return 'ممتاز';
    if (this.carData.mileage < 50000) return 'جيد';
    if (this.carData.mileage < 100000) return 'متوسط';
    return 'عالي';
  }

  public getVehicleStatusIcon(status: string): string {
    const vehicleStatus = this.vehicleStatuses.find(v => v.value === status);
    return vehicleStatus ? vehicleStatus.icon : 'fas fa-car text-gray-500';
  }

  public getRefurbishmentStatusIcon(status: string): string {
    const refurbishmentStatus = this.refurbishmentStatuses.find(r => r.value === status);
    return refurbishmentStatus ? refurbishmentStatus.icon : 'fas fa-tools text-gray-500';
  }

  public getTransmissionTypeIcon(transmissionType: string): string {
    const transmission = this.transmissionTypes.find(t => t.value === transmissionType);
    return transmission ? transmission.icon : 'fas fa-cogs text-gray-500';
  }

  public getDriveTypeIcon(driveType: string): string {
    const drive = this.driveTypes.find(d => d.value === driveType);
    return drive ? drive.icon : 'fas fa-road text-gray-500';
  }

  public getDriveTypeDescription(driveType: string): string {
    const drive = this.driveTypes.find(d => d.value === driveType);
    return drive ? drive.description : '';
  }

  // Horse power suggestion application
  public applySuggestedHorsePowerRange(): void {
    if (this.smartSuggestions.suggestedHorsePowerRange) {
      this.onMinHorsePowerChange(this.smartSuggestions.suggestedHorsePowerRange.min);
      this.onMaxHorsePowerChange(this.smartSuggestions.suggestedHorsePowerRange.max);
    }
  }

  // Accessibility methods
  public getAccessibilityAnnouncement(): string {
    if (this.hasValidationErrors()) {
      return `يوجد ${this.getValidationErrors().length} أخطاء في النموذج`;
    }
    
    if (this.isFormValid()) {
      return 'جميع البيانات مكتملة وصحيحة';
    }
    
    const completion = this.getCompletionPercentage();
    return `تم إكمال ${completion}% من البيانات`;
  }
}
