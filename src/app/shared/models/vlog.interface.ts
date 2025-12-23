export interface Vlog {
  id: number;
  title: string;
  description?: string;
  video_url?: string;
  videoUrl?: string; // Backward compatibility
  thumbnail_url?: string;
  created_at?: string;
  updated_at?: string;
  duration?: string; // Backward compatibility
  link?: string; // Backward compatibility
  playIcon?: string; // Backward compatibility
  thumbnail?: string;
  isLoading?: boolean; // UI state for thumbnail loading
  hasError?: boolean; // UI state for thumbnail error
}

export interface VlogResponse {
  status: boolean;
  message: string;
  data: {
    items: {
      [key: string]: Vlog;
    };
  };
}
