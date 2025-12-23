import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
// import { environment } from '../../../environments/environment';

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
  selector: 'app-footer',
  imports: [RouterModule, CommonModule, TranslateModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit {
  currentYear = new Date().getFullYear();
  contactInfo: ContactInfo | null = null;
  loading = true;
  error: string | null = null;
  private readonly apiUrl = 'https://driftech.tech/dashboard/public/api/contact-us';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadContactInfo();
  }

  loadContactInfo(): void {
    this.loading = true;
    this.error = null;
    
    this.http.get<ContactUsResponse>(this.apiUrl).subscribe({
      next: (response: ContactUsResponse) => {
        if (response.status) {
          this.contactInfo = response.data;
        } else {
          this.error = 'Failed to load contact information';
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading contact info in footer:', error);
        this.error = 'An error occurred while loading contact information';
        this.loading = false;
      }
    });
  }

  // Helper method to get display text for social links
  getDisplayText(url: string): string {
    if (!url) return '';
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace('www.', '');
      
      if (hostname.includes('facebook.com')) {
        return 'facebook.com/' + urlObj.pathname.split('/').filter(p => p).join('/');
      } else if (hostname.includes('instagram.com')) {
        return 'instagram.com/' + urlObj.pathname.split('/').filter(p => p).join('/');
      } else if (hostname.includes('x.com') || hostname.includes('twitter.com')) {
        return 'x.com/' + urlObj.pathname.split('/').filter(p => p).join('/');
      } else if (hostname.includes('youtube.com')) {
        return 'youtube.com/' + urlObj.pathname.split('/').filter(p => p).join('/');
      }
      
      return hostname + urlObj.pathname;
    } catch {
      return url;
    }
  }

  // Check if URL is for a specific social platform
  isFacebook(url: string): boolean {
    if (!url) return false;
    try {
      const hostname = new URL(url).hostname.replace('www.', '');
      return hostname.includes('facebook.com');
    } catch {
      return false;
    }
  }

  isInstagram(url: string): boolean {
    if (!url) return false;
    try {
      const hostname = new URL(url).hostname.replace('www.', '');
      return hostname.includes('instagram.com');
    } catch {
      return false;
    }
  }

  isTwitter(url: string): boolean {
    if (!url) return false;
    try {
      const hostname = new URL(url).hostname.replace('www.', '');
      return hostname.includes('x.com') || hostname.includes('twitter.com');
    } catch {
      return false;
    }
  }

  isYouTube(url: string): boolean {
    if (!url) return false;
    try {
      const hostname = new URL(url).hostname.replace('www.', '');
      return hostname.includes('youtube.com');
    } catch {
      return false;
    }
  }
}