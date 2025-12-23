import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string | null;
  token: string;
  refresh_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private readonly token = 'auth_token';
  private readonly REFRESH_token = 'refresh_token';
  private readonly USER_KEY = 'user_data';

  // Authentication state observable
  private authStateSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    // Send both email and phone fields for API compatibility
    // The API might use either field for authentication
    return this.http.post(`${this.apiUrl}auth/login`, {
      email: email,
      phone: null, // Explicitly set phone to null since we're using email
      password: password,
    });
  }

  register(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/register`, { email });
  }

  refreshToken(): Observable<string> {
    if (!this.isBrowser()) {
      return throwError(() => new Error('Not running in browser'));
    }
    const refreshToken = localStorage.getItem(this.REFRESH_token);
    return this.http
      .post<{ token: string }>(`${this.apiUrl}auth/refresh`, {
        refresh_token: refreshToken,
      })
      .pipe(
        map((response) => {
          const newToken = response.token;
          localStorage.setItem(this.token, newToken);
          return newToken;
        })
      );
  }

  sendOtp(phone: string, isForgotPass: number): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/send-otp`, {
      phone: phone,
      isForgotPass: isForgotPass,
    });
  }

  verifyOtp(email: string, otp: number): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}auth/verifyOtp`, {
      email: email,
      otp: otp,
    });
  }

  completeProfile(profileData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}complete-profile`, profileData);
  }

  updatePhone(newPhone: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/update-phone`, {
      new_phone: newPhone,
      password: password,
    });
  }

  // Store user data separately (for profile updates)
  storeUserData(user: User): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Store authentication data in localStorage
  storeAuthData(authResponse: AuthResponse): void {
    if (!this.isBrowser()) return;

   

    localStorage.setItem(this.token, authResponse.token);
    localStorage.setItem(this.REFRESH_token, authResponse.refresh_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));

    
    // Emit authentication state change
    this.authStateSubject.next(true);
  }

  // Check if running in browser environment
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Get stored token
  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.token);
  }

  // Get stored user data
  getUser(): User | null {
    if (!this.isBrowser()) return null;
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const isAuth = !!token;

    // Debug logging - remove this in production

    return isAuth;
  }

  // Clear authentication data
  logout(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(this.token);
    localStorage.removeItem(this.REFRESH_token);
    localStorage.removeItem(this.USER_KEY);

 
    // Emit authentication state change
    this.authStateSubject.next(false);
  }

  // Wait for authentication to be properly set (useful for timing issues)
  waitForAuth(timeout: number = 5000): Promise<boolean> {
    return new Promise((resolve) => {
      const startTime = Date.now();

      const checkAuth = () => {
        const isAuth = this.isAuthenticated();

        if (isAuth || Date.now() - startTime > timeout) {
           resolve(isAuth);
          return;
        }

        setTimeout(checkAuth, 100);
      };

      checkAuth();
    });
  }

  // Clear potentially stale authentication data
  clearStaleAuthData(): void {
    if (!this.isBrowser()) return;

    const token = localStorage.getItem(this.token);
    const userData = localStorage.getItem(this.USER_KEY);

    // Check if data exists but might be corrupted
    if (token && (token === 'null' || token === 'undefined' || token.length < 10)) {
       localStorage.removeItem(this.token);
    }

    if (userData && (userData === 'null' || userData === 'undefined')) {
       localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.REFRESH_token);
    }
  }

  // Force recheck authentication with cleanup
  forceAuthCheck(): boolean {
    this.clearStaleAuthData();
    return this.isAuthenticated();
  }
}
