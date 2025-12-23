import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { University, Faculty } from '../models/university-faculty.interface';

@Injectable({
  providedIn: 'root'
})
export class UniversitiesFacultiesService {
  private readonly BASE_URL = 'https://driftech.tech/dashboard/public/api';
  
  private universitiesSubject = new BehaviorSubject<University[]>([]);
  public universities$ = this.universitiesSubject.asObservable();
  
  private facultiesSubject = new BehaviorSubject<Faculty[]>([]);
  public faculties$ = this.facultiesSubject.asObservable();

  private universitiesLoaded = false;
  private facultiesLoaded = false;

  constructor(private http: HttpClient) {}

  /**
   * Load universities from API
   */
  loadUniversities(): Observable<University[]> {
    if (this.universitiesLoaded && this.universitiesSubject.value.length > 0) {
      return this.universities$;
    }

    console.log('Loading universities from API...');
    return this.http.get<University[]>(`${this.BASE_URL}/universities`).pipe(
      tap(universities => {
        console.log('Universities loaded:', universities);
        this.universitiesSubject.next(universities);
        this.universitiesLoaded = true;
      }),
      catchError(error => {
        console.error('Error loading universities:', error);
        this.universitiesSubject.next([]);
        return of([]);
      })
    );
  }

  /**
   * Load faculties from API
   */
  loadFaculties(): Observable<Faculty[]> {
    if (this.facultiesLoaded && this.facultiesSubject.value.length > 0) {
      return this.faculties$;
    }

    console.log('Loading faculties from API...');
    return this.http.get<Faculty[]>(`${this.BASE_URL}/faculties`).pipe(
      tap(faculties => {
        console.log('Faculties loaded:', faculties);
        this.facultiesSubject.next(faculties);
        this.facultiesLoaded = true;
      }),
      catchError(error => {
        console.error('Error loading faculties:', error);
        this.facultiesSubject.next([]);
        return of([]);
      })
    );
  }

  /**
   * Get cached universities
   */
  getCachedUniversities(): University[] {
    return this.universitiesSubject.value;
  }

  /**
   * Get cached faculties
   */
  getCachedFaculties(): Faculty[] {
    return this.facultiesSubject.value;
  }

  /**
   * Check if universities are loaded
   */
  isUniversitiesLoaded(): boolean {
    return this.universitiesLoaded;
  }

  /**
   * Check if faculties are loaded
   */
  isFacultiesLoaded(): boolean {
    return this.facultiesLoaded;
  }

  /**
   * Get faculties by university ID
   */
  getFacultiesByUniversityId(universityId: string): Faculty[] {
    const faculties = this.getCachedFaculties();
    return faculties.filter(faculty => faculty.university_id.toString() === universityId);
  }

  /**
   * Clear cached data
   */
  clearCache(): void {
    this.universitiesSubject.next([]);
    this.facultiesSubject.next([]);
    this.universitiesLoaded = false;
    this.facultiesLoaded = false;
  }
}