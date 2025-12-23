import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HelpRequestData {
  email: string;
  mobile_number: string;
  type: string;
  description: string;
  subject: string;
  sub_type: string;
}

export interface HelpRequestResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    email: string;
    mobile_number: string;
    type: string;
    subject: string;
    sub_type: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class HelpRequestService {
  private readonly apiUrl = 'https://driftech.tech/dashboard/public/api/auth/Help-Request';

  constructor(private http: HttpClient) {}

  submitHelpRequest(requestData: HelpRequestData): Observable<HelpRequestResponse> {
    return this.http.post<HelpRequestResponse>(this.apiUrl, requestData);
  }
}
