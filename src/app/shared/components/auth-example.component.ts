import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { User, AuthService } from '../../features/auth/services/auth.service';
 
/**
 * Example Component demonstrating proper AuthService usage
 * 
 * Key patterns:
 * 1. Subscribe to authState$ instead of directly reading localStorage
 * 2. Automatically react to logout events by resetting UI state
 * 3. Proper subscription management to prevent memory leaks
 */
@Component({
  selector: 'app-auth-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-status-card">
      <h3>Authentication Status</h3>
      
      <!-- Reactive authentication state display -->
      <div class="status-indicator" [class.authenticated]="isAuthenticated" [class.unauthenticated]="!isAuthenticated">
        <span class="status-text">{{ isAuthenticated ? 'Authenticated' : 'Not Authenticated' }}</span>
        <span class="status-icon">{{ isAuthenticated ? '✓' : '✗' }}</span>
      </div>

      <!-- User information (only shown when authenticated) -->
      <div *ngIf="isAuthenticated && currentUser" class="user-info">
        <h4>User Information</h4>
        <p><strong>Name:</strong> {{ currentUser.name }}</p>
        <p><strong>Email:</strong> {{ currentUser.email }}</p>
        <p><strong>Phone:</strong> {{ currentUser.phone }}</p>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button *ngIf="!isAuthenticated" (click)="navigateToLogin()" class="btn btn-primary">
          Login
        </button>
        <button *ngIf="isAuthenticated" (click)="logout()" class="btn btn-secondary">
          Logout
        </button>
      </div>

      <!-- Feature access example -->
      <div *ngIf="isAuthenticated" class="protected-content">
        <h4>Protected Features</h4>
        <p>This content is only visible to authenticated users.</p>
        <button class="btn btn-accent">Access Protected Feature</button>
      </div>
    </div>
  `,
  styles: [`
    .auth-status-card {
      max-width: 400px;
      margin: 20px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .status-indicator {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
    }

    .status-indicator.authenticated {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .status-indicator.unauthenticated {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .user-info {
      margin: 15px 0;
      padding: 10px;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .actions {
      margin: 15px 0;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-accent {
      background-color: #28a745;
      color: white;
    }

    .protected-content {
      margin-top: 20px;
      padding: 15px;
      background-color: #e7f3ff;
      border-radius: 4px;
      border-left: 4px solid #007bff;
    }
  `]
})
export class AuthExampleComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  currentUser: User | null = null;
  private authSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to authentication state changes
    // This is the recommended pattern - components should react to authState$ changes
    this.authSubscription = this.authService.authState$.subscribe((isAuth: boolean) => {
      this.isAuthenticated = isAuth;
      
      if (isAuth) {
        // User is authenticated - load user data
        this.currentUser = this.authService.getUser();
      } else {
        // User is not authenticated - reset UI state
        this.currentUser = null;
        this.resetComponentState();
      }
    });
  }

  ngOnDestroy(): void {
    // Always unsubscribe to prevent memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  /**
   * Reset component state when user logs out
   * This method is called automatically when authState$ emits false
   */
  private resetComponentState(): void {
    // Reset any component-specific state here
    // For example: clear form data, reset UI state, etc.
    console.log('Resetting component state due to logout');
  }

  /**
   * Navigate to login page
   */
  navigateToLogin(): void {
    // In a real app, you would use Router here
    console.log('Navigate to login page');
  }

  /**
   * Logout user - this will trigger authState$ to emit false
   * and automatically reset the UI state
   */
  logout(): void {
    this.authService.logout();
  }
}