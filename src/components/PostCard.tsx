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
        className="group relative block overflow-hidden rounded-xl bg-[#111] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20 mb-8"
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
        <div className="absolute bottom-0 left-0 p-4 lg:p-8 w-full">
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
      className="group relative block overflow-hidden rounded-lg bg-[#111] transition-all duration-500 hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-primary/40"
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20" />
      </div>
      <div className="p-0.5">
        <h3 className="text-[10px] font-bold leading-tight text-white line-clamp-1 truncate group-hover:text-primary transition-colors">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

