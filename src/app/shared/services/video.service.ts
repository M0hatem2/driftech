import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vlog, VlogResponse } from '../models/vlog.interface';

export interface VideoResponse {
  status: boolean;
  message: string;
  data: {
    items: {
      [key: string]: Vlog;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private readonly apiUrl = `${environment.apiUrl}videos`;

  constructor(private http: HttpClient) {}

  getVideos(): Observable<Vlog[]> {
    return this.http.get<VideoResponse>(this.apiUrl).pipe(
      map(response => {
        if (response.status && response.data && response.data.items) {
          // Convert the items object to an array
          return Object.values(response.data.items);
        }
        return [];
      })
    );
  }

  getVideoById(id: number): Observable<Vlog | null> {
    return this.http.get<VideoResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.status && response.data && response.data.items) {
          const video = Object.values(response.data.items)[0];
          return video || null;
        }
        return null;
      })
    );
  }
}