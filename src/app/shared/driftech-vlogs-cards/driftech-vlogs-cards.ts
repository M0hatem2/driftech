import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Vlog } from '../models/vlog.interface';

interface ExtendedVlog extends Vlog {
  thumbnail?: string;
  isLoading?: boolean;
  hasError?: boolean;
}

@Component({
  selector: 'app-driftech-vlogs-cards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './driftech-vlogs-cards.html',
  styleUrls: ['./driftech-vlogs-cards.scss'],
})
export class DriftechVlogsCards implements OnInit, OnDestroy, AfterViewInit {
  @Input() vlogs: Vlog[] = [];
  @ViewChild('videoModal') videoModal!: ElementRef<HTMLDivElement>;

  extendedVlogs: ExtendedVlog[] = [];
  selectedVideo: ExtendedVlog | null = null;
  defaultThumbnail =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xNDAgNzJIMTU2VjExMkgxNDBWNzJaIiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPlZpZGVvIFRodW1ibmFpbDwvdGV4dD4KPHN2Zz4K';

  private videoElements: Map<number, HTMLVideoElement> = new Map();
  private resizeObserver?: ResizeObserver;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.extendVlogsData();

    // Set up responsive behavior
    this.setupResponsiveBehavior();
  }

  ngAfterViewInit() {
    // Initialize videos after view is rendered
    setTimeout(() => {
      this.initializeVideoElements();
    }, 100);
  }

  ngOnDestroy() {
    // Clean up video elements and observers
    this.cleanup();
  }

  private extendVlogsData() {
    this.extendedVlogs = this.vlogs.map((vlog) => ({
      ...vlog,
      isLoading: !vlog.thumbnail, // Only loading if no thumbnail provided
      hasError: false,
    }));
  }

  private setupResponsiveBehavior() {
    // Handle responsive behavior if needed
    if (typeof window !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.cdr.detectChanges();
      });

      if (this.videoModal) {
        this.resizeObserver.observe(this.videoModal.nativeElement);
      }
    }
  }

  private initializeVideoElements() {
    const videoElements = document.querySelectorAll('video[data-vlog-id]');

    videoElements.forEach((video) => {
      const element = video as HTMLVideoElement;
      const vlogId = parseInt(element.getAttribute('data-vlog-id') || '0');

      this.setupVideoElement(element, vlogId);
      this.videoElements.set(vlogId, element);
    });
  }

  private setupVideoElement(video: HTMLVideoElement, vlogId: number) {
    const vlog = this.extendedVlogs.find((v) => v.id === vlogId);
    if (!vlog) return;

    // If thumbnail is already provided, no need to extract
    if (vlog.thumbnail) {
      vlog.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    // Set up video properties for thumbnail extraction
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';

    // Add event listeners
    video.addEventListener('loadedmetadata', () => {
      this.extractThumbnailFromElement(video, vlog, videoSrc);
    });

    video.addEventListener('error', () => {
      this.onVideoError(vlog);
    });

    video.addEventListener('canplaythrough', () => {
      if (vlog.isLoading) {
        vlog.isLoading = false;
        this.cdr.detectChanges();
      }
    });

    // Set the video source
    const videoSrc = vlog.videoUrl || vlog.video_url || vlog.link;
    if (videoSrc) {
      video.src = videoSrc;
    }
  }

  extractThumbnailFromElement(videoElement: any, vlog: ExtendedVlog, videoSrc?: string) {
    const video = videoElement as HTMLVideoElement;
    try {
      // Set crossOrigin to handle CORS if possible
      video.crossOrigin = 'anonymous';

      // Ensure video has loaded enough to capture a frame
      if (video.readyState < 2) {
        video.addEventListener(
          'loadeddata',
          () => {
            this.extractThumbnailFromElement(video, vlog);
          },
          { once: true }
        );
        return;
      }

      // Create canvas for thumbnail extraction
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Set canvas dimensions to match video (with max size for performance)
      const maxWidth = 320;
      const maxHeight = 180;
      const aspectRatio = video.videoWidth / video.videoHeight;

      if (aspectRatio > maxWidth / maxHeight) {
        canvas.width = maxWidth;
        canvas.height = maxWidth / aspectRatio;
      } else {
        canvas.height = maxHeight;
        canvas.width = maxHeight * aspectRatio;
      }

      // Try to seek to a good frame (1 second or 10% of duration, whichever is smaller)
      const seekTime = Math.min(1, video.duration * 0.1);
      video.currentTime = Math.max(0.1, seekTime);

      video.addEventListener(
        'seeked',
        () => {
          try {
            // Draw the current video frame to canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to base64 image
            const thumbnail = canvas.toDataURL('image/jpeg', 0.8);

            // Update vlog with thumbnail
            vlog.thumbnail = thumbnail;
            vlog.isLoading = false;
            vlog.hasError = false;

            this.cdr.detectChanges();

            // Clean up canvas
            canvas.remove();
          } catch (error) {
             this.tryFallbackThumbnail(vlog, videoSrc || '');
          }
        },
        { once: true }
      );

      // Add timeout in case seeking takes too long
      setTimeout(() => {
        if (vlog.isLoading) {
           this.onVideoError(vlog);
        }
      }, 5000);
    } catch (error) {
       this.onVideoError(vlog);
    }
  }

  onThumbnailLoad(vlog: ExtendedVlog) {
    vlog.isLoading = false;
    this.cdr.detectChanges();
  }

  onThumbnailError(vlog: ExtendedVlog) {
    this.onVideoError(vlog);
  }

  onVideoError(vlog: ExtendedVlog) {
    vlog.isLoading = false;
    vlog.hasError = true;
    vlog.thumbnail = this.defaultThumbnail;
    this.cdr.detectChanges();
  }

  private tryFallbackThumbnail(vlog: ExtendedVlog, videoSrc: string) {
    // Try to get thumbnail from known video services
    const fallbackThumbnail = this.getServiceThumbnail(videoSrc);

    if (fallbackThumbnail) {
      // Test if the thumbnail URL is accessible
      const img = new Image();
      img.onload = () => {
        vlog.thumbnail = fallbackThumbnail;
        vlog.isLoading = false;
        vlog.hasError = false;
        this.cdr.detectChanges();
      };
      img.onerror = () => {
        // Fallback to default thumbnail
        vlog.thumbnail = this.defaultThumbnail;
        vlog.isLoading = false;
        vlog.hasError = true;
        this.cdr.detectChanges();
      };
      img.src = fallbackThumbnail;
    } else {
      // No fallback available, use default
      vlog.thumbnail = this.defaultThumbnail;
      vlog.isLoading = false;
      vlog.hasError = true;
      this.cdr.detectChanges();
    }
  }

  private getServiceThumbnail(videoSrc: string): string | null {
    if (!videoSrc || videoSrc.trim() === '') {
      return null;
    }

    try {
      const url = new URL(videoSrc);

      // YouTube
      if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
        let videoId = '';
        if (url.hostname.includes('youtu.be')) {
          videoId = url.pathname.slice(1);
        } else if (url.pathname.includes('/watch')) {
          videoId = url.searchParams.get('v') || '';
        } else if (url.pathname.includes('/embed/')) {
          videoId = url.pathname.split('/embed/')[1];
        }

        if (videoId) {
          return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      }

      // Vimeo
      if (url.hostname.includes('vimeo.com')) {
        const videoId = url.pathname.split('/').pop();
        if (videoId && /^\d+$/.test(videoId)) {
          // Vimeo doesn't provide direct thumbnail URLs easily, so we'll use default
          return null;
        }
      }

      // For other sources, return null to use default thumbnail
      return null;
    } catch (error) {
       return null;
    }
  }

  openVideo(vlog: ExtendedVlog) {
    this.selectedVideo = vlog;

    // Focus management for accessibility
    if (typeof document !== 'undefined') {
      const modalElement = this.videoModal?.nativeElement;
      if (modalElement) {
        modalElement.focus();
      }
    }

    this.cdr.detectChanges();
  }

  closeVideo() {
    // Stop video playback if playing
    if (this.selectedVideo) {
      const videoElements = document.querySelectorAll(
        `video[data-vlog-id="${this.selectedVideo.id}"]`
      );
      videoElements.forEach((element) => {
        const video = element as HTMLVideoElement;
        video.pause();
        video.currentTime = 0;
      });
    }

    this.selectedVideo = null;
    this.cdr.detectChanges();
  }

  // Handle escape key to close modal
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.selectedVideo) {
      this.closeVideo();
    }
  }

  private cleanup() {
    // Clean up video elements
    this.videoElements.forEach((video, vlogId) => {
      video.pause();
      video.src = '';
      video.remove();
    });
    this.videoElements.clear();

    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  // Getter for template
  get vlogsWithThumbnails(): ExtendedVlog[] {
    return this.extendedVlogs;
  }
}
