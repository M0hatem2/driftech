import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-support',
  standalone: false,
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent {
  supportForm: FormGroup;
  selectedCategory = '';
  submitted = false;

  supportCategories = [
    {
      id: 'general',
      title: 'استفسار عام',
      icon: 'fas fa-question-circle',
      color: 'blue',
      description: 'أسئلة حول الخدمات والسياسات'
    },
    {
      id: 'account',
      title: 'حساب المستخدم',
      icon: 'fas fa-user-cog',
      color: 'green',
      description: 'مشاكل في تسجيل الدخول أو الملف الشخصي'
    },
    {
      id: 'finance',
      title: 'التمويل',
      icon: 'fas fa-money-bill-wave',
      color: 'purple',
      description: 'أسئلة حول القروض والتمويل'
    },
    {
      id: 'technical',
      title: 'دعم تقني',
      icon: 'fas fa-tools',
      color: 'orange',
      description: 'مشاكل تقنية في الموقع أو التطبيق'
    },
    {
      id: 'complaint',
      title: 'شكوى',
      icon: 'fas fa-exclamation-triangle',
      color: 'red',
      description: 'تقديم شكوى أو اقتراح تحسين'
    }
  ];

  contactMethods = [
    {
      title: 'الهاتف',
      value: '+201234567890',
      icon: 'fas fa-phone',
      color: 'blue',
      available: 'الأحد - الخميس، 9 صباحاً - 6 مساءً'
    },
    {
      title: 'البريد الإلكتروني',
      value: 'support@driftech.com',
      icon: 'fas fa-envelope',
      color: 'green',
      available: 'رد خلال 24 ساعة'
    },
    {
      title: 'الدردشة المباشرة',
      value: 'متاح الآن',
      icon: 'fas fa-comments',
      color: 'purple',
      available: 'متاح 24/7'
    },
    {
      title: 'واتساب',
      value: '+201234567890',
      icon: 'fab fa-whatsapp',
      color: 'green',
      available: 'متاح 24/7'
    }
  ];

  faqItems = [
    {
      question: 'كيف يمكنني تغيير كلمة المرور؟',
      answer: 'يمكنك تغيير كلمة المرور من إعدادات الحساب أو استخدام خيار "نسيت كلمة المرور" في صفحة تسجيل الدخول.'
    },
    {
      question: 'متى يتم تحديث حالة القرض؟',
      answer: 'يتم تحديث حالة القرض يومياً في تمام الساعة 6 صباحاً. يمكنك أيضاً تحديث الصفحة يدوياً للحصول على آخر التحديثات.'
    },
    {
      question: 'كيف يمكنني تحميل كشف حسابي؟',
      answer: 'يمكنك تحميل كشف حسابك من قسم "حالة التمويل" باستخدام زر "تحميل كشف حساب" في آخر الشهر.'
    },
    {
      question: 'ما هي طرق الدفع المتاحة؟',
      answer: 'نقبل الدفع عبر البطاقات الائتمانية، التحويل البنكي، محافظ إلكترونية، والدفع النقدي في فروعنا.'
    },
    {
      question: 'كيف أتابع طلب التمويل؟',
      answer: 'يمكنك متابعة طلبك من خلال حسابك في قسم "طلباتي" أو التواصل مع خدمة العملاء للحصول على تحديثات.'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.supportForm = this.fb.group({
      category: ['', Validators.required],
      subject: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      priority: ['medium', Validators.required],
      attachments: ['']
    });
  }

  onCategorySelect(categoryId: string) {
    this.selectedCategory = categoryId;
    this.supportForm.patchValue({ category: categoryId });
  }

  onSubmit() {
    this.submitted = true;
    if (this.supportForm.valid) {
       // Here you would typically send the form data to your backend
      this.showSuccessMessage();
      this.resetForm();
    }
  }

  private showSuccessMessage() {
    // Show success toast/alert
    alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
  }

  private resetForm() {
    this.supportForm.reset();
    this.selectedCategory = '';
    this.submitted = false;
  }
}