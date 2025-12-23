import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';

// Request interface
export interface CalculateInstallmentRequest {
  car_price: number;
  down_payment: number;
  months: number;
}

// Response interface
export interface CalculateInstallmentResponse {
  car_price: string;
  down_payment: string;
  loan_amount: string;
  interest_percent: string;
  interest_amount: string;
  total_to_pay: string;
  monthly_installment: number;
}

// Calculator state interface
export interface CalculatorState {
  car_price: number;
  down_payment: number;
  months: number | null;
  result?: CalculateInstallmentResponse;
  loading: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FinanceCalculatorService {
  private readonly ANNUAL_INTEREST_RATE = 0.14; // 14% annual interest
  
  private stateSubject = new BehaviorSubject<CalculatorState>({
    car_price: 0,
    down_payment: 0,
    months: 5 * 12,
    loading: false
  });

  public state$ = this.stateSubject.asObservable();

  constructor() {
    // Auto-calculate when state changes (with debouncing)
    this.state$.pipe(
      debounceTime(500), // Wait 500ms after last change
      distinctUntilChanged((prev, curr) => 
        prev.car_price === curr.car_price && 
        prev.down_payment === curr.down_payment && 
        prev.months === curr.months
      )
    ).subscribe(state => {
      // Only calculate if all required fields are provided
      if (state.car_price >= 1 && state.down_payment >= 0 && state.months) {
        this.calculateInstallment({
          car_price: state.car_price,
          down_payment: state.down_payment,
          months: state.months
        }).subscribe({
          next: (response) => {
            this.updateState({ 
              result: response, 
              loading: false, 
              error: undefined 
            });
          },
          error: (error) => {
            this.updateState({ 
              loading: false, 
              error: error.message || 'Failed to calculate installment' 
            });
          }
        });
      } else {
        // Clear results if required fields are missing
        this.updateState({ 
          result: undefined, 
          loading: false, 
          error: undefined 
        });
      }
    });
  }

  calculateInstallment(request: CalculateInstallmentRequest): Observable<CalculateInstallmentResponse> {
    this.updateState({ loading: true, error: undefined });
    
    // Calculate using 14% annual interest rate
    const annualInterestRate = this.ANNUAL_INTEREST_RATE;
    const years = request.months / 12;
    const totalInterestRate = annualInterestRate * years; // 14% × years
    const months = request.months;
    
    const loanAmount = request.car_price - request.down_payment;
    const totalInterest = loanAmount * totalInterestRate;
    const totalToPay = loanAmount + totalInterest;
    const monthlyInstallment = totalToPay / months;
    
    const response: CalculateInstallmentResponse = {
      car_price: request.car_price.toString(),
      down_payment: request.down_payment.toString(),
      loan_amount: loanAmount.toString(),
      interest_percent: (totalInterestRate * 100).toFixed(2), // Total interest rate as percentage
      interest_amount: totalInterest.toFixed(2),
      total_to_pay: totalToPay.toFixed(2),
      monthly_installment: Math.round(monthlyInstallment * 100) / 100 // Round to 2 decimal places
    };
    
    // Return as observable (simulating API response)
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(response);
        observer.complete();
        this.updateState({ result: response, loading: false, error: undefined });
      }, 300); // Simulate processing delay
    });
  }

  updateCarPrice(carPrice: number): void {
    this.updateState({ car_price: carPrice });
  }

  updateDownPayment(downPayment: number): void {
    this.updateState({ down_payment: downPayment });
  }

  updateMonths(months: number | null): void {
    this.updateState({ months: months });
  }

  reset(): void {
    this.updateState({
      car_price: 0,
      down_payment: 0,
      months: null,
      result: undefined,
      loading: false,
      error: undefined
    });
  }

  private updateState(updates: Partial<CalculatorState>): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({ ...currentState, ...updates });
  }

  getCurrentState(): CalculatorState {
    return this.stateSubject.value;
  }
}