import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

export interface CarPart3Data {
  price: number | null;
  discount: number | null;
  monthly_installment: number | null;
  down_payment: number | null;
  trim: string;
  images: File[];
}

export interface Part3ValidationErrors {
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

interface FinancingCalculation {
  totalPrice: number;
  discountedPrice: number;
  downPaymentAmount: number;
  financingAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  savingsFromDiscount: number;
}

interface ImageUploadResult {
  file: File;
  preview: string;
  size: string;
  uploadProgress: number;
  isUploading: boolean;
  error?: string;
  id: string;
}

@Component({
  selector: 'app-part3',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './part3.html',
  styleUrl: './part3.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Part3 implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() initialData: Partial<CarPart3Data> = {};
  @Input() parentForm: FormGroup | null = null;
  @Input() maxFileSize: number = 5 * 1024 * 1024; // 5MB default
  @Input() maxImages: number = 10;
  @Output() dataChange = new EventEmitter<CarPart3Data>();
  @Output() formValidityChange = new EventEmitter<boolean>();
  @Output() financingCalculated = new EventEmitter<FinancingCalculation>();
  @Output() imageUploadProgress = new EventEmitter<{ completed: number; total: number }>();

  public carData: CarPart3Data = {
    price: null,
    discount: null,
    monthly_installment: null,
    down_payment: null,
    trim: '',
    images: []
  };

  public part3Form!: FormGroup;
  public imageUploadResults: ImageUploadResult[] = [];
  private validationErrors: Part3ValidationErrors = {};
  private isDestroyed = false;
  
  // Performance optimization instances
  private debouncer = new Debouncer();
  private memoizer = new Memoizer();
  
  // Loading states for better UX
  public isCalculatingFinancing = false;
  public isFieldFocused = false;
  public focusedField = '';
  public isUploadingImages = false;
  
  // Financing calculation results
  public financingCalculation: FinancingCalculation | null = null;
  public smartSuggestions = {
    optimalDownPaymentPercent: null as number | null,
    suggestedMonthlyPayment: null as number | null,
    discountSavings: null as number | null,
    validationHints: [] as string[]
  };

  // Enhanced trim options with descriptions and pricing tiers
  public trims = [
    { value: '1', label: 'Base', description: 'الإصدار الأساسي', pricingTier: 'economy', features: 'المميزات الأساسية' },
    { value: '2', label: 'LE', description: 'إصدار محسّن', pricingTier: 'standard', features: 'مميزات إضافية' },
    { value: '3', label: 'SE', description: 'إصدار رياضي', pricingTier: 'sport', features: 'أداء رياضي' },
    { value: '4', label: 'XLE', description: 'إصدار فاخر', pricingTier: 'luxury', features: 'تجهيزات فاخرة' },
    { value: '5', label: 'XSE', description: 'إصدار رياضي فاخر', pricingTier: 'premium', features: 'أداء فاخر' },
    { value: '6', label: 'Sport', description: 'نسخة رياضية', pricingTier: 'sport', features: 'تحسينات رياضية' },
    { value: '7', label: 'Limited', description: 'نسخة محدودة', pricingTier: 'premium', features: 'تجهيزات حصرية' },
    { value: '8', label: 'Touring', description: 'نسخة سياحية', pricingTier: 'luxury', features: 'راحة السفر' },
    { value: '9', label: 'EX', description: 'إصدار محسّن', pricingTier: 'standard', features: 'أداء متقدم' },
    { value: '10', label: 'LX', description: 'إصدار مريح', pricingTier: 'economy', features: 'استهلاك اقتصادي' },
    { value: '11', label: 'Premium', description: 'إصدار مميز', pricingTier: 'premium', features: 'تجهيزات متميزة' },
    { value: '12', label: 'Platinum', description: 'إصدار بلاتيني', pricingTier: 'luxury', features: 'أعلى مستويات الفخامة' },
    { value: '13', label: 'SL', description: 'نسخة فاخرة', pricingTier: 'luxury', features: 'تقنيات متقدمة' },
    { value: '14', label: 'SR', description: 'نسخة رياضية', pricingTier: 'sport', features: 'أداء ديناميكي' },
    { value: '15', label: 'Titanium', description: 'إصدار تيتانيوم', pricingTier: 'premium', features: 'متانة وقوة' },
    { value: '16', label: 'Lariat', description: 'نسخة عملية', pricingTier: 'standard', features: 'قدرة على العمل' },
    { value: '17', label: 'Z71', description: 'نسخة للطرق الوعرة', pricingTier: 'sport', features: 'قدرة على الطرق الوعرة' },
    { value: '18', label: 'Denali', description: 'نسخة دنالي', pricingTier: 'luxury', features: 'الفخامة والأداء' },
    { value: '19', label: 'TRD Off-Road', description: 'نسخة تورد للطرق الوعرة', pricingTier: 'sport', features: 'أداء خارجي متقدم' },
    { value: '20', label: 'Black Edition', description: 'النسخة السوداء', pricingTier: 'premium', features: 'تصميم حصري' }
  ];

  // Drag and drop state
  public isDragOver = false;
  public dragCounter = 0;

  // File type validation
  public acceptedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  public imageUploadErrors: string[] = [];

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
    this.cleanupImagePreviews();
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
    this.part3Form = this.fb.group({
      price: ['', [Validators.required, Validators.min(1000)]],
      discount: ['', [Validators.min(0), Validators.max(50)]],
      monthly_installment: ['', [Validators.min(100)]],
      down_payment: ['', [Validators.min(0)]],
      trim: ['', [Validators.required]],
      images: [null]
    });

    // Debounced form validation for better performance
    const debouncedValidation = this.debouncer.debounce(() => {
      if (!this.isDestroyed) {
        this.updateCarDataFromForm();
        this.validateForm();
        this.emitDataChange();
      }
    }, 300);

    this.part3Form.valueChanges.subscribe(() => {
      if (!this.isDestroyed) {
        this.updateSmartSuggestions();
        debouncedValidation();
        this.calculateFinancing();
      }
    });
  }

  private integrateWithParentForm(): void {
    if (this.parentForm) {
      Object.keys(this.part3Form.controls).forEach(key => {
        if (!this.parentForm!.get(key)) {
          this.parentForm!.addControl(key, this.part3Form.get(key)!);
        }
      });
    }
  }

  private updateCarDataFromForm(): void {
    const values = this.part3Form.value;
    this.carData.price = values.price;
    this.carData.discount = values.discount;
    this.carData.monthly_installment = values.monthly_installment;
    this.carData.down_payment = values.down_payment;
    this.carData.trim = values.trim;
    // Images are updated via onFileChange
  }

  private emitDataChange(): void {
    if (!this.isDestroyed) {
      this.dataChange.emit(this.carData);
    }
  }

  private validateForm(): void {
    if (this.isDestroyed) return;

    this.validationErrors = {};
    this.imageUploadErrors = [];
    
    // Validate individual fields
    const formGroup = this.part3Form;
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control?.errors && control?.touched) {
        this.setValidationError(key, control);
      }
    });

    // Cross-field validation
    this.validateFinancingLogic();
    this.validateImageUpload();
    
    // Emit form validity
    const isValid = Object.keys(this.validationErrors).length === 0 && 
                   this.part3Form.valid && 
                   this.imageUploadErrors.length === 0;
    this.formValidityChange.emit(isValid);
  }

  private setValidationError(fieldName: string, control: AbstractControl): void {
    const errors = control.errors;
    if (!errors) return;

    let errorMessage = '';
    
    if (errors['required']) {
      errorMessage = 'هذا الحقل مطلوب';
    } else if (errors['min']) {
      if (fieldName === 'price') {
        errorMessage = `السعر يجب أن يكون أكبر من ${errors['min'].min.toLocaleString()} ريال`;
      } else if (fieldName === 'down_payment') {
        errorMessage = `الدفعة الأولى يجب أن تكون أكبر من ${errors['min'].min.toLocaleString()} ريال`;
      } else {
        errorMessage = `القيمة يجب أن تكون أكبر من ${errors['min'].min}`;
      }
    } else if (errors['max']) {
      errorMessage = `الخصم لا يجب أن يتجاوز ${errors['max'].max}%`;
    }

    this.validationErrors[fieldName] = errorMessage;
  }

  private validateFinancingLogic(): void {
    const { price, discount, monthly_installment, down_payment } = this.carData;
    
    if (price && discount && discount > 0) {
      const discountedPrice = price * (1 - discount / 100);
      
      if (down_payment && down_payment > discountedPrice) {
        this.validationErrors['down_payment'] = 'الدفعة الأولى لا يجب أن تتجاوز السعر بعد الخصم';
      }
      
      if (monthly_installment && down_payment && price) {
        const financingAmount = discountedPrice - down_payment;
        if (monthly_installment > financingAmount * 0.1) {
          this.validationErrors['monthly_installment'] = 'القسط الشهري يبدو مرتفعاً جداً';
        }
      }
    }
  }

  private validateImageUpload(): void {
    if (this.imageUploadResults.length > this.maxImages) {
      this.imageUploadErrors.push(`يمكن رفع ${this.maxImages} صور كحد أقصى`);
    }
    
    // Check for files over size limit
    const oversizedFiles = this.imageUploadResults.filter(img => img.file.size > this.maxFileSize);
    if (oversizedFiles.length > 0) {
      this.imageUploadErrors.push(`حجم بعض الصور يتجاوز ${this.maxFileSize / (1024 * 1024)}MB`);
    }
  }

  private updateSmartSuggestions(): void {
    if (this.isDestroyed) return;

    this.memoizer.clear();
    
    // Calculate smart financing suggestions
    if (this.carData.price) {
      this.smartSuggestions.optimalDownPaymentPercent = this.memoizer.get(
        `down_payment_${this.carData.price}`,
        () => this.calculateOptimalDownPayment()
      );

      this.smartSuggestions.suggestedMonthlyPayment = this.memoizer.get(
        `monthly_payment_${this.carData.price}`,
        () => this.calculateSuggestedMonthlyPayment()
      );

      this.smartSuggestions.discountSavings = this.memoizer.get(
        `discount_savings_${this.carData.discount}`,
        () => this.calculateDiscountSavings()
      );
    }

    // Generate validation hints
    this.smartSuggestions.validationHints = this.generateValidationHints();
  }

  private calculateOptimalDownPayment(): number {
    if (!this.carData.price) return 0;
    
    // Recommend 20-30% down payment based on price
    if (this.carData.price > 200000) return 30;
    if (this.carData.price > 100000) return 25;
    return 20;
  }

  private calculateSuggestedMonthlyPayment(): number {
    if (!this.carData.price || !this.carData.down_payment) return 0;
    
    const financingAmount = this.carData.price - (this.carData.down_payment || 0);
    const months = 60; // 5 years
    const monthlyRate = 0.05 / 12; // 5% annual interest
    
    if (monthlyRate > 0) {
      return (financingAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
             (Math.pow(1 + monthlyRate, months) - 1);
    }
    
    return financingAmount / months;
  }

  private calculateDiscountSavings(): number {
    if (!this.carData.price || !this.carData.discount) return 0;
    return (this.carData.price * this.carData.discount) / 100;
  }

  private generateValidationHints(): string[] {
    const hints: string[] = [];

    if (this.carData.price && this.carData.price < 50000) {
      hints.push('السعر يبدو منخفضاً جداً، يرجى التحقق من صحته');
    }

    if (this.carData.discount && this.carData.discount > 30) {
      hints.push('الخصم مرتفع جداً، يرجى التحقق من صحة النسبة');
    }

    if (this.carData.monthly_installment && this.carData.down_payment) {
      const ratio = this.carData.monthly_installment / this.carData.down_payment;
      if (ratio > 0.5) {
        hints.push('نسبة القسط إلى الدفعة الأولى مرتفعة، قد تحتاج إعادة تقييم');
      }
    }

    if (this.carData.trim) {
      const trim = this.trims.find(t => t.value === this.carData.trim);
      if (trim) {
        hints.push(`نسخة ${trim.label} تشمل: ${trim.features}`);
      }
    }

    return hints;
  }

  private calculateFinancing(): void {
    this.isCalculatingFinancing = true;
    
    setTimeout(() => {
      const { price, discount, down_payment, monthly_installment } = this.carData;
      
      if (price) {
        const totalPrice = price;
        const discountedPrice = discount ? price * (1 - discount / 100) : price;
        const downPaymentAmount = down_payment || 0;
        const financingAmount = discountedPrice - downPaymentAmount;
        
        let calculatedMonthlyPayment = 0;
        let totalInterest = 0;
        let totalAmount = 0;
        
        if (monthly_installment && financingAmount > 0) {
          // Calculate backwards from monthly payment
          const months = 60; // 5 years
          calculatedMonthlyPayment = monthly_installment;
          totalAmount = monthly_installment * months;
          totalInterest = totalAmount - financingAmount;
        }
        
        this.financingCalculation = {
          totalPrice,
          discountedPrice,
          downPaymentAmount,
          financingAmount,
          monthlyPayment: calculatedMonthlyPayment,
          totalInterest,
          totalAmount,
          savingsFromDiscount: this.calculateDiscountSavings()
        };
        
        this.financingCalculated.emit(this.financingCalculation);
      }
      
      this.isCalculatingFinancing = false;
    }, 800);
  }

  // Enhanced file handling with drag and drop
  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter++;
    this.isDragOver = true;
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.isDragOver = false;
    }
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter = 0;
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileUpload(files);
    }
  }

  public onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.handleFileUpload(event.target.files);
    }
  }

  private handleFileUpload(files: FileList): void {
    this.isUploadingImages = true;
    const fileArray = Array.from(files);
    
    fileArray.forEach((file, index) => {
      this.processFileUpload(file, index);
    });
    
    this.emitDataChange();
    this.updateImageUploadProgress();
  }

  private processFileUpload(file: File, index: number): void {
    const uploadResult: ImageUploadResult = {
      file,
      preview: '',
      size: this.formatFileSize(file.size),
      uploadProgress: 0,
      isUploading: true,
      id: `img_${Date.now()}_${index}`
    };

    // Validate file type
    if (!this.acceptedImageTypes.includes(file.type)) {
      uploadResult.error = 'نوع الملف غير مدعوم';
      uploadResult.isUploading = false;
      this.imageUploadResults.push(uploadResult);
      return;
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      uploadResult.error = `حجم الملف يتجاوز ${this.maxFileSize / (1024 * 1024)}MB`;
      uploadResult.isUploading = false;
      this.imageUploadResults.push(uploadResult);
      return;
    }

    // Simulate upload progress and generate preview
    this.simulateFileUpload(uploadResult);
  }

  private simulateFileUpload(uploadResult: ImageUploadResult): void {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        uploadResult.uploadProgress = progress;
        uploadResult.isUploading = false;
        clearInterval(interval);
        this.emitDataChange();
      } else {
        uploadResult.uploadProgress = progress;
      }
    }, 100);

    // Generate preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      uploadResult.preview = e.target.result;
      // Add to carData
      this.carData.images.push(uploadResult.file);
    };
    reader.readAsDataURL(uploadResult.file);
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  public removeImage(index: number): void {
    this.imageUploadResults.splice(index, 1);
    this.carData.images.splice(index, 1);
    this.validateForm();
    this.emitDataChange();
    this.updateImageUploadProgress();
  }

  private updateImageUploadProgress(): void {
    const completed = this.imageUploadResults.filter(img => !img.isUploading).length;
    const total = this.imageUploadResults.length;
    this.imageUploadProgress.emit({ completed, total });
  }

  private cleanupImagePreviews(): void {
    this.imageUploadResults.forEach(result => {
      if (result.preview.startsWith('blob:')) {
        URL.revokeObjectURL(result.preview);
      }
    });
  }

  // Enhanced form event handlers
  public onPriceChange(value: number | null): void {
    this.carData.price = value;
    this.part3Form.get('price')?.setValue(value);
    this.updateSmartSuggestions();
    this.debouncedValidation();
    this.calculateFinancing();
    this.emitDataChange();
  }

  public onDiscountChange(value: number | null): void {
    this.carData.discount = value;
    this.part3Form.get('discount')?.setValue(value);
    this.updateSmartSuggestions();
    this.debouncedValidation();
    this.calculateFinancing();
    this.emitDataChange();
  }

  public onMonthlyInstallmentChange(value: number | null): void {
    this.carData.monthly_installment = value;
    this.part3Form.get('monthly_installment')?.setValue(value);
    this.debouncedValidation();
    this.calculateFinancing();
    this.emitDataChange();
  }

  public onDownPaymentChange(value: number | null): void {
    this.carData.down_payment = value;
    this.part3Form.get('down_payment')?.setValue(value);
    this.updateSmartSuggestions();
    this.debouncedValidation();
    this.calculateFinancing();
    this.emitDataChange();
  }

  public onTrimChange(value: string): void {
    this.carData.trim = value;
    this.part3Form.get('trim')?.setValue(value);
    this.updateSmartSuggestions();
    this.debouncedValidation();
    this.emitDataChange();
  }

  // Debounced validation method
  private debouncedValidation = this.debouncer.debounce(() => {
    this.validateForm();
    this.emitDataChange();
  }, 200);

  // Focus management
  public onFieldFocus(fieldName: string): void {
    this.isFieldFocused = true;
    this.focusedField = fieldName;
  }

  public onFieldBlur(): void {
    this.isFieldFocused = false;
    this.focusedField = '';
    
    setTimeout(() => {
      this.debouncedValidation();
    }, 100);
  }

  // Utility methods
  public getFieldError(fieldName: string): string {
    return this.validationErrors[fieldName] || '';
  }

  public hasFieldError(fieldName: string): boolean {
    return !!this.validationErrors[fieldName];
  }

  public hasValidationErrors(): boolean {
    return Object.keys(this.validationErrors).length > 0 || this.imageUploadErrors.length > 0;
  }

  public getValidationErrors(): string[] {
    return [...Object.values(this.validationErrors), ...this.imageUploadErrors];
  }

  public isFormValid(): boolean {
    return !this.hasValidationErrors() && this.part3Form.valid;
  }

  // Apply suggestions
  public applyOptimalDownPayment(): void {
    if (this.smartSuggestions.optimalDownPaymentPercent && this.carData.price) {
      const amount = (this.carData.price * this.smartSuggestions.optimalDownPaymentPercent) / 100;
      this.onDownPaymentChange(Math.round(amount));
    }
  }

  public applySuggestedMonthlyPayment(): void {
    if (this.smartSuggestions.suggestedMonthlyPayment) {
      this.onMonthlyInstallmentChange(Math.round(this.smartSuggestions.suggestedMonthlyPayment));
    }
  }

  // Enhanced keyboard navigation
  private addKeyboardNavigation(): void {
    // Check if we're in browser environment (not SSR)
    if (typeof window !== 'undefined' && document) {
      const inputs = document.querySelectorAll('.part3-field input, .part3-field select');
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

  // Public method to set data from parent
  public setData(data: Partial<CarPart3Data>): void {
    this.carData = { ...this.carData, ...data };
    
    Object.keys(data).forEach(key => {
      const value = data[key as keyof CarPart3Data];
      this.part3Form.get(key)?.setValue(value);
    });
    
    this.updateSmartSuggestions();
    this.debouncedValidation();
    this.emitDataChange();
  }

  // Public method to get current data
  public getData(): CarPart3Data {
    return { ...this.carData };
  }

  // Auto-save functionality
  private autoSave = this.debouncer.debounce(() => {
    const dataToSave = {
      ...this.carData,
      timestamp: Date.now(),
      formVersion: '3.0'
    };
    
    try {
      localStorage.setItem('part3_autosave', JSON.stringify(dataToSave));
      console.log('Auto-saved part3 data');
    } catch (error) {
      console.warn('Auto-save failed:', error);
    }
  }, 2000);

  // Call auto-save when data changes
  public triggerAutoSave(): void {
    this.autoSave();
  }

  // Load auto-saved data
  public loadAutoSavedData(): void {
    try {
      const savedData = localStorage.getItem('part3_autosave');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const age = Date.now() - parsed.timestamp;
        // Load data if it's less than 24 hours old
        if (age < 24 * 60 * 60 * 1000) {
          this.setData(parsed);
          console.log('Loaded auto-saved part3 data');
        }
      }
    } catch (error) {
      console.warn('Failed to load auto-saved data:', error);
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
    
    if (this.carData.price) count++;
    if (this.carData.discount !== null && this.carData.discount >= 0) count++;
    if (this.carData.monthly_installment) count++;
    if (this.carData.down_payment !== null && this.carData.down_payment >= 0) count++;
    if (this.carData.trim) count++;
    if (this.carData.images.length > 0) count++;
    
    return count;
  }

  public getTotalFieldsCount(): number {
    return 6; // Total number of fields in the form
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
