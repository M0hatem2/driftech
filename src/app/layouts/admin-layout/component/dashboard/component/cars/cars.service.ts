import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';
 
// Generic API Response Interface
export interface Root<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface Data {
  items: Item[];
  pagination: Pagination;
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
  image_url?: string;
  images: Image[];
  brand: Brand;
  exterior_conditions: any[];
  interior_conditions: any[];
  mechanical_conditions: any[];
}

export interface Image {
  id: number;
  car_id: string;
  is_360: string;
  created_at: string;
  updated_at: string;
  image_url: any;
}

export interface Brand {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  image_url: any;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface CarsResponse {
  status: boolean;
  message: string;
  data: {
    items: Item[];
    pagination: Pagination;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  private readonly baseUrl = `${environment.apiUrl}cars`;

  constructor(private http: HttpClient) {}

  /**
   * Get all cars with pagination and optional filters
   * @param page - Page number (default: 1)
   * @param perPage - Items per page (default: 12)
   * @param search - Search term for filtering cars
   * @param brandId - Brand ID for filtering
   * @param status - Status for filtering
   * @returns Observable of CarsResponse
   */
  getAllCars(
    page: number = 1,
    perPage: number = 12,
    search?: string,
    brandId?: string,
    status?: string
  ): Observable<CarsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (brandId) {
      params = params.set('brand_id', brandId);
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<CarsResponse>(this.baseUrl, { params });
  }

  /**
   * Get a single car by ID
   * @param id - Car ID
   * @returns Observable of Root<Item>
   */
  getCarById(id: number): Observable<Root<Item>> {
    return this.http.get<Root<Item>>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new car
   * @param carData - Car data to create
   * @returns Observable of Root<Item>
   */
  createCar(carData: Partial<Item>): Observable<Root<Item>> {
    return this.http.post<Root<Item>>(this.baseUrl, carData);
  }

  /**
   * Update an existing car
   * @param id - Car ID
   * @param carData - Updated car data
   * @returns Observable of Root<Item>
   */
  updateCar(id: number, carData: Partial<Item>): Observable<Root<Item>> {
    return this.http.put<Root<Item>>(`${this.baseUrl}/${id}`, carData);
  }

  /**
   * Delete a car
   * @param id - Car ID
   * @returns Observable of Root<any>
   */
  deleteCar(id: number): Observable<Root<any>> {
    return this.http.delete<Root<any>>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get all brands
   * @returns Observable of Root<Brand[]>
   */
  getBrands(): Observable<Root<Brand[]>> {
    return this.http.get<Root<Brand[]>>(`${environment.apiUrl}brands`);
  }

  /**
   * Get all vehicle categories
   * @returns Observable of Root<any[]>
   */
  getVehicleCategories(): Observable<Root<any[]>> {
    return this.http.get<Root<any[]>>(`${environment.apiUrl}vehicle-categories`);
  }

  /**
   * Upload car images
   * @param carId - Car ID
   * @param formData - FormData with images
   * @returns Observable of Root<any>
   */
  uploadCarImages(carId: number, formData: FormData): Observable<Root<any>> {
    return this.http.post<Root<any>>(`${this.baseUrl}/${carId}/images`, formData);
  }

  /**
   * Delete a car image
   * @param carId - Car ID
   * @param imageId - Image ID
   * @returns Observable of Root<any>
   */
  deleteCarImage(carId: number, imageId: number): Observable<Root<any>> {
    return this.http.delete<Root<any>>(`${this.baseUrl}/${carId}/images/${imageId}`);
  }

  /**
   * Toggle car favorite status
   * @param carId - Car ID
   * @returns Observable of Root<any>
   */
  toggleFavorite(carId: number): Observable<Root<any>> {
    return this.http.post<Root<any>>(`${this.baseUrl}/${carId}/toggle-favorite`, {});
  }

  /**
   * Get cars statistics/dashboard data
   * @returns Observable of Root<any>
   */
  getCarsStatistics(): Observable<Root<any>> {
    return this.http.get<Root<any>>(`${this.baseUrl}/statistics`);
  }
}