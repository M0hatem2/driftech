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
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';

export interface CarCondition {
  id: string;
  name: string;
  part: string;
  description: string;
  image?: File | string | null;
  imagePreview?: string | null;
}

export interface CarPart4Data {
  conditions: CarCondition[];
}

export interface Part4ValidationErrors {
  [key: string]: string;
}

export interface ConditionType {
  value: string;
  label: string;
  icon: string;
  description: string;
  commonIssues: string[];
  typicalSeverity: 'low' | 'medium' | 'high';
}

// Debounce utility for performance optimization
class Debouncer {
  private timeout: any = null;

  debounce<T extends (...args: any[]) => any>(fn: T, delay: number = 300): T {
    return ((...args: any[]) => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      // Check if we're in browser environment (not SSR)
      if (typeof window !== 'undefined' && typeof setTimeout !== 'undefined') {
        this.timeout = setTimeout(() => fn.apply(this, args), delay);
      } else {
        // Fallback for SSR - execute immediately
        fn.apply(this, args);
      }
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
  selector: 'app-part4',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './part4.html',
  styleUrl: './part4.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Part4 implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() initialData: Partial<CarPart4Data> = {};
  @Input() parentForm: FormGroup | null = null;
  @Output() dataChange = new EventEmitter<CarPart4Data>();
  @Output() formValidityChange = new EventEmitter<boolean>();
  @Output() saveAndContinueRequested = new EventEmitter<void>();

  public carData: CarPart4Data = {
    conditions: [],
  };

  public part4Form!: FormGroup;
  public validationErrors: Part4ValidationErrors = {};
  private isDestroyed = false;

  // Performance optimization instances
  private debouncer = new Debouncer();
  private memoizer = new Memoizer();

  // Loading states for better UX
  public isProcessingImage = false;
  public isFieldFocused = false;
  public focusedField = '';

  // Smart suggestions and intelligent defaults
  public smartSuggestions = {
    suggestedConditions: [] as CarCondition[],
    commonIssues: [] as string[],
    validationHints: [] as string[],
    severityDistribution: { low: 0, medium: 0, high: 0 },
  };

  // Enhanced condition types with better structure
  public conditionTypes: ConditionType[] = [
    {
      value: 'Exterior',
      label: 'الخارجية',
      icon: 'fas fa-car-side',
      description: 'حالة الأجزاء الخارجية للسيارة',
      commonIssues: ['خدوش', 'صدأ', 'تلف في الطلاء', 'كسر في الزجاج'],
      typicalSeverity: 'medium',
    },
    {
      value: 'Interior',
      label: 'الداخلية',
      icon: 'fas fa-couch',
      description: 'حالة الأجزاء الداخلية للسيارة',
      commonIssues: ['تمزق في المقاعد', 'بقع', 'تلف في التابلو', 'رائحة'],
      typicalSeverity: 'low',
    },
    {
      value: 'Mechanical',
      label: 'الميكانيكية',
      icon: 'fas fa-cogs',
      description: 'حالة الأجزاء الميكانيكية للمحرك والأنظمة',
      commonIssues: ['ضوضاء غير طبيعية', 'تسريب', 'استهلاك عالي للوقود', 'اهتزاز'],
      typicalSeverity: 'high',
    },
    {
      value: 'Electrical',
      label: 'الكهربائية',
      icon: 'fas fa-bolt',
      description: 'حالة الأنظمة الكهربائية والإلكترونية',
      commonIssues: ['انتهاء بطارية', 'أعطال في الأضواء', 'مشاكل في النظام الصوتي'],
      typicalSeverity: 'medium',
    },
    {
      value: 'Suspension',
      label: 'نظام التعليق',
      icon: 'fas fa-arrows-alt-v',
      description: 'حالة نظام التعليق والمكابح',
      commonIssues: ['تآكل في الإطارات', 'اهتزاز عند الفرملة', 'ضوضاء عند القيادة'],
      typicalSeverity: 'high',
    },
    {
      value: 'Safety',
      label: 'السلامة',
      icon: 'fas fa-shield-alt',
      description: 'حالة أنظمة السلامة والأمان',
      commonIssues: ['انتهاء صلاحية طفايات الحريق', 'عدم عمل أنظمة الأمان', 'تلف في حزام الأمان'],
      typicalSeverity: 'high',
    },
  ];

  // Image upload states
  public imageUploadStates: { [key: string]: { isUploading: boolean; preview: string | null } } =
    {};

  // Progress tracking
  public getCompletionPercentage(): number {
    const totalFields = this.getTotalFieldsCount();
    const filledFields = this.getFilledFieldsCount();
    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  }

  public getFilledFieldsCount(): number {
    let count = 0;
    this.carData.conditions.forEach((condition) => {
      if (condition.name) count++;
      if (condition.part) count++;
      if (condition.description) count++;
      if (condition.image) count++;
    });
    return count;
  }

  public getTotalFieldsCount(): number {
    return this.carData.conditions.length * 4; // 4 fields per condition
  }

  constructor(private fb: FormBuilder) {
    this.initializeForm();
    this.initializeImageUploadStates();
  }

  ngOnInit() {
    if (this.initialData && this.initialData.conditions) {
      this.carData.conditions = [...this.initialData.conditions];
    }

    // Ensure at least one condition block exists
    if (this.carData.conditions.length === 0) {
      this.addConditionBlock();
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
    this.part4Form = this.fb.group({
      conditions: this.fb.array([]),
    });

    // Debounced form validation for better performance
    const debouncedValidation = this.debouncer.debounce(() => {
      if (!this.isDestroyed) {
        this.validateForm();
        this.emitDataChange();
      }
    }, 300);

    this.part4Form.valueChanges.subscribe(() => {
      if (!this.isDestroyed) {
        this.updateSmartSuggestions();
        debouncedValidation();
      }
    });
  }

  private initializeImageUploadStates(): void {
    this.carData.conditions.forEach((_, index) => {
      this.imageUploadStates[index] = {
        isUploading: false,
        preview: null,
      };
    });
  }

  private integrateWithParentForm(): void {
    if (this.parentForm) {
      // Add conditions form array to parent form if it doesn't exist
      if (!this.parentForm.get('conditions')) {
        this.parentForm.addControl('conditions', this.part4Form.get('conditions')!);
      }
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

    // Validate each condition
    this.carData.conditions.forEach((condition, index) => {
      const prefix = `conditions[${index}]`;
      this.validateCondition(condition, index, prefix);
    });

    // Cross-condition validation
    this.validateConditionDependencies();

    // Emit form validity
    const isValid = Object.keys(this.validationErrors).length === 0 && this.part4Form.valid;
    this.formValidityChange.emit(isValid);
  }

  private validateCondition(condition: CarCondition, index: number, prefix: string): void {
    // Validate condition name
    if (!condition.name || condition.name.trim() === '') {
      this.validationErrors[`${prefix}.name`] = 'نوع الحالة مطلوب';
    }

    // Validate condition part
    if (!condition.part || condition.part.trim() === '') {
      this.validationErrors[`${prefix}.part`] = 'اسم القطعة مطلوب';
    }

    // Validate description length
    if (condition.description && condition.description.length < 10) {
      this.validationErrors[`${prefix}.description`] = 'الوصف يجب أن يكون على الأقل 10 أحرف';
    }

    // Validate image if condition is marked as high severity
    const conditionType = this.conditionTypes.find((ct) => ct.value === condition.name);
    if (conditionType?.typicalSeverity === 'high' && !condition.image) {
      this.validationErrors[`${prefix}.image`] = 'الصورة مطلوبة للحالات عالية الخطورة';
    }
  }

  private validateConditionDependencies(): void {
    // Check for duplicate condition types
    const conditionTypes = this.carData.conditions.map((c) => c.name).filter(Boolean);
    const duplicates = conditionTypes.filter(
      (type, index) => conditionTypes.indexOf(type) !== index
    );

    if (duplicates.length > 0) {
      this.validationErrors['duplicate_types'] = 'لا يمكن تكرار نفس نوع الحالة';
    }

    // Check for mechanical conditions without proper description
    const hasMechanicalConditions = this.carData.conditions.some((c) => c.name === 'Mechanical');
    if (hasMechanicalConditions) {
      const mechanicalConditions = this.carData.conditions.filter((c) => c.name === 'Mechanical');
      const hasProperDescription = mechanicalConditions.some(
        (c) => c.description && c.description.length > 20
      );

      if (!hasProperDescription) {
        this.validationErrors['mechanical_description'] = 'الحالات الميكانيكية تحتاج وصف مفصل';
      }
    }
  }

  private updateSmartSuggestions(): void {
    if (this.isDestroyed) return;

    this.memoizer.clear();

    // Smart condition suggestions based on existing conditions
    this.smartSuggestions.suggestedConditions = this.memoizer.get(
      `suggested_conditions_${JSON.stringify(this.carData.conditions.map((c) => c.name))}`,
      () => this.calculateSuggestedConditions()
    );

    // Common issues based on condition types
    this.smartSuggestions.commonIssues = this.generateCommonIssues();

    // Validation hints
    this.smartSuggestions.validationHints = this.generateValidationHints();

    // Severity distribution
    this.smartSuggestions.severityDistribution = this.calculateSeverityDistribution();
  }

  private calculateSuggestedConditions(): CarCondition[] {
    const existingTypes = this.carData.conditions.map((c) => c.name);
    const missingCriticalTypes = ['Mechanical', 'Safety'].filter(
      (type) => !existingTypes.includes(type)
    );

    return missingCriticalTypes.map((type) => ({
      id: this.generateId(),
      name: type,
      part: '',
      description: '',
      image: null,
      imagePreview: null,
    }));
  }

  private generateCommonIssues(): string[] {
    const issues: string[] = [];
    const conditionTypes = this.carData.conditions.map((c) => c.name);

    if (conditionTypes.includes('Mechanical')) {
      issues.push('فحص مستوى زيت المحرك والتأكد من عدم وجود تسريبات');
    }
    if (conditionTypes.includes('Exterior')) {
      issues.push('فحص الهيكل الخارجي للتأكد من عدم وجود تلف في الطلاء');
    }
    if (conditionTypes.includes('Electrical')) {
      issues.push('اختبار جميع الأنظمة الكهربائية والأضواء');
    }

    return issues;
  }

  private generateValidationHints(): string[] {
    const hints: string[] = [];

    if (this.carData.conditions.length === 0) {
      hints.push('يُنصح بإضافة حالة واحدة على الأقل');
    }

    const highSeverityCount = this.carData.conditions.filter((condition) => {
      const conditionType = this.conditionTypes.find((ct) => ct.value === condition.name);
      return conditionType?.typicalSeverity === 'high';
    }).length;

    if (highSeverityCount > 2) {
      hints.push('عدد كبير من الحالات عالية الخطورة - يُنصح بفحص شامل');
    }

    if (this.carData.conditions.length > 5) {
      hints.push('عدد كبير من الحالات - تأكد من تنظيم الوصف');
    }

    return hints;
  }

  private calculateSeverityDistribution(): { low: number; medium: number; high: number } {
    const distribution = { low: 0, medium: 0, high: 0 };

    this.carData.conditions.forEach((condition) => {
      const conditionType = this.conditionTypes.find((ct) => ct.value === condition.name);
      if (conditionType) {
        distribution[conditionType.typicalSeverity]++;
      }
    });

    return distribution;
  }

  // Condition management methods
  public addConditionBlock(): void {
    const newCondition: CarCondition = {
      id: this.generateId(),
      name: '',
      part: '',
      description: '',
      image: null,
      imagePreview: null,
    };

    this.carData.conditions.push(newCondition);
    this.initializeImageUploadStates();

    // Add to form array
    const conditionsArray = this.part4Form.get('conditions') as FormArray;
    const conditionGroup = this.fb.group({
      name: ['', [Validators.required]],
      part: ['', [Validators.required]],
      description: ['', [Validators.minLength(10)]],
      image: [null],
    });

    conditionsArray.push(conditionGroup);

    this.updateSmartSuggestions();
    this.debouncedValidation();
    this.emitDataChange();

    // Focus on the new condition's name field
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      setTimeout(() => {
        const nameInput = document.querySelector(
          `#condition-name-${newCondition.id}`
        ) as HTMLInputElement;
        if (nameInput) {
          nameInput.focus();
        }
      }, 100);
    }
  }

  public removeConditionBlock(index: number): void {
    if (this.carData.conditions.length <= 1) {
      this.validationErrors['minimum_conditions'] = 'يجب أن تكون هناك حالة واحدة على الأقل';
      return;
    }

    this.carData.conditions.splice(index, 1);

    // Remove from form array
    const conditionsArray = this.part4Form.get('conditions') as FormArray;
    conditionsArray.removeAt(index);

    // Clean up image upload states
    delete this.imageUploadStates[index];

    this.updateSmartSuggestions();
    this.debouncedValidation();
    this.emitDataChange();
  }

  public onConditionNameChange(value: string, index: number): void {
    this.carData.conditions[index].name = value;
    const conditionsArray = this.part4Form.get('conditions') as FormArray;
    conditionsArray.at(index).get('name')?.setValue(value);

    this.updateSmartSuggestions();
    this.debouncedValidation();
    this.emitDataChange();
  }

  public onConditionPartChange(value: string, index: number): void {
    this.carData.conditions[index].part = value;
    const conditionsArray = this.part4Form.get('conditions') as FormArray;
    conditionsArray.at(index).get('part')?.setValue(value);

    this.debouncedValidation();
    this.emitDataChange();
  }

  public onConditionDescriptionChange(value: string, index: number): void {
    this.carData.conditions[index].description = value;
    const conditionsArray = this.part4Form.get('conditions') as FormArray;
    conditionsArray.at(index).get('description')?.setValue(value);

    this.debouncedValidation();
    this.emitDataChange();
  }

  public onImageSelected(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.validationErrors[`conditions[${index}].image`] = 'يرجى اختيار ملف صورة صحيح';
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.validationErrors[`conditions[${index}].image`] =
        'حجم الصورة يجب أن يكون أقل من 5 ميجابايت';
      return;
    }

    this.isProcessingImage = true;
    this.imageUploadStates[index].isUploading = true;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!this.isDestroyed) {
        const preview = e.target?.result as string;
        this.carData.conditions[index].image = file;
        this.carData.conditions[index].imagePreview = preview;
        this.imageUploadStates[index].preview = preview;
        this.imageUploadStates[index].isUploading = false;
        this.isProcessingImage = false;

        const conditionsArray = this.part4Form.get('conditions') as FormArray;
        conditionsArray.at(index).get('image')?.setValue(file);

        this.debouncedValidation();
        this.emitDataChange();
      }
    };

    reader.readAsDataURL(file);
  }

  public removeImage(index: number): void {
    this.carData.conditions[index].image = null;
    this.carData.conditions[index].imagePreview = null;
    this.imageUploadStates[index].preview = null;

    const conditionsArray = this.part4Form.get('conditions') as FormArray;
    conditionsArray.at(index).get('image')?.setValue(null);

    this.debouncedValidation();
    this.emitDataChange();
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getConditionsArray(): FormArray {
    return this.part4Form.get('conditions') as FormArray;
  }

  public getConditionTypeIcon(conditionType: string): string {
    const condition = this.conditionTypes.find((ct) => ct.value === conditionType);
    return condition ? condition.icon : 'fas fa-exclamation-circle text-gray-500';
  }

  public getConditionTypeDescription(conditionType: string): string {
    const condition = this.conditionTypes.find((ct) => ct.value === conditionType);
    return condition ? condition.description : '';
  }

  public getConditionSeverity(conditionType: string): string {
    const condition = this.conditionTypes.find((ct) => ct.value === conditionType);
    return condition ? condition.typicalSeverity : 'medium';
  }

  public getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'high':
        return 'fas fa-exclamation-triangle text-red-500';
      case 'medium':
        return 'fas fa-exclamation-circle text-yellow-500';
      case 'low':
        return 'fas fa-info-circle text-green-500';
      default:
        return 'fas fa-circle text-gray-500';
    }
  }

  public getSeverityText(severity: string): string {
    switch (severity) {
      case 'high':
        return 'عالية';
      case 'medium':
        return 'متوسطة';
      case 'low':
        return 'منخفضة';
      default:
        return 'غير محددة';
    }
  }

  public getCommonIssues(conditionType: string): string[] {
    const condition = this.conditionTypes.find((ct) => ct.value === conditionType);
    return condition ? condition.commonIssues : [];
  }

  // Validation utility methods
  public getFieldError(fieldPath: string): string {
    return this.validationErrors[fieldPath] || '';
  }

  public hasValidationErrors(): boolean {
    return Object.keys(this.validationErrors).length > 0;
  }

  public getValidationErrors(): string[] {
    return Object.values(this.validationErrors);
  }

  public isFormValid(): boolean {
    return !this.hasValidationErrors() && this.part4Form.valid;
  }

  // Enhanced event handlers
  public onFieldFocus(fieldName: string): void {
    this.isFieldFocused = true;
    this.focusedField = fieldName;
  }

  public onFieldBlur(): void {
    this.isFieldFocused = false;
    this.focusedField = '';

    // Check if we're in browser environment (not SSR)
    if (typeof window !== 'undefined' && typeof setTimeout !== 'undefined') {
      setTimeout(() => {
        this.debouncedValidation();
      }, 100);
    } else {
      // Execute immediately in SSR environment
      this.debouncedValidation();
    }
  }

  // Keyboard navigation
  private addKeyboardNavigation(): void {
    // Check if we're in browser environment (not SSR)
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const inputs = document.querySelectorAll(
        '.part4-field input, .part4-field select, .part4-field textarea'
      );
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
    }, 0);
  }

  // Auto-save functionality
  private autoSave = this.debouncer.debounce(() => {
    // Check if we're in browser environment (not SSR)
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

    const dataToSave = {
      ...this.carData,
      timestamp: Date.now(),
      formVersion: '4.0',
    };

    try {
      localStorage.setItem('part4_autosave', JSON.stringify(dataToSave));
     } catch (error) {
     }
  }, 2000);

  public triggerAutoSave(): void {
    this.autoSave();
  }

  public loadAutoSavedData(): void {
    // Check if we're in browser environment (not SSR)
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

    try {
      const savedData = localStorage.getItem('part4_autosave');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const age = Date.now() - parsed.timestamp;
        if (age < 24 * 60 * 60 * 1000) {
          this.setData(parsed);
         }
      }
    } catch (error) {
     }
  }

  // Public methods for parent component interaction
  public setData(data: Partial<CarPart4Data>): void {
    if (data.conditions) {
      this.carData.conditions = [...data.conditions];
      this.initializeImageUploadStates();

      const conditionsArray = this.getConditionsArray();
      while (conditionsArray.length > 0) {
        conditionsArray.removeAt(0);
      }

      data.conditions.forEach((condition) => {
        const conditionGroup = this.fb.group({
          name: [condition.name, [Validators.required]],
          part: [condition.part, [Validators.required]],
          description: [condition.description, [Validators.minLength(10)]],
          image: [condition.image],
        });
        conditionsArray.push(conditionGroup);
      });
    }

    this.updateSmartSuggestions();
    this.debouncedValidation();
    this.emitDataChange();
  }

  public getData(): CarPart4Data {
    return { ...this.carData };
  }

  public resetForm(): void {
    this.carData.conditions = [];
    const conditionsArray = this.getConditionsArray();
    while (conditionsArray.length > 0) {
      conditionsArray.removeAt(0);
    }

    this.validationErrors = {};
    this.smartSuggestions = {
      suggestedConditions: [],
      commonIssues: [],
      validationHints: [],
      severityDistribution: { low: 0, medium: 0, high: 0 },
    };

    this.memoizer.clear();
    this.addConditionBlock(); // Add at least one condition
    this.debouncedValidation();
    this.emitDataChange();
  }

  public saveAndContinue(): void {
    // Mark all fields as touched to show validation errors
    const conditionsArray = this.getConditionsArray();
    conditionsArray.controls.forEach((control) => {
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((key) => {
          control.get(key)?.markAsTouched();
        });
      }
    });

    if (this.isFormValid()) {
      this.saveAndContinueRequested.emit();
    } else {
      this.debouncedValidation();
    }
  }

  // Debounced validation method
  private debouncedValidation = this.debouncer.debounce(() => {
    this.validateForm();
    this.emitDataChange();
  }, 200);

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

  public applySuggestedConditions(): void {
    this.smartSuggestions.suggestedConditions.forEach((suggestedCondition) => {
      const newCondition: CarCondition = {
        ...suggestedCondition,
        id: this.generateId(),
      };
      this.carData.conditions.push(newCondition);
    });

    this.updateSmartSuggestions();
    this.debouncedValidation();
    this.emitDataChange();
  }

  // Smart condition type suggestions based on car data
  public getSmartConditionTypeSuggestions(): ConditionType[] {
    const existingTypes = this.carData.conditions.map((c) => c.name);
    return this.conditionTypes.filter((ct) => !existingTypes.includes(ct.value));
  }
}
