import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Post } from '../types';
import { ArrowRight } from 'lucide-react';
import HlsVideoPlayer from './HlsVideoPlayer';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <Link 
        to={`/post/${post.id}`}
        className="group relative block overflow-hidden rounded-[2.5rem] bg-[#1A1A1A] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20 mb-16"
      >
        <div className="aspect-[21/9] overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 p-8 lg:p-16 w-full">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-white/60 text-lg mt-4 max-w-2xl line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {post.excerpt}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/post/${post.id}`}
      className="group relative block overflow-hidden rounded-2xl bg-[#1A1A1A] transition-all duration-500 hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-primary/40"
    >
      <div className="aspect-[16/9] overflow-hidden relative">
        {(post.displayMode === 'iframe' || (!post.displayMode && post.externalUrl && !post.videoUrl)) && post.externalUrl ? (
          <div className="w-full h-full pointer-events-none">
            <iframe 
              src={post.externalUrl} 
              className="w-[200%] h-[200%] origin-top-left scale-50 border-none"
              title={post.title}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : (post.displayMode === 'video' || (!post.displayMode && post.videoUrl)) && post.videoUrl ? (
          <HlsVideoPlayer 
            src={post.videoUrl}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            autoPlay
            muted
            loop
            playsInline
            poster={post.coverImage}
          />
        ) : (
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-bold leading-tight text-white line-clamp-1 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-primary transition-colors">
          <span>View Details</span>
          <ArrowRight size={12} className="ml-2 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

