import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { posts } from '../data/posts';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, ExternalLink, Maximize2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Helmet } from 'react-helmet-async';
import HlsVideoPlayer from '../components/HlsVideoPlayer';

export default function Post() {
  const { id } = useParams<{ id: string }>();
  const post = posts.find((p) => p.id === id);
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  React.useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullScreen]);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <h1 className="text-4xl font-bold">Post not found</h1>
        <Link to="/" className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    );
  }

  const isVideoCover = post.coverImage?.match(/\.(mp4|webm|m4v|ogv|mov|m3u8)$/i);
  const hasValidImageCover = post.coverImage && !post.coverImage.match(/\.(mp4|webm|m4v|ogv|mov|m3u8)$/i);
  const videoUrlToUse = post.videoUrl || (isVideoCover ? post.coverImage : undefined);

  return (
    <motion.article 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-5xl mx-auto"
    >
      <Helmet>
        <title>{post.title || 'Viral Video'} | Viral Hub</title>
        <meta name="description" content={post.excerpt || 'Watch the latest viral video on Viral Hub. Fast streaming and premium quality.'} />
        <meta name="keywords" content={`${post.title}, ${post.category}, sex video, porn video, vlxx, xvideo, viral video`} />
        <meta property="og:title" content={`${post.title} | Viral Hub`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={hasValidImageCover ? post.coverImage : ''} />
        <meta property="og:type" content="video.other" />
      </Helmet>
      {/* Header */}
      <header className="space-y-10 mb-16">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:opacity-70 transition-opacity mb-8">
          <ArrowLeft size={14} /> Back to Articles
        </Link>
        
        <div className="space-y-6">
          <h1 className="text-3xl md:text-6xl font-bold leading-[1] tracking-tight">
            {post.title}
          </h1>
        </div>
        
      </header>

      {/* Featured Image, Video or Web View */}
      <div className={cn(
        "relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10 border border-white/5 bg-[#1A1A1A] transition-all duration-500",
        isFullScreen 
          ? "fixed inset-0 z-[100] rounded-none h-screen w-screen" 
          : (post.displayMode === 'iframe' || (!post.displayMode && post.externalUrl)) ? "h-[85vh] min-h-[600px]" : "aspect-video md:aspect-[21/9]"
      )}>
        {(post.displayMode === 'iframe' || (!post.displayMode && post.externalUrl)) && post.externalUrl ? (
          <div className="w-full h-full flex flex-col">
            <div className="bg-[#1A1A1A]/80 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                  <div className="w-3 h-3 rounded-full bg-green-400/50" />
                </div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-4 truncate max-w-[200px]">
                  {post.externalUrl}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="px-4 py-2 bg-white/5 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center space-x-2"
                >
                  <span>{isFullScreen ? 'Exit Full' : 'Full Screen'}</span>
                  <Maximize2 size={12} />
                </button>
                <a 
                  href={post.externalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center space-x-2"
                >
                  <span>Open Original</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
            <iframe 
              src={post.externalUrl} 
              className="w-full flex-grow border-none"
              title={post.title}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        ) : (post.displayMode === 'video' || (!post.displayMode && videoUrlToUse)) && videoUrlToUse ? (
          <div className="w-full h-full relative">
            <HlsVideoPlayer 
              src={videoUrlToUse}
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted
              loop
              playsInline
              poster={hasValidImageCover ? post.coverImage : undefined}
              tracks={post.videoTracks}
              crossOrigin={post.videoConfig?.crossOrigin}
              ariaHidden={post.videoConfig?.ariaHidden}
              tabIndex={post.videoConfig?.tabIndex}
            />
          </div>
        ) : (
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      {/* Content */}
      <div className="mt-24 max-w-3xl mx-auto">
        <div className="markdown-body">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>
    </motion.article>
  );
}

