import { Component } from '@angular/core';
import { HomeHeaderComponent } from './components/home-header/home-header';
import { DriveHome } from './components/drive-home/drive-home';
import { HomeWhichDrifter } from './components/home-which-drifter/home-which-drifter';
import { TrustedPartners } from './components/trusted-partners/trusted-partners';
import { HomeAutoFinance } from './components/home-auto-finance/home-auto-finance';
import { HomeSecondDriveHome } from './components/home-second-drive-home/home-second-drive-home';
import { HowItWorks } from './components/how-it-works/how-it-works';
import { VehicleFinancingComponent } from './components/vehicle-financing/vehicle-financing';
import { DriftechVlogs } from '../../../shared/driftech-vlogs/driftech-vlogs';
import { ContactUs } from '../../../shared/contact-us/contact-us';
import { CarsByDownPayments } from './components/cars-by-down-payments/cars-by-down-payments';
import { RpmGaugeComponent } from '../../../shared/rpm/rpm';
import { LoginRequiredPopup } from '../../../shared/login-required-popup/login-required-popup';
import { DrifterDetailsPopup } from './components/drifter-details-popup/drifter-details-popup';
import { WhichDrifterCardData } from '../../../shared/which-drifter-card/which-drifter-card';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [
    HomeHeaderComponent,
    DriveHome,
    RpmGaugeComponent,
    HomeWhichDrifter,
    CarsByDownPayments,
    TrustedPartners,
    HomeAutoFinance,
    HomeSecondDriveHome,
    HowItWorks,
    VehicleFinancingComponent,
    DriftechVlogs,
    ContactUs,
    LoginRequiredPopup,
    DrifterDetailsPopup,
  ],
  templateUrl: './home.html',
  styles: [],
})
export class Home {
  rpmValue$ = new BehaviorSubject<number>(3);
  showPopup = false;
  selectedCard: WhichDrifterCardData | null = null;

  constructor(private router: Router) {}

  onCardClick(card: WhichDrifterCardData) {
    this.selectedCard = card;
    this.showPopup = true;
  }

  onCardButtonClick(card: WhichDrifterCardData) {
    // Navigate to different routes based on card type
    switch (card.kind) {
      case 'drift_now':
        this.router.navigate(['/finance'], { queryParams: { type: 'drift-now' } });
        break;
      case 'trade_in':
        this.router.navigate(['/finance'], { queryParams: { type: 'trade-in' } });
        break;
      case 'drift_fleet':
        this.router.navigate(['/finance'], { queryParams: { type: 'fleet' } });
        break;
      case 'drift_save':
        this.router.navigate(['/finance'], { queryParams: { type: 'save' } });
        break;
      default:
        this.router.navigate(['/finance']);
    }
  }

  closePopup() {
    this.showPopup = false;
    this.selectedCard = null;
  }
}
