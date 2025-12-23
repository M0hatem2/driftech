import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FinanceStatusService } from './services/finance-status.service';
import { FinanceRequest, FinanceRequestsResponse } from './models/finance-status.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-finance-status',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './finance-status.component.html',
  styleUrls: ['./finance-status.component.scss']
})
export class FinanceStatusComponent implements OnInit {
  financeRequests: FinanceRequest[] = [];
  canApply: boolean = false;
  loading: boolean = true;
  error: string | null = null;

  constructor(private financeStatusService: FinanceStatusService) {}

  ngOnInit(): void {
    this.loadFinanceRequests();
  }

  loadFinanceRequests(): void {
    this.loading = true;
    this.error = null;
    this.financeStatusService.getFinanceRequests().subscribe({
      next: (response: FinanceRequestsResponse) => {
        this.financeRequests = response.data;
        this.canApply = response.can_apply;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load finance requests';
        this.loading = false;
       }
    });
  }

}