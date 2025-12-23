import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarsByDownPaymentsCard } from '../../../../../shared/cars-by-down-payments-card/cars-by-down-payments-card';
import {
  CarsByDownPaymentsService,
  Item,
  CarFilters,
} from './services/cars-by-down-payments.service';
import { TranslateModule } from '@ngx-translate/core';
import { scrollFadeUp } from '../../../../../shared/animations/scroll.animations';
import { AnimateOnScrollDirective } from '../../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-cars-by-down-payments',
  imports: [
    CommonModule,
    FormsModule,
    CarsByDownPaymentsCard,
    TranslateModule,
    AnimateOnScrollDirective,
  ],
  templateUrl: './cars-by-down-payments.html',
  styleUrl: './cars-by-down-payments.scss',
  animations: [scrollFadeUp],
})
export class CarsByDownPayments implements AfterViewInit, OnInit {
  @ViewChild('cardContainer') cardContainer!: ElementRef<HTMLDivElement>;

  cars: Item[] = [];
  filteredCars: Item[] = [];
  filters: CarFilters = {};
  selectedPriceRange: string = 'All';
  animationState: 'hidden' | 'visible' = 'hidden';

  constructor(private carsService: CarsByDownPaymentsService) {}

  ngOnInit(): void {
    // Clear any filters to show all cars
    this.filters = {};
    this.selectedPriceRange = 'All';
    this.loadCars();
  }

  onAnimate(): void {
    this.animationState = 'visible';
  }

  loadCars(): void {
    // Don't pass filters object if it's empty, to ensure we get all cars
    const filtersToSend = Object.keys(this.filters).length > 0 ? this.filters : undefined;

    this.carsService.getCars(filtersToSend).subscribe({
      next: (response) => {
        if (response.status) {
          this.cars = response.data.items;
          // Always show all cars by default
          this.filteredCars = [...this.cars];
          console.log('Loaded cars:', this.cars.length);
        }
      },
      error: (error) => {
        console.error('Error loading cars:', error);
      },
    });
  }

  applyFilters(): void {
    this.loadCars();
  }

  clearFilters(): void {
    this.filters = {};
    this.loadCars();
  }

  onPriceRangeChange(range: string): void {
    this.selectedPriceRange = range;
    this.applyPriceFilter();
  }

  applyPriceFilter(): void {
    // Always start with all cars
    let carsToFilter = [...this.cars];

    if (this.selectedPriceRange === 'All') {
      this.filteredCars = carsToFilter;
      console.log('Showing all cars:', this.filteredCars.length);
    } else if (this.selectedPriceRange.startsWith('More than')) {
      const minStr = this.selectedPriceRange.replace('More than ', '');
      const min = parseInt(minStr.replace(/,/g, ''));
      this.filteredCars = carsToFilter.filter((car) => {
        const priceStr = car.price?.toString() || '0';
        const price = parseInt(priceStr.replace(/,/g, '')) || 0;
        return price > min;
      });
      console.log('Showing cars >', min, ':', this.filteredCars.length);
    } else {
      const [minStr, maxStr] = this.selectedPriceRange.split(' - ');
      const min = parseInt(minStr.replace(/,/g, '')) || 0;
      const max = parseInt(maxStr.replace(/,/g, '')) || 0;
      this.filteredCars = carsToFilter.filter((car) => {
        const priceStr = car.price?.toString() || '0';
        const price = parseInt(priceStr.replace(/,/g, '')) || 0;
        return price >= min && price <= max;
      });
      console.log('Showing cars', min, '-', max, ':', this.filteredCars.length);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.cardContainer) {
        this.initDragScroll();
      }
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
