import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

export const scrollFadeUp = trigger('scrollFadeUp', [
  state('hidden', style({
    opacity: 0,
    transform: 'translateY(30px)'
  })),

  state('visible', style({
    opacity: 1,
    transform: 'translateY(0)'
  })),

  transition('hidden => visible', [
    animate('600ms ease-out')
  ])
]);
