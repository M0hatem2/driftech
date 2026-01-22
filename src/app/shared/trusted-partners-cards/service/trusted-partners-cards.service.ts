import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Root, TrustedPartner } from '../../models/trusted-partner.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrustedPartnersCardsService {

  constructor(private http: HttpClient) { }

  getPartners(): Observable<TrustedPartner[]> {
    const url = `${environment.apiUrl}partners`;
     return this.http.get<Root>(url).pipe(
      map(response => {
         if (response.status && response.data?.items) {
          const items = Object.values(response.data.items);
           const partners = items.map((item: any) => ({
            id: item.id.toString(),
            name: item.title,
            logoUrl: item.image_url.replace('/public/', '/'),
            alt: item.description,
          }));
           return partners;
        }
        return [];
      })
    );
  }
}