import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';

export * from './contact-us.service';

export interface ContactUsResponse {
  status: boolean;
  message: string;
  data: ContactInfo;
}

export interface ContactInfo {
  id: number;
  hotline_number: string;
  branch_number: string;
  whatsapp_number: string | null;
  facebook_link: string;
  instagram_link: string;
  x_link: string | null;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  private readonly apiUrl = `${environment.apiUrl}contact-us`;

  constructor(private http: HttpClient) {}

  getContactInfo(): Observable<ContactUsResponse> {
    return this.http.get<ContactUsResponse>(this.apiUrl);
  }
}