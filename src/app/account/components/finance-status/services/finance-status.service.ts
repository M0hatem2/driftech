import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FinanceRequestsResponse } from '../models/finance-status.interface';

@Injectable({
  providedIn: 'root'
})
export class FinanceStatusService {
  private apiUrl = 'https://driftech.tech/dashboard/public/api/auth/requests';

  constructor(private http: HttpClient) { }

  getFinanceRequests(): Observable<FinanceRequestsResponse> {
    return this.http.get<FinanceRequestsResponse>(this.apiUrl);
  }
}