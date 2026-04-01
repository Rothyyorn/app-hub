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
  externalUrl?: string;
  displayMode?: 'video' | 'iframe' | 'image';
}
