import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FinanceChooseYourCarCard } from "../../../../../shared/finance-choose-your-car-card/finance-choose-your-car-card";

@Component({
  selector: 'app-finance-choose-your-car',
  imports: [CommonModule, FormsModule, TranslateModule, FinanceChooseYourCarCard],
  templateUrl: './finance-choose-your-car.html',
  styleUrl: './finance-choose-your-car.scss',
})
export class FinanceChooseYourCar {
  
  hasSpecificCar: string = '';   // yes | no

  onCarSelectionChange(value: string) {
    this.hasSpecificCar = value;
  }
}
