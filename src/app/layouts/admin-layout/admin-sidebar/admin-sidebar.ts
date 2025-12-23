import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

interface MenuSection {
  id: string;
  isOpen: boolean;
  label: string;
}

@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.scss',
})
export class AdminSidebar implements OnInit {
  @Input() open: boolean = false; // Default to false for mobile
  
  // Menu sections state management
  menuSections: MenuSection[] = [
    { id: 'components-nav', isOpen: false, label: 'Cars' },
    { id: 'roles-permissions-nav', isOpen: false, label: 'Roles & Permissions' },
    { id: 'banner-nav', isOpen: false, label: 'Designs' }
  ];

  // Active menu tracking
  activeMenu: string | null = null;
  
  // Loading state for dynamic content
  isLoading: boolean = false;
  
  // Responsive screen detection
  isLargeScreen: boolean = false;

  ngOnInit() {
    this.checkScreenSize();
   }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    // Check if window is available (browser environment)
    if (typeof window !== 'undefined') {
      this.isLargeScreen = window.innerWidth >= 768; // md breakpoint in Tailwind (768px)
      // Auto-open sidebar on medium screens and larger
      if (this.isLargeScreen) {
        this.open = true;
      }
    } else {
      // Default to false for server-side rendering
      this.isLargeScreen = false;
    }
  }

  /**
   * Toggle a specific menu section
   * @param sectionId - The ID of the section to toggle
   */
  toggleSection(sectionId: string): void {
    this.isLoading = true;
    
    // Find the section
    const section = this.menuSections.find(s => s.id === sectionId);
    if (!section) return;

    // Close other sections (accordion behavior)
    this.menuSections.forEach(s => {
      if (s.id !== sectionId) {
        s.isOpen = false;
      }
    });

    // Toggle current section
    section.isOpen = !section.isOpen;
    this.activeMenu = section.isOpen ? sectionId : null;

    // Simulate loading for better UX
    setTimeout(() => {
      this.isLoading = false;
    }, 300);
  }

  /**
   * Check if a section is expanded
   * @param sectionId - The ID of the section to check
   * @returns boolean indicating if the section is expanded
   */
  isExpanded(sectionId: string): boolean {
    const section = this.menuSections.find(s => s.id === sectionId);
    return section ? section.isOpen : false;
  }

  /**
   * Handle menu item click
   * @param event - Click event
   * @param sectionId - Optional section ID for expandable items
   */
  onMenuClick(event: Event, sectionId?: string): void {
    event.preventDefault();
    event.stopPropagation();

    if (sectionId) {
      this.toggleSection(sectionId);
    } else {
      // Close sidebar on mobile when menu item is clicked
      if (!this.isLargeScreen) {
        this.open = false;
      }
    }
  }

  /**
   * Close all menu sections
   */
  closeAllSections(): void {
    this.menuSections.forEach(section => {
      section.isOpen = false;
    });
    this.activeMenu = null;
  }

  /**
   * Open a specific section
   * @param sectionId - The ID of the section to open
   */
  openSection(sectionId: string): void {
    const section = this.menuSections.find(s => s.id === sectionId);
    if (section) {
      this.closeAllSections();
      section.isOpen = true;
      this.activeMenu = sectionId;
    }
  }

  /**
   * Get the expanded state for Bootstrap collapse
   * @param sectionId - The ID of the section
   * @returns 'true' if expanded, 'false' if collapsed
   */
  getExpandedState(sectionId: string): string {
    return this.isExpanded(sectionId) ? 'true' : 'false';
  }

  /**
   * Check if a menu item is active based on current route
   * @param href - The href to check against current route
   * @returns boolean indicating if the menu item is active
   */
  isActiveMenuItem(href: string): boolean {
    // This would typically check against Angular Router
    // For now, returning false - implement based on your routing logic
    return false;
  }

  /**
   * Handle keyboard navigation
   * @param event - Keyboard event
   * @param sectionId - Optional section ID for expandable items
   */
  onKeyDown(event: KeyboardEvent, sectionId?: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onMenuClick(event, sectionId);
    }
  }
}
