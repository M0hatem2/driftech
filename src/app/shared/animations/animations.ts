import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

/**
 * Fade + Slide Up
 */
export const fadeUp = trigger('fadeUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('600ms ease-out',
      style({ opacity: 1, transform: 'translateY(0)' })
    )
  ])
]);

/**
 * Fade In
 */
export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('400ms ease-in', style({ opacity: 1 }))
  ])
]);
