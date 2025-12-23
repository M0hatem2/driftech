# Finance Calculator Service

## Overview

The Finance Calculator Service provides real-time car installment calculations using a fixed 14% annual interest rate. It automatically calculates values whenever input changes and displays the results in a user-friendly format.

## Features

- **Fixed 14% annual interest rate**: Uses 14% per year as the base rate
- **Real-time calculation**: Automatically calculates when any input changes (with 500ms debouncing)
- **Loan period based calculations**: Interest rate is calculated as 14% × number of years
- **Loading states**: Shows loading indicators during calculations
- **Error handling**: Displays error messages for invalid inputs
- **Formatted results**: Displays currency and number values in proper Egyptian format
- **Manual trigger**: "Apply Now" button for immediate calculation

## Calculation Method

### Interest Rate Calculation
- **Base Rate**: 14% per year
- **Formula**: Total Interest Rate = 14% × (Number of Months ÷ 12)
- **Examples**:
  - 12 months (1 year) = 14%
  - 24 months (2 years) = 28%
  - 36 months (3 years) = 42%
  - 60 months (5 years) = 70%

### Interest Amount Calculation
```
Interest Amount = Loan Amount × Total Interest Rate
```

### Total Amount Calculation
```
Total Amount = Loan Amount + Interest Amount
```

### Monthly Installment Calculation
```
Monthly Installment = Total Amount ÷ Number of Months
```

## Usage

### Basic Usage

The component automatically calculates when inputs change:

```html
<app-finance-calculator></app-finance-calculator>
```

### Manual Calculation

You can trigger calculations manually:

```typescript
constructor(private financeService: FinanceCalculatorService) {}

calculateManually() {
  this.financeService.calculateInstallment({
    car_price: 30000,
    down_payment: 6000,
    months: 24
  }).subscribe(response => {
    console.log('Calculation result:', response);
    console.log('Interest rate:', response.interest_percent, '%'); // Will show 28.00%
  });
}
```

### Subscribe to State Changes

```typescript
this.financeService.state$.subscribe(state => {
  console.log('Current state:', state);
  // Access: state.car_price, state.down_payment, state.months,
  // state.result, state.loading, state.error
});
```

### Update Individual Values

```typescript
// Update car price
this.financeService.updateCarPrice(35000);

// Update down payment
this.financeService.updateDownPayment(7000);

// Update months (automatically recalculates interest rate)
this.financeService.updateMonths(36); // Will show 42% interest rate

// Reset to defaults
this.financeService.reset();
```

## Service Methods

### `calculateInstallment(request: CalculateInstallmentRequest)`
Returns an observable of `CalculateInstallmentResponse` with calculated values

### `updateCarPrice(price: number)`
Updates the car price and triggers automatic calculation

### `updateDownPayment(payment: number)`
Updates the down payment and triggers automatic calculation

### `updateMonths(months: number)`
Updates the months and triggers automatic recalculation with new interest rate

### `reset()`
Resets all values to defaults and clears results

### `state
Observable stream of calculator state changes

### `getCurrentState()`
Returns the current calculator state synchronously

## State Interface

```typescript
interface CalculatorState {
  car_price: number;
  down_payment: number;
  months: number;
  result?: CalculateInstallmentResponse;
  loading: boolean;
  error?: string;
}
```

## Response Interface

```typescript
interface CalculateInstallmentResponse {
  car_price: string;
  down_payment: string;
  loan_amount: string;
  interest_percent: string; // Total interest rate (14% × years)
  interest_amount: string;
  total_to_pay: string;
  monthly_installment: number;
}
```

## Error Handling

The service automatically handles:
- Invalid input values
- Negative numbers for car price
- Down payment greater than car price
- Invalid month values
- Loading states

## Formatting

The component provides helper methods for formatting:
- `formatCurrency(value)`: Formats numbers as Egyptian Pound currency
- `formatNumber(value)`: Formats numbers with proper decimal places

## Configuration

The service is configured to:
- Use a fixed 14% annual interest rate
- Calculate interest rate based on loan period
- Debounce requests by 500ms to avoid excessive calculations
- Skip duplicate calculations when values haven't changed
- Display results in a user-friendly format

## Calculation Examples

### Example 1: 12-month loan
- Car Price: 25,000 EGP
- Down Payment: 5,000 EGP
- Loan Amount: 20,000 EGP
- Interest Rate: 14% (12 months = 1 year)
- Interest Amount: 2,800 EGP
- Total Amount: 22,800 EGP
- Monthly Installment: 1,900 EGP

### Example 2: 24-month loan
- Car Price: 30,000 EGP
- Down Payment: 6,000 EGP
- Loan Amount: 24,000 EGP
- Interest Rate: 28% (24 months = 2 years)
- Interest Amount: 6,720 EGP
- Total Amount: 30,720 EGP
- Monthly Installment: 1,280 EGP

## Files Created/Modified

1. **`services/finance-calculator.service.ts`** - Main service implementation with 14% interest calculation
2. **`finance-calculator.ts`** - Updated component to use the service
3. **`finance-calculator.html`** - Enhanced template with results display

## Dependencies

- `@angular/common` - For Angular common functionality
- `rxjs` - For reactive programming with observables

The service is self-contained and doesn't require external API calls for calculations.