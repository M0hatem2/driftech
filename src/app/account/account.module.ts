import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SupportComponent } from './components/support/support.component';
import { AccountLayoutComponent } from './layout/account-layout/account-layout.component';

// Standalone components
import { Header } from '../layouts/client-layout/header/header';
import { FinanceStatusComponent } from './components/finance-status/finance-status.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [SupportComponent, AccountLayoutComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink,
    RouterOutlet,
    TranslateModule,
    Header, // Standalone → imports
    FinanceStatusComponent, // Standalone → imports
    ProfileComponent, // Standalone → imports
  ],
})
export class AccountModule {}
