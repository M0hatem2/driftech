import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly STORAGE_KEY = 'app_language';

  constructor(private translate: TranslateService) {
    this.initLanguage();
  }

  // 🟢 تحميل اللغة المحفوظة أو لغة المتصفح
  private initLanguage(): void {
    const savedLang = localStorage.getItem(this.STORAGE_KEY);

    if (savedLang) {
      this.setLanguage(savedLang);
    } else {
      this.detectBrowserLanguage();
    }
  }

  // 🟢 تغيير اللغة + حفظها + تحديث الاتجاه
  setLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
    this.updateDocumentDirection(lang);
  }

  // 🟢 الحصول على اللغة الحالية
  getCurrentLang(): string {
    return (
      localStorage.getItem(this.STORAGE_KEY) ||
      this.translate.currentLang ||
      this.translate.defaultLang ||
      'en'
    );
  }

  // 🟢 تبديل اللغة
  toggleLanguage(): void {
    const currentLang = this.getCurrentLang();
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }

  // 🟢 اكتشاف لغة المتصفح
  detectBrowserLanguage(): void {
    const browserLang = this.translate.getBrowserLang();
    const defaultLang =
      browserLang && ['en', 'ar'].includes(browserLang) ? browserLang : 'en';

    this.setLanguage(defaultLang);
  }

  // 🟢 تحديث اتجاه الصفحة
  private updateDocumentDirection(lang: string): void {
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = lang;
  }
}
