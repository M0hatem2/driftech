import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';

interface ContactUsResponse {
  status: boolean;
  message: string;
  data: ContactInfo;
}

interface ContactInfo {
  id: number;
  hotline_number: string;
  branch_number: string;
  whatsapp_number: string | null;
  facebook_link: string;
  instagram_link: string;
  x_link: string | null;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-contact-us-cards',
  imports: [CommonModule, TranslateModule],
  templateUrl: './contact-us-cards.html',
  styleUrl: './contact-us-cards.scss',
})
export class ContactUsCards implements OnInit {
  contactInfo: ContactInfo | null = null;
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchContactInfo();
  }

  fetchContactInfo(): void {
    this.loading = true;
    this.error = null;
    
    const apiUrl = `${environment.apiUrl}contact-us`;
    this.http.get<ContactUsResponse>(apiUrl).subscribe({
      next: (response: ContactUsResponse) => {
        if (response.status && response.data) {
          this.contactInfo = response.data;
        } else {
          this.error = 'Failed to fetch contact information';
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching contact info:', error);
        this.error = 'An error occurred while fetching contact information';
        this.loading = false;
      }
    });
  }

  get displayPhoneNumber(): string {
    return this.contactInfo?.hotline_number || this.contactInfo?.branch_number || '';
  }

  get displayPhoneLink(): string {
    return `tel:${this.displayPhoneNumber}`;
  }

  get displayWhatsAppLink(): string | null {
    return this.contactInfo?.whatsapp_number ? `https://wa.me/${this.contactInfo.whatsapp_number}` : null;
  }

  get displayWhatsAppNumber(): string | null {
    return this.contactInfo?.whatsapp_number || null;
  }

  get hasMultiplePhoneNumbers(): boolean {
    return !!(this.contactInfo?.hotline_number && this.contactInfo?.branch_number && 
             this.contactInfo.hotline_number !== this.contactInfo.branch_number);
  }
}
