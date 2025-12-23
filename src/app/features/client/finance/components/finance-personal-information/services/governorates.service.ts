import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { Governorate, GovernorateResponse } from '../models/governorate.interface';
// Note: Using direct API URL since environment import path issue
// import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GovernoratesService {
  private readonly apiUrl = 'https://driftech.tech/dashboard/public/api/governorates';
  private governoratesSubject = new BehaviorSubject<Governorate[]>([]);
  public governorates$ = this.governoratesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadGovernorates();
  }

  /**
   * Load governorates data from API
   */
  private loadGovernorates(): void {
    this.getGovernorates().subscribe({
      next: (data) => {
        this.governoratesSubject.next(data);
      },
      error: (error) => {
         // Set fallback data in case of API failure
        this.governoratesSubject.next([
          { id: 1, name: 'Cairo' },
          { id: 2, name: 'Giza' },
          { id: 3, name: 'Alexandria' },
          { id: 4, name: 'Luxor' },
          { id: 5, name: 'Aswan' }
        ]);
      }
    });
  }

  /**
   * Get governorates from API
   */
  getGovernorates(): Observable<GovernorateResponse> {
    return this.http.get<GovernorateResponse>(this.apiUrl).pipe(
      tap(data => console.log('Governorates loaded successfully:', data)),
      catchError(error => {
         return throwError(() => new Error('Failed to load governorates. Please try again later.'));
      })
    );
  }

  /**
   * Get cached governorates data
   */
  getCachedGovernorates(): Governorate[] {
    return this.governoratesSubject.value;
  }

  /**
   * Get governorate by ID
   */
  getGovernorateById(id: number): Governorate | undefined {
    return this.governoratesSubject.value.find(gov => gov.id === id);
  }

  /**
   * Refresh governorates data
   */
  refreshGovernorates(): Observable<GovernorateResponse> {
    return this.http.get<GovernorateResponse>(this.apiUrl).pipe(
      tap(data => {
        this.governoratesSubject.next(data);
       }),
      catchError(error => {
         return throwError(() => new Error('Failed to refresh governorates. Please try again later.'));
      })
    );
  }

  /**
   * Check if governorates are loaded
   */
  isDataLoaded(): boolean {
    return this.governoratesSubject.value.length > 0;
  }
}