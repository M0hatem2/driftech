import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriftechVlogsCards } from '../../../../../shared/driftech-vlogs-cards/driftech-vlogs-cards';
import { Vlog } from '../../../../../shared/models/vlog.interface';
import { DriftechVlogsService } from '../../../../../shared/driftech-vlogs/services/driftech-vlogs.service';

@Component({
  selector: 'app-our-vlogs',
  imports: [CommonModule, DriftechVlogsCards],
  templateUrl: './our-vlogs.html',
  styleUrl: './our-vlogs.scss',
})
export class OurVlogs implements OnInit {
  // All available vlogs
  allVlogs: Vlog[] = [];
  loading = true;
  error: string | null = null;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 6;
  vlogs: Vlog[] = [];

  constructor(private vlogsService: DriftechVlogsService) {}

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    this.loading = true;
    this.vlogsService.getVideos().subscribe({
      next: (videos) => {
        this.allVlogs = videos;
        this.updateDisplayedVlogs();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load videos';
        this.loading = false;
      },
    });
  }

  // Calculate total number of pages
  get totalPages(): number {
    return Math.ceil(this.allVlogs.length / this.itemsPerPage);
  }

  // Generate array of page numbers for display
  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Get visible page numbers for pagination controls
  get visiblePageNumbers(): number[] {
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Get the end index for pagination info
  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.allVlogs.length);
  }

  // Update the vlogs array to show current page items
  updateDisplayedVlogs(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.vlogs = this.allVlogs.slice(startIndex, endIndex);
  }

  // Go to specific page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updateDisplayedVlogs();
    }
  }

  // Go to previous page
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedVlogs();
    }
  }

  // Go to next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedVlogs();
    }
  }

  // Check if previous button should be disabled
  get isPreviousDisabled(): boolean {
    return this.currentPage === 1;
  }

  // Check if next button should be disabled
  get isNextDisabled(): boolean {
    return this.currentPage === this.totalPages;
  }
}
