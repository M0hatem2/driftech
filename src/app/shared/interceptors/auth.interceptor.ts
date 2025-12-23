import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get the auth token
  const authToken = authService.getToken();

  // Check if we should add the token to this request
  if (authToken && shouldAddToken(req)) {
    // Clone the request and add the authorization header
    const authReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    return next(authReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Token might be expired, logout user
          authService.logout();
          router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};

function shouldAddToken(request: any): boolean {
  // Don't add token to auth endpoints
  const authEndpoints = ['/auth/login', '/auth/register', '/auth/verifyOtp', '/auth/send-otp', '/auth/refresh'];
  return !authEndpoints.some(endpoint => request.url.includes(endpoint));
}