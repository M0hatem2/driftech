import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vlog } from '../models/vlog.interface';
import { DriftechVlogsService } from './services/driftech-vlogs.service';
import { DriftechVlogsCards } from '../driftech-vlogs-cards/driftech-vlogs-cards';

@Component({
  selector: 'app-driftech-vlogs',
  imports: [CommonModule, DriftechVlogsCards],
  templateUrl: './driftech-vlogs.html',
  styleUrl: './driftech-vlogs.scss',
})
export class DriftechVlogs implements OnInit {
  vlogs: Vlog[] = [];
  loading = true;
  error: string | null = null;
  constructor(private vlogsService: DriftechVlogsService) {}

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    this.loading = true;
    this.vlogsService.getVideos().subscribe({
      next: (videos) => {
        this.vlogs = videos;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load videos';
        this.loading = false;
      },
    });
  }
}
