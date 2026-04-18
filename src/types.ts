export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
  coverImage: string;
  videoUrl?: string;
  videoTracks?: {
    kind: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
    label: string;
    src: string;
    srclang: string;
    default?: boolean;
  }[];
  videoConfig?: {
    crossOrigin?: 'anonymous' | 'use-credentials';
    ariaHidden?: boolean;
    tabIndex?: number;
    preload?: 'auto' | 'metadata' | 'none';
  };
  externalUrl?: string;
  displayMode?: 'video' | 'iframe' | 'image';
}
