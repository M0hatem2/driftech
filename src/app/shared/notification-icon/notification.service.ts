import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  id: number;
  title: string;
  body: string;
  type: string;
  topic: string;
  sent_at: string;
  user_id: any;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationResponse {
  status: boolean;
  message: string;
  data: Notification[];
}

export interface MarkAsReadResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'https://driftech.tech/dashboard/public/api';

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<NotificationResponse> {
    return this.http.get<NotificationResponse>(`${this.apiUrl}/notifications/user`);
  }

  markAsRead(notificationIds: number[]): Observable<MarkAsReadResponse> {
    return this.http.post<MarkAsReadResponse>(`${this.apiUrl}/notifications/read`, {
      notification_ids: notificationIds
    });
  }
}