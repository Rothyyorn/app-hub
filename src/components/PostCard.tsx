import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { ArrowRight } from 'lucide-react';
import HlsVideoPlayer from './HlsVideoPlayer';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (featured) {
    return (
      <Link 
        to={`/post/${post.id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative block overflow-hidden rounded-[1.5rem] bg-[#1A1A1A] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20 mb-16"
      >
        <div className="aspect-[21/9] overflow-hidden relative">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {isHovered && post.videoUrl && (
            <div className="absolute inset-0 z-10 animate-in fade-in duration-300">
              <HlsVideoPlayer 
                src={post.videoUrl}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                startTime={10}
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-20" />
        </div>
        <div className="absolute bottom-0 left-0 p-8 lg:p-16 w-full">
          <h2 className="text-base md:text-xl font-bold leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-white/60 text-[9px] mt-4 max-w-2xl line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {post.excerpt}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/post/${post.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative block overflow-hidden rounded-2xl bg-[#1A1A1A] transition-all duration-500 hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-primary/40"
    >
      <div className="aspect-[16/9] overflow-hidden relative">
        <img 
          src={post.coverImage} 
          alt={post.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {isHovered && post.videoUrl && (
          <div className="absolute inset-0 z-10 animate-in fade-in duration-300">
            <HlsVideoPlayer 
              src={post.videoUrl}
              className="w-full h-full object-cover scale-110"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              tracks={post.videoTracks}
              startTime={10}
            />
          </div>
        )}

        {/* Iframe fallback logic if needed, but primary focus is video hover */}
        {!post.videoUrl && (post.displayMode === 'iframe' || (!post.displayMode && post.externalUrl)) && post.externalUrl && (
          <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <iframe 
              src={post.externalUrl} 
              className="w-[200%] h-[200%] origin-top-left scale-50 border-none"
              title={post.title}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20" />
      </div>
      <div className="p-1.5">
        <h3 className="text-[9px] font-bold leading-tight text-white line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

