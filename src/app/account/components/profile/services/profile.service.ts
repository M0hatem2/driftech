import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileResponse, User } from '../models/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'https://driftech.tech/dashboard/public/api/auth/me';

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(this.apiUrl);
  }
}