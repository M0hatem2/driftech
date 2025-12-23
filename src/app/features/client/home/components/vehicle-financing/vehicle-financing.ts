import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { scrollFadeUp } from '../../../../../shared/animations/scroll.animations';
import { AnimateOnScrollDirective } from '../../../../../shared/directives/animate-on-scroll.directive';

interface Card {
  img: string;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-vehicle-financing',
  imports: [CommonModule, TranslateModule, AnimateOnScrollDirective],
  templateUrl: './vehicle-financing.html',
  styleUrl: './vehicle-financing.scss',
  animations: [scrollFadeUp],
})
export class VehicleFinancingComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('cardContainer') cardContainer!: ElementRef<HTMLDivElement>;

  cards: any[] = [];
  private langChangeSubscription: Subscription = new Subscription();
  animationState: 'hidden' | 'visible' = 'hidden';

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.loadTranslatedCards();

    // Subscribe to language changes
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadTranslatedCards();
    });
  }

  ngOnDestroy() {
    this.langChangeSubscription.unsubscribe();
  }

  onAnimate(): void {
    this.animationState = 'visible';
  }

  private loadTranslatedCards() {
    this.cards = [
      {
        img: '/assets/img/Pre-Owned Cars.webp',
        title: this.translate.instant('PRE_OWNED_CARS'),
        desc: this.translate.instant('PRE_OWNED_CARS_DESC'),
      },
      {
        img: '/assets/img/New Cars.webp',
        title: this.translate.instant('NEW_CARS'),
        desc: this.translate.instant('NEW_CARS_DESC'),
      },
      {
        img: '/assets/img/Electric Cars.webp',
        title: this.translate.instant('ELECTRIC_CARS'),
        desc: this.translate.instant('ELECTRIC_CARS_DESC'),
      },
      {
        img: '/assets/img/Imported Cars.webp',
        title: this.translate.instant('IMPORTED_CARS'),
        desc: this.translate.instant('IMPORTED_CARS_DESC'),
      },
    ];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initDragScroll();
    }, 100);
  }

  initDragScroll() {
    const container = this.cardContainer.nativeElement;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let active = false;

    // الماوس - بدء السحب
    const startMouse = (e: MouseEvent) => {
      e.preventDefault();
      active = true;
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.classList.add('cursor-grabbing');
      container.style.cursor = 'grabbing';
    };

    // الماوس - أثناء السحب
    const moveMouse = (e: MouseEvent) => {
      if (!isDown || !active) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      const newScrollLeft = scrollLeft - walk;

      // تحديد الحدود
      const minScroll = 0;
      const maxScroll = container.scrollWidth - container.clientWidth;
      container.scrollLeft = Math.max(minScroll, Math.min(maxScroll, newScrollLeft));
    };

    // الماوس - انتهاء السحب
    const endMouse = () => {
      isDown = false;
      active = false;
      container.classList.remove('cursor-grabbing');
      container.style.cursor = 'grab';
    };

    // اللمس - بدء السحب
    const startTouch = (e: TouchEvent) => {
      e.preventDefault();
      active = true;
      isDown = true;
      const touch = e.touches[0];
      startX = touch.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    // اللمس - أثناء السحب
    const moveTouch = (e: TouchEvent) => {
      if (!isDown || !active) return;
      e.preventDefault();
      const touch = e.touches[0];
      const x = touch.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      const newScrollLeft = scrollLeft - walk;

      // تحديد الحدود
      const minScroll = 0;
      const maxScroll = container.scrollWidth - container.clientWidth;
      container.scrollLeft = Math.max(minScroll, Math.min(maxScroll, newScrollLeft));
    };

    // اللمس - انتهاء السحب
    const endTouch = () => {
      isDown = false;
      active = false;
    };

    // إضافة مستمعي أحداث الماوس
    container.addEventListener('mousedown', startMouse);
    container.addEventListener('mousemove', moveMouse);
    container.addEventListener('mouseup', endMouse);
    container.addEventListener('mouseleave', endMouse);

    // إضافة مستمعي أحداث اللمس
    container.addEventListener('touchstart', startTouch, { passive: false });
    container.addEventListener('touchmove', moveTouch, { passive: false });
    container.addEventListener('touchend', endTouch);
    container.addEventListener('touchcancel', endTouch);

    // منع السلوك الافتراضي للرول سير
    container.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );
  }
}
