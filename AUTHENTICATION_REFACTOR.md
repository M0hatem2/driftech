# Angular Authentication Flow Refactor

## Overview

This refactor implements a robust, centralized authentication system following Angular best practices. The solution provides proper token management, automatic logout on 401 responses, and reactive authentication state management.

## Architecture

### Core Components

1. **AuthService** (`src/app/core/services/auth.service.ts`)
   - Single source of truth for authentication state
   - Uses `BehaviorSubject<boolean>` for reactive state management
   - Handles token storage, validation, and cleanup
   - Provides centralized logout functionality

2. **AuthInterceptor** (`src/app/shared/interceptors/auth.interceptor.ts`)
   - Automatically attaches Bearer tokens to HTTP requests
   - Handles 401 Unauthorized responses with automatic logout
   - Excludes auth endpoints from token attachment

3. **App Configuration** (`src/app/app.config.ts`)
   - Registers the interceptor with `HTTP_INTERCEPTORS`
   - Uses functional interceptors with `withInterceptors()`

## Key Features

### 1. Reactive Authentication State

```typescript
// AuthService exposes authentication state as Observable
public authState$ = this.authStateSubject.asObservable();

// Components subscribe to state changes
this.authService.authState$.subscribe((isAuth: boolean) => {
  this.isAuthenticated = isAuth;
  if (!isAuth) {
    this.resetComponentState(); // Auto-reset on logout
  }
});
```

### 2. Automatic Token Management

```typescript
// Interceptor automatically adds Bearer token
if (authToken && shouldAddToken(req)) {
  authReq = req.clone({
    setHeaders: {
      'Authorization': `Bearer ${authToken}`
    }
  });
}
```

### 3. Centralized 401 Handling

```typescript
// Automatic logout on 401 responses
catchError((error: HttpErrorResponse) => {
  if (error.status === 401) {
    console.warn('401 Unauthorized - performing automatic logout');
    authService.logout();
    router.navigate(['/auth/login']);
  }
  return throwError(() => error);
})
```

### 4. Safe Initialization

```typescript
// AuthService initializes state safely on startup
private initializeAuthState(): void {
  if (this.isBrowser()) {
    const hasValidToken = this.hasValidToken();
    this.authStateSubject.next(hasValidToken);
  }
}
```

## File Structure

```
src/app/
├── core/
│   └── services/
│       └── auth.service.ts          # Core authentication service
├── shared/
│   ├── interceptors/
│   │   └── auth.interceptor.ts      # HTTP interceptor
│   └── components/
│       └── auth-example.component.ts # Usage example
└── app.config.ts                    # Interceptor registration
```

## Usage Patterns

### Component Authentication Check

```typescript
export class MyComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // ✅ CORRECT: Subscribe to authState$
    this.authSubscription = this.authService.authState$.subscribe((isAuth: boolean) => {
      this.isAuthenticated = isAuth;
      if (!isAuth) {
        this.resetComponentState();
      }
    });
  }

  ngOnDestroy(): void {
    // ✅ IMPORTANT: Always unsubscribe
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private resetComponentState(): void {
    // Reset component state when user logs out
  }
}
```

### Login Implementation

```typescript
login(email: string, password: string): void {
  this.authService.login(email, password).subscribe({
    next: (response: AuthResponse) => {
      // AuthService automatically updates authState$ to true
      this.router.navigate(['/dashboard']);
    },
    error: (error) => {
      console.error('Login failed:', error);
    }
  });
}
```

### Logout Implementation

```typescript
logout(): void {
  // This will automatically:
  // 1. Clear localStorage tokens
  // 2. Update authState$ to false
  // 3. Trigger component state resets
  this.authService.logout();
  this.router.navigate(['/auth/login']);
}
```

## Migration Guide

### Before (❌ Anti-patterns)

```typescript
// DON'T: Direct localStorage access
const token = localStorage.getItem('auth_token');
const isAuth = !!token;

// DON'T: Manual state management
if (response.token) {
  localStorage.setItem('auth_token', response.token);
  this.isAuthenticated = true;
}

// DON'T: Inconsistent logout
localStorage.removeItem('auth_token');
this.isAuthenticated = false;
```

### After (✅ Best practices)

```typescript
// DO: Subscribe to reactive state
this.authService.authState$.subscribe(isAuth => {
  this.isAuthenticated = isAuth;
});

// DO: Use service methods
this.authService.login(email, password).subscribe(response => {
  // State automatically updated
});

// DO: Centralized logout
this.authService.logout(); // Handles everything
```

## Benefits

1. **Consistency**: Single source of truth for authentication state
2. **Reactivity**: Components automatically react to auth changes
3. **Security**: Automatic token cleanup and 401 handling
4. **Maintainability**: Centralized authentication logic
5. **Performance**: Efficient state management with BehaviorSubject
6. **SSR Safe**: Proper browser environment checks

## Testing Considerations

```typescript
// Mock AuthService in tests
const mockAuthService = {
  authState$: new BehaviorSubject(false),
  login: jasmine.createSpy('login'),
  logout: jasmine.createSpy('logout'),
  getToken: jasmine.createSpy('getToken').and.returnValue('mock-token')
};
```

## Security Notes

1. Tokens are stored in localStorage (consider httpOnly cookies for production)
2. 401 responses trigger immediate logout and redirect
3. Auth endpoints are excluded from token attachment
4. Stale token cleanup is implemented
5. Browser environment checks prevent SSR issues

## Future Enhancements

1. **Token Refresh**: Implement automatic token refresh on 401
2. **Role-based Access**: Add role management to AuthService
3. **Session Timeout**: Implement automatic logout after inactivity
4. **Secure Storage**: Consider moving to httpOnly cookies
5. **Multi-tab Sync**: Sync authentication state across browser tabs