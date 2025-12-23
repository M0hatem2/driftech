import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CarModel, CarModelsResponse, GroupedCarModels } from '../models/car-model.interface';

@Injectable({
  providedIn: 'root'
})
export class CarModelsService {
  private readonly BASE_URL = 'https://driftech.tech/dashboard/public/api';
  
  private carModelsSubject = new BehaviorSubject<CarModel[]>([]);
  public carModels$ = this.carModelsSubject.asObservable();
  
  private groupedModelsSubject = new BehaviorSubject<GroupedCarModels>({});
  public groupedModels$ = this.groupedModelsSubject.asObservable();

  private carModelsLoaded = false;

  constructor(private http: HttpClient) {}

  /**
   * Load car models from API
   */
  loadCarModels(): Observable<CarModelsResponse> {
    if (this.carModelsLoaded && this.carModelsSubject.value.length > 0) {
      return new Observable(observer => {
        observer.next({ data: this.carModelsSubject.value });
        observer.complete();
      });
    }

     return this.http.get<CarModelsResponse>(`${this.BASE_URL}/models`).pipe(
      tap(response => {
         const models = response.data;
        this.carModelsSubject.next(models);
        this.groupModelsByBrand(models);
        this.carModelsLoaded = true;
      }),
      catchError(error => {
         this.carModelsSubject.next([]);
        this.groupedModelsSubject.next({});
        return of({ data: [] });
      })
    );
  }

  /**
   * Group models by brand for dropdown display
   */
  private groupModelsByBrand(models: CarModel[]): void {
    const grouped: GroupedCarModels = {};
    
    models.forEach(model => {
      const brandName = model.brand.name;
      if (!grouped[brandName]) {
        grouped[brandName] = [];
      }
      grouped[brandName].push(model);
    });
    
    // Sort brands and models alphabetically
    Object.keys(grouped).forEach(brandName => {
      grouped[brandName].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    const sortedGrouped: GroupedCarModels = {};
    Object.keys(grouped).sort().forEach(brandName => {
      sortedGrouped[brandName] = grouped[brandName];
    });
    
    this.groupedModelsSubject.next(sortedGrouped);
   }

  /**
   * Get cached car models
   */
  getCachedCarModels(): CarModel[] {
    return this.carModelsSubject.value;
  }

  /**
   * Get cached grouped models
   */
  getCachedGroupedModels(): GroupedCarModels {
    return this.groupedModelsSubject.value;
  }

  /**
   * Check if car models are loaded
   */
  isCarModelsLoaded(): boolean {
    return this.carModelsLoaded;
  }

  /**
   * Get all unique brand names
   */
  getBrandNames(): string[] {
    return Object.keys(this.groupedModelsSubject.value).sort();
  }

  /**
   * Get models for specific brand
   */
  getModelsForBrand(brandName: string): CarModel[] {
    const grouped = this.groupedModelsSubject.value;
    return grouped[brandName] || [];
  }

  /**
   * Get specific model by ID
   */
  getCarModelById(modelId: string): CarModel | undefined {
    const models = this.getCachedCarModels();
    return models.find(model => model.id === modelId);
  }

  /**
   * Clear cached data
   */
  clearCache(): void {
    this.carModelsSubject.next([]);
    this.groupedModelsSubject.next({});
    this.carModelsLoaded = false;
  }
}