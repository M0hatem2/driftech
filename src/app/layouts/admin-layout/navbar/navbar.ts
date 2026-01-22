import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-admin-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  @Output() toggleSidebar = new EventEmitter<void>();

  user = {
    name: 'Mohamed Hatem',
    image: '/assets/images/user.png',
    role: 'Admin'
  };

  notifications = [
    { message: "New car added", time: "3 min ago" },
    { message: "New user registered", time: "10 min ago" },
  ];

  openNotifications = false;
  openUserMenu = false;

  toggleNotif() {
    this.openNotifications = !this.openNotifications;
  }

  toggleUserMenu() {
    this.openUserMenu = !this.openUserMenu;
  }

  logout() {
     // اعمل هنا redirect للـ login
  }
}