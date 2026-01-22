import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  ContactUsService,
  ContactInfo,
} from '../../../contact-us/components/get-in-touch/services/contact-us.service';
import { SupportForm } from '../support-form/support-form';

@Component({
  selector: 'app-support-content',
  imports: [CommonModule, TranslateModule, SupportForm],
  templateUrl: './support-content.html',
  styleUrl: './support-content.scss',
})
export class SupportContent implements OnInit {
  contactInfo: ContactInfo | null = null;
  loading = true;
  error: string | null = null;

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

  // Helper method to format phone numbers for WhatsApp links
  formatPhoneForWhatsApp(phone: string): string {
    return phone.replace(/\D/g, '');
  }
}
