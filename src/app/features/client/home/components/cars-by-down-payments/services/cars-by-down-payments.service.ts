import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';

export interface Brand {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  image_url: any;
}

export interface Item {
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

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface Data {
  items: Item[];
  pagination: Pagination;
}

export interface Root {
  status: boolean;
  message: string;
  data: Data;
}

export interface CarFilters {
  model?: string;
  year?: string;
  color?: string;
  transmission?: string;
  engine_cc?: string;
  body_type?: string;
  km_driven?: string;
  price?: string;
  down_payment?: string;
  license_validity?: string;
  location?: string;
  condition?: string;
  brand?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarsByDownPaymentsService {

  constructor(private http: HttpClient) { }

  getCars(filters?: CarFilters): Observable<Root> {
    let params = new HttpParams();

    // Only add filters if they have actual values
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof CarFilters];
        if (value && value.toString().trim() !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<Root>(`${environment.apiUrl}cars`, { params });
  }
}