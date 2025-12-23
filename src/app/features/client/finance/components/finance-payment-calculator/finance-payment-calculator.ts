import { Component } from '@angular/core';
import { FinanceCalculator } from "../../../../../shared/finance-calculator/finance-calculator";

@Component({
  selector: 'app-finance-payment-calculator',
  imports: [FinanceCalculator],
  templateUrl: './finance-payment-calculator.html',
  styleUrl: './finance-payment-calculator.scss',
})
export class FinancePaymentCalculator {

}
