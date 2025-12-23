import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactUsService, ContactInfo } from './services/contact-us.service';
import { TranslateModule } from '@ngx-translate/core';
import { scrollFadeUp } from '../../../../../shared/animations/scroll.animations';
import { AnimateOnScrollDirective } from '../../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-get-in-touch',
  imports: [CommonModule, TranslateModule, AnimateOnScrollDirective],
  templateUrl: './get-in-touch.html',
  styleUrl: './get-in-touch.scss',
  animations: [scrollFadeUp],
})
export class GetInTouch implements OnInit {
  contactInfo: ContactInfo | null = null;
  loading = true;
  error: string | null = null;
  animationState: 'hidden' | 'visible' = 'hidden';

  constructor(private contactUsService: ContactUsService) {}

  ngOnInit(): void {
    this.loadContactInfo();
  }

  loadContactInfo(): void {
    this.loading = true;
    this.error = null;

    this.contactUsService.getContactInfo().subscribe({
      next: (response) => {
        if (response.status) {
          this.contactInfo = response.data;
        } else {
          this.error = 'Failed to load contact information';
        }
        this.loading = false;
      },
      error: (error) => {
         this.error = 'An error occurred while loading contact information';
        this.loading = false;
      },
    });
  }

  onAnimate(): void {
    this.animationState = 'visible';
  }

  // Helper method to get display text for social links
  getDisplayText(url: string): string {
    if (!url) return '';

    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace('www.', '');

      if (hostname.includes('facebook.com')) {
        return (
          'facebook.com/' +
          urlObj.pathname
            .split('/')
            .filter((p) => p)
            .join('/')
        );
      } else if (hostname.includes('instagram.com')) {
        return (
          'instagram.com/' +
          urlObj.pathname
            .split('/')
            .filter((p) => p)
            .join('/')
        );
      } else if (hostname.includes('x.com') || hostname.includes('twitter.com')) {
        return (
          'x.com/' +
          urlObj.pathname
            .split('/')
            .filter((p) => p)
            .join('/')
        );
      }

      return hostname + urlObj.pathname;
    } catch {
      return url;
    }
  }

  // Helper method to format phone numbers for tel: links
  formatPhoneForTel(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  // Helper method to format phone numbers for WhatsApp links
  formatPhoneForWhatsApp(phone: string): string {
    return phone.replace(/\D/g, '');
  }
}
