import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { NotificationService, Notification } from './notification.service';

@Component({
  selector: 'app-notification-icon',
  imports: [CommonModule, TranslateModule],
  templateUrl: './notification-icon.html',
  styleUrl: './notification-icon.scss',
})
export class NotificationIcon implements OnInit {
  isAuthenticated = false;
  notifications: Notification[] = [];
  unreadCount = 0;
  isDropdownOpen = false;

  constructor(private authService: AuthService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.checkAuthentication();
    if (this.isAuthenticated) {
      this.loadNotifications();
    }
  }

  private checkAuthentication() {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  private loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (response) => {
        if (response.status) {
          this.notifications = response.data;
          this.unreadCount = this.notifications.filter((n) => !n.is_read).length;
        }
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      },
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  markAsRead(notification: Notification) {
    if (notification.is_read) return;

    this.notificationService.markAsRead([notification.id]).subscribe({
      next: (response) => {
        notification.is_read = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      },
    });
  }

  markAllAsRead() {
    const unreadIds = this.notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    this.notificationService.markAsRead(unreadIds).subscribe({
      next: (response) => {
        this.notifications.forEach((n) => (n.is_read = true));
        this.unreadCount = 0;
      },
      error: (error) => {
        console.error('Error marking all notifications as read:', error);
      },
    });
  }

  getUnreadNotifications() {
    return this.notifications.filter((n) => !n.is_read);
  }

  getReadNotifications() {
    return this.notifications.filter((n) => n.is_read);
  }
}
