import { Directive, HostListener, Input } from '@angular/core';
import { ScrollService } from '../services/scroll.service';

@Directive({
  selector: '[appScrollToTop]',
  standalone: true
})
export class ScrollToTopDirective {
  @Input() scrollOffset: number = 0;
  @Input() scrollDuration: number = 300;

  constructor(private scrollService: ScrollService) {}

  @HostListener('click')
  onClick(): void {
    this.scrollService.scrollToTopSmooth();
  }

  /**
   * Scroll to a specific element
   */
  @Input('appScrollToTop')
  set scrollToTarget(target: string | HTMLElement) {
    if (target) {
      this.scrollService.scrollToElementSmooth(target as any, this.scrollOffset);
    }
  }
}