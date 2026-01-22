import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

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

  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';

  // 🔑 Single source of truth for auth state
  private authStateSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient,  private router: Router) {}

  /* =========================
     AUTH API CALLS
  ========================== */

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}auth/login`, {
      email,
      phone: null,
      password,
    });
  }

  register(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/register`, { email });
  }

  refreshToken(): Observable<string> {
    if (!this.isBrowser()) {
      return throwError(() => new Error('Not running in browser'));
    }

    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    return this.http
      .post<{ token: string }>(`${this.apiUrl}auth/refresh`, {
        refresh_token: refreshToken,
      })
      .pipe(
        map((response) => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this.authStateSubject.next(true);
          return response.token;
        })
      );
  }

  /* =========================
     TOKEN HANDLING
  ========================== */

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private decodeToken(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }

  /* =========================
     AUTH STATE
  ========================== */

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    if (this.isTokenExpired(token)) {
      this.logout();
      return false;
    }

    return true;
  }

  checkTokenOnStartup(): void {
    const isAuth = this.isAuthenticated();
    this.authStateSubject.next(isAuth);
  }

  /* =========================
     STORAGE
  ========================== */

  storeAuthData(authResponse: AuthResponse): void {
    if (!this.isBrowser()) return;

    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refresh_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));

    this.authStateSubject.next(true);
  }

  storeUserData(user: User): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): User | null {
    if (!this.isBrowser()) return null;
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /* =========================
     LOGOUT
  ========================== */

  logout(): void {
    if (!this.isBrowser()) return;

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/']);  
    this.authStateSubject.next(false);
  }

  /* =========================
     UTILITIES
  ========================== */

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  clearStaleAuthData(): void {
    if (!this.isBrowser()) return;

    const token = localStorage.getItem(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);

    if (token && (token === 'null' || token === 'undefined' || token.length < 10)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }

    if (userData && (userData === 'null' || userData === 'undefined')) {
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  forceAuthCheck(): boolean {
    this.clearStaleAuthData();
    const isAuth = this.isAuthenticated();
    this.authStateSubject.next(isAuth);
    return isAuth;
  }
updatePhone(newPhone: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}auth/update-phone`, {
    new_phone: newPhone,
    password: password,
  });
}

completeProfile(profileData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}complete-profile`, profileData);
}

verifyOtp(email: string, otp: number): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}auth/verifyOtp`, {
    email: email,
    otp: otp,
  });
}

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
}
