import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginPopupService } from '../login-popup';

interface Brand {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  image_url: any;
}

interface Item {
  id: number;
  model: string;
  year: string;
  color: string;
  transmission: string;
  engine_cc: string;
  body_type: string;
  km_driven: string;
  price: string;
  down_payment: string;
  license_validity: string;
  location: string;
  condition: string;
  fcm_token: any;
  created_at: string;
  updated_at: string;
  brand_id: string;
  vehicle_category: any;
  description: any;
  payment_option: any;
  is_fav: boolean;
  image_url: any;
  images: any[];
  brand: Brand;
  exterior_conditions: any[];
  interior_conditions: any[];
  mechanical_conditions: any[];
}

@Component({
  selector: 'app-cars-by-down-payments-card',
  imports: [CommonModule],
  templateUrl: './cars-by-down-payments-card.html',
  styleUrl: './cars-by-down-payments-card.scss',
})
export class CarsByDownPaymentsCard {
  @Input() car!: Item;

  constructor(private http: HttpClient, private loginPopupService: LoginPopupService) {}

  toggleFavorite() {
    const token = localStorage.getItem('token'); // Assuming token is stored as 'token'
    if (!token) {
      // Show login popup via service
      this.loginPopupService.showPopup();
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `${environment.apiUrl}auth/favourites/toggle/${this.car.id}`;

    this.http.post(url, {}, { headers }).subscribe({
      next: (response: any) => {
        // Toggle the is_fav status
        this.car.is_fav = !this.car.is_fav;
      },
      error: (error) => {
        console.error('Error toggling favorite:', error);
        // Handle error, maybe show toast
      }
    });
  }

  get carImage(): string {
    // Check if image_url exists and is not empty
    if (this.car?.image_url && typeof this.car.image_url === 'string' && this.car.image_url.trim()) {
      return this.car.image_url;
    }

    // Check if images array exists and has valid items
    if (this.car?.images && Array.isArray(this.car.images) && this.car.images.length > 0) {
      const firstImage = this.car.images[0];
      if (firstImage && typeof firstImage === 'string' && firstImage.trim()) {
        return firstImage;
      }
    }

    // Fallback image when no images are available
    return '/assets/img/noImg.webp';
  }
}
