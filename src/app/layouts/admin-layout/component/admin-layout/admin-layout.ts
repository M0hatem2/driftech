import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Navbar } from "../../navbar/navbar";
import { AdminSidebar } from "../../admin-sidebar/admin-sidebar";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, Navbar, AdminSidebar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout implements OnInit, OnDestroy {
  sidebarOpen = true;
  isLargeScreen = false;
  private destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit() {
    // Initialize screen size detection
    this.checkScreenSize();
    
    // Listen for window resize events (only on browser)
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.checkScreenSize.bind(this));
    }
  }

  ngOnDestroy() {
    // Clean up event listener (only on browser)
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.checkScreenSize.bind(this));
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkScreenSize() {
    // Check if window is available (browser environment)
    if (typeof window !== 'undefined') {
      this.isLargeScreen = window.innerWidth >= 640; // sm breakpoint in Tailwind
    } else {
      // Default to false for server-side rendering
      this.isLargeScreen = false;
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // Method to determine if margin should be applied
  shouldApplyMargin(): boolean {
    return this.sidebarOpen && this.isLargeScreen;
  }

}
