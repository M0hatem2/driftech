import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HowItWorks } from '../../../features/client/home/components/how-it-works/how-it-works';
 
@Component({
  selector: 'app-account-how-it-works',
  imports: [CommonModule, HowItWorks],
  standalone: true,
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss'],
})
export class HowItWorksComponent {
  steps = [
    {
      number: 1,
      title: 'التسجيل وإدخال البيانات',
      description: 'قم بإنشاء حساب جديد وأدخل بياناتك الشخصية والمالية الأساسية',
      icon: 'fas fa-user-plus',
      color: 'blue',
      details: [
        'إنشاء حساب شخصي',
        'إدخال البيانات الأساسية',
        'تحميل الوثائق المطلوبة',
        'التحقق من الهوية',
      ],
    },
    {
      number: 2,
      title: 'تقييم الائتمان',
      description: 'نقوم بتقييم قدرتك الائتمانية وملفاتك المالية للحصول على أفضل عرض',
      icon: 'fas fa-chart-bar',
      color: 'green',
      details: [
        'تحليل السجل الائتماني',
        'تقييم الدخل والمصروفات',
        'حساب نسبة الدين إلى الدخل',
        'تحديد المبلغ والفترة المناسبة',
      ],
    },
    {
      number: 3,
      title: 'الموافقة والتمويل',
      description: 'بعد الموافقة على الطلب، يتم تحويل المبلغ مباشرة إلى حسابك',
      icon: 'fas fa-check-circle',
      color: 'purple',
      details: ['مراجعة نهائية للطلب', 'إشعار بالموافقة', 'توقيع عقد التمويل', 'تحويل المبلغ'],
    },
    {
      number: 4,
      title: 'الدفع الشهري',
      description: 'ادفع أقساطك الشهرية بسهولة من خلال موقعنا أو التطبيق المحمول',
      icon: 'fas fa-credit-card',
      color: 'orange',
      details: ['جدولة السداد', 'دفع إلكتروني آمن', 'تتبع المدفوعات', 'إشعارات الدفع'],
    },
  ];

  features = [
    {
      title: 'معدلات فائدة تنافسية',
      description: 'نوفر لك أفضل المعدلات في السوق',
      icon: 'fas fa-percentage',
      color: 'blue',
    },
    {
      title: 'موافقة سريعة',
      description: 'احصل على الموافقة في أقل من 24 ساعة',
      icon: 'fas fa-clock',
      color: 'green',
    },
    {
      title: 'مرونة في السداد',
      description: 'خيارات متعددة ومرنة للسداد',
      icon: 'fas fa-calendar-check',
      color: 'purple',
    },
    {
      title: 'دعم عملاء متخصص',
      description: 'فريق دعم متاح لمساعدتك دائماً',
      icon: 'fas fa-headset',
      color: 'orange',
    },
  ];
}
