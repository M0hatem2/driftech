import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Vlog, VlogResponse } from '../../models/vlog.interface';

@Injectable({
  providedIn: 'root',
})
export class DriftechVlogsService {
  private apiUrl = `${environment.apiUrl}videos`;

  constructor(private http: HttpClient) {}

  getVideos(): Observable<Vlog[]> {
    return this.http.get<VlogResponse>(this.apiUrl).pipe(
      map((response) => {
        if (response.status && response.data.items) {
          // Convert the items object to an array and map fields
          return Object.values(response.data.items).map((vlog) => ({
            ...vlog,
            thumbnail: vlog.thumbnail_url || undefined,
          }));
        }
        return [];
      })
    );
  }
}
