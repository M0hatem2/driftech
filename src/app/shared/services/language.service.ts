import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<Language>('en');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeLanguage();
  }

  private initializeLanguage() {
    // Always default to 'en' for LTR direction
    this.setLanguage('en');
  }

  get currentLanguage$(): Observable<Language> {
    return this.currentLanguageSubject.asObservable();
  }

  get currentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  setLanguage(language: Language): void {
    this.currentLanguageSubject.next(language);

    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('preferred-language', language);

        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

        if (language === 'ar') {
          document.body.classList.add('rtl');
        } else {
          document.body.classList.remove('rtl');
        }
      } catch (error) {
       }
    }
  }

  toggleLanguage(): void {
    const currentLang = this.currentLanguageSubject.value;
    const newLanguage: Language = currentLang === 'en' ? 'ar' : 'en';
    this.setLanguage(newLanguage);
  }

  get isRTL(): boolean {
    return this.currentLanguage === 'ar';
  }
}
