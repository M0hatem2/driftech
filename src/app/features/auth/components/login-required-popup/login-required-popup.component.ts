import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login-required-popup',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <!-- Backdrop -->
    <div
      class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50"
      (click)="closePopup()"
    >
      <!-- Popup content -->
      <div
        class="bg-white rounded-lg p-6 max-w-md mx-4 relative"
        (click)="$event.stopPropagation()"
      >
        <!-- Close button -->
        <button
          (click)="closePopup()"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        <!-- Content -->
        <div class="text-center">
          <!-- Icon -->
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4"
          >
            <svg
              class="h-6 w-6 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              ></path>
            </svg>
          </div>

          <!-- Title -->
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ 'LOGIN_REQUIRED' | translate }}</h3>

          <!-- Message -->
          <p class="text-sm text-gray-500 mb-6">
            {{ 'LOGIN_REQUIRED_MESSAGE' | translate }}
          </p>

          <!-- Action buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              (click)="navigateToLogin()"
              class="flex-1 px-4 py-2 bg-[#e73201] text-white text-sm font-medium rounded-lg hover:bg-[#c62d01] focus:outline-none focus:ring-2 focus:ring-[#e73201]/50 transition-all"
            >
              {{ 'LOGIN' | translate }}
            </button>
            <button
              (click)="navigateToRegister()"
              class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
            >
              {{ 'CREATE_NEW_ACCOUNT' | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
      }
    `,
  ],
})
export class LoginRequiredPopupComponent {
  @Output() close = new EventEmitter<void>();

  constructor(private router: Router) {}

  closePopup(): void {
    // Emit close event instead of navigating
    this.close.emit();
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
