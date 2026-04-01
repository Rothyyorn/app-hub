import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Post } from '../types';
import { ArrowRight } from 'lucide-react';

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
      <div className="aspect-[16/9] overflow-hidden">
        <img 
          src={post.coverImage} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="absolute bottom-0 left-0 p-4 w-full translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <h3 className="text-sm font-bold leading-tight text-white line-clamp-1">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

