import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, throttleTime } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private router = inject(Router);

  constructor() {
    this.initializeScrollRestoration();
  }

  /**
   * Initialize scroll restoration for smooth navigation
   */
  private initializeScrollRestoration(): void {
    // Listen to navigation end events and scroll to top with smooth behavior
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      throttleTime(100) // Throttle to prevent multiple rapid calls
    ).subscribe(() => {
      this.scrollToTopSmooth();
    });
  }

  /**
   * Scroll to top with smooth animation
   */
  scrollToTopSmooth(): void {
    try {
      // Try modern scroll behavior first
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } else {
        // Fallback for older browsers
        this.scrollToTopInstant();
      }
    } catch (error) {
      console.warn('Smooth scrolling failed, falling back to instant scroll:', error);
      this.scrollToTopInstant();
    }
  }

  /**
   * Instant scroll to top (fallback)
   */
  private scrollToTopInstant(): void {
    window.scrollTo(0, 0);
  }

  /**
   * Scroll to specific element with smooth behavior
   */
  scrollToElementSmooth(element: HTMLElement | string, offset: number = 0): void {
    let targetElement: HTMLElement | null = null;

    if (typeof element === 'string') {
      targetElement = document.querySelector(element) as HTMLElement;
    } else {
      targetElement = element;
    }

    if (targetElement) {
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const targetPosition = elementPosition - offset;

      try {
        if ('scrollBehavior' in document.documentElement.style) {
          window.scrollTo({
            top: targetPosition,
            left: 0,
            behavior: 'smooth'
          });
        } else {
          window.scrollTo(0, targetPosition);
        }
      } catch (error) {
        console.warn('Smooth scrolling to element failed:', error);
        window.scrollTo(0, targetPosition);
      }
    }
  }

  /**
   * Get current scroll position
   */
  getCurrentScrollPosition(): { x: number; y: number } {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
      y: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    };
  }

  /**
   * Check if user is at top of page
   */
  isAtTop(threshold: number = 10): boolean {
    return this.getCurrentScrollPosition().y <= threshold;
  }
}