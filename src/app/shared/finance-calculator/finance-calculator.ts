import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthsRpmComponent, State } from '../months-rpm/months-rpm';
import { FinanceCalculatorService, CalculatorState } from './services/finance-calculator.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { fadeUp } from '../animations/animations';
import { scrollFadeUp } from '../animations/scroll.animations';
import { AnimateOnScrollDirective } from '../directives/animate-on-scroll.directive';

@Component({
  selector: 'app-finance-calculator',
  imports: [
    MonthsRpmComponent,
    CommonModule,
    RouterLink,
    AnimateOnScrollDirective,
    TranslateModule,
  ],
  templateUrl: './finance-calculator.html',
  styleUrl: './finance-calculator.scss',
  animations: [scrollFadeUp],
})
export class FinanceCalculator implements AfterViewInit, OnDestroy {
  @ViewChild(MonthsRpmComponent) monthsRpm!: MonthsRpmComponent;
  animationState: 'hidden' | 'visible' = 'hidden';

  onAnimate(): void {
    this.animationState = 'visible';
  }
  // Local state for display
  state: State = {
    car_price: 0,
    down_payment: 0,
    months: null,
  };

  calculatorState: CalculatorState = {
    car_price: 0,
    down_payment: 0,
    months: null,
    loading: false,
  };

  private subscription: Subscription = new Subscription();

  constructor(private financeService: FinanceCalculatorService) {}

  ngAfterViewInit() {
    // Subscribe to calculator state changes
    this.subscription.add(
      this.financeService.state$.subscribe((calcState) => {
        this.calculatorState = calcState;
        this.state = {
          car_price: calcState.car_price,
          down_payment: calcState.down_payment,
          months: calcState.months,
        };
        this.updateMonthsRpm();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onPeriodChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;

    if (selectedValue === '') {
      // User selected the placeholder option, reset to null
      this.financeService.updateMonths(null as any);
    } else {
      const numericValue = parseInt(selectedValue);
      if (!isNaN(numericValue)) {
        this.financeService.updateMonths(numericValue);
      }
    }
  }

  onCarPriceChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value) || 0;
    if (value >= 1) {
      this.financeService.updateCarPrice(value);
    }
  }

  onDownPaymentChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value) || 0;
    if (value >= 0) {
      this.financeService.updateDownPayment(value);
    }
  }

  private updateMonthsRpm() {
    // State is automatically bound to the child component via [state]="state" in template
    // This method is kept for potential future use
  }

  reset() {
    this.financeService.reset();
  }

  applyNow() {
    // Trigger calculation with current values (only if months is selected)
    if (this.calculatorState.months) {
      this.financeService
        .calculateInstallment({
          car_price: this.calculatorState.car_price,
          down_payment: this.calculatorState.down_payment,
          months: this.calculatorState.months,
        })
        .subscribe();
    }
  }

  formatCurrency(value: string | number): string {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2,
    }).format(numValue);
  }

  formatNumber(value: string | number): string {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-EG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  }
}
