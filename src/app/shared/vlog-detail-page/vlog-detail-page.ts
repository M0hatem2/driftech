import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Vlog } from '../models/vlog.interface';
import { DriftechVlogsService } from '../driftech-vlogs/services/driftech-vlogs.service';

@Component({
  selector: 'app-vlog-detail-page',
  imports: [CommonModule],
  templateUrl: './vlog-detail-page.html',
  styleUrls: ['./vlog-detail-page.scss'],
})
export class VlogDetailPage implements OnInit {
  vlog: Vlog | null = null;
  isLoading = true;
  showThumbnail = true;
  thumbnailUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vlogsService: DriftechVlogsService
  ) {}

  ngOnInit(): void {
    // Get vlog ID from route params
    const vlogId = this.route.snapshot.paramMap.get('id');

    if (vlogId) {
      this.loadVlogData(parseInt(vlogId));
    } else {
      // Redirect if no ID provided
      this.router.navigate(['/home']);
    }
  }

  private loadVlogData(id: number): void {
    this.vlogsService.getVideos().subscribe({
      next: (videos) => {
        this.vlog = videos.find((v) => v.id === id) || null;
        this.isLoading = false;

        if (!this.vlog) {
          // Vlog not found, redirect back
          this.router.navigate(['/home']);
        } else {
          // Initialize with placeholder immediately
          this.thumbnailUrl = 'assets/img/noImg.webp';
          this.showThumbnail = true;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  shareVideo(): void {
    if (this.vlog) {
      const shareText = `Check out this Driftech vlog: ${this.vlog.title}`;

      if (navigator.share) {
        navigator
          .share({
            title: this.vlog.title,
            text: shareText,
            url: window.location.href,
          })
          .catch((error) => console.log('Error sharing:', error));
      } else {
        navigator.clipboard
          .writeText(`${shareText} - ${window.location.href}`)
          .then(() => {})
          .catch((error) => console.log('Error copying to clipboard:', error));
      }
    }
  }

  addToFavorites(): void {
    if (this.vlog) {
    }
  }

  generateThumbnail(video: HTMLVideoElement): void {
    // Set a fallback timeout in case the video doesn't load
    const fallbackTimeout = setTimeout(() => {
      this.thumbnailUrl = 'assets/img/noImg.webp';
      this.showThumbnail = true;
    }, 3000);

    if (video.duration && video.duration >= 1) {
      // Set video time to 1 second
      video.currentTime = 1;

      const handleSeeked = () => {
        clearTimeout(fallbackTimeout);

        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the video frame to canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to data URL
            this.thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
            this.showThumbnail = true;
          } else {
            throw new Error('Canvas context or video dimensions not available');
          }
        } catch (error) {
          // Fallback to placeholder
          this.thumbnailUrl = 'assets/img/noImg.webp';
          this.showThumbnail = true;
        }

        video.removeEventListener('seeked', handleSeeked);
      };

      video.addEventListener('seeked', handleSeeked);

      // Also listen for loadeddata to ensure video is loaded
      video.addEventListener('loadeddata', () => {});
    } else {
      clearTimeout(fallbackTimeout);
      this.thumbnailUrl = 'assets/img/noImg.webp';
      this.showThumbnail = true;
    }
  }

  hideThumbnail(): void {
    this.showThumbnail = false;
  }

  playVideo(video: HTMLVideoElement): void {
    video.play();
  }

  getVideoThumbnail(): string {
    // Return placeholder if no thumbnail generated yet
    return this.thumbnailUrl || 'assets/img/noImg.webp';
  }

  // Alternative method using video poster as fallback
  getVideoPoster(): string {
    if (this.vlog && (this.vlog.video_url || this.vlog.videoUrl)) {
      // Try to use the video URL as poster (some servers support this)
      return this.vlog.video_url || this.vlog.videoUrl || 'assets/img/noImg.webp';
    }
    return 'assets/img/noImg.webp';
  }

  // Alternative approach for local videos only (won't work with external videos due to CORS)
  captureThumbnail(video: HTMLVideoElement): void {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        video.currentTime = 1; // Seek to 1 second
        video.addEventListener('seeked', () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          this.thumbnailUrl = canvas.toDataURL('image/png');
        });
      }
    } catch (error) {
      // This will fail for external videos due to browser security restrictions
    }
  }
}
