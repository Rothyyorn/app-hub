import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Globe, Search, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Explorer() {
  const [urlInput, setUrlInput] = useState('');
  const [activeUrl, setActiveUrl] = useState('');
  const [showFallback, setShowFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;
    
    let url = urlInput.trim();
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    setActiveUrl(url);
    setShowFallback(false);
    setIsLoading(true);
  };

  const proxyUrl = activeUrl ? `/api/proxy?url=${encodeURIComponent(activeUrl)}` : '';

  useEffect(() => {
    if (!activeUrl) return;
    const timer = setTimeout(() => {
      setShowFallback(true);
      setIsLoading(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [activeUrl]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setShowFallback(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] space-y-6">
      <Helmet>
        <title>SEC Explorer | Web Search</title>
      </Helmet>

      {/* Control Panel */}
      <div className="bg-[#121212] border border-white/5 p-6 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Globe size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Web Explorer</h2>
            <p className="text-[10px] uppercase font-bold tracking-widest text-white/30">Bypass restrictions & Browse</p>
          </div>
        </div>

        <form onSubmit={handleLoadUrl} className="relative group">
          <div className="absolute inset-0 bg-primary/5 blur-xl group-focus-within:bg-primary/10 transition-all rounded-2xl" />
          <div className="relative flex p-1.5 bg-black/40 border border-white/10 rounded-2xl focus-within:border-primary/50 transition-all items-center">
            <Search className="ml-4 text-white/20" size={18} />
            <input 
              type="text"
              placeholder="Paste link here (e.g., wikipedia.org)..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-grow bg-transparent border-none focus:ring-0 text-white px-4 py-3 placeholder:text-white/20 font-medium text-sm"
            />
            <button 
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-primary/20 flex items-center space-x-2"
            >
              <span>Load Page</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main Viewer Area */}
      <div className="flex-grow relative rounded-[2rem] overflow-hidden border border-white/5 bg-black/20 shadow-2xl">
        {activeUrl ? (
          <>
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                <RefreshCw className="text-primary animate-spin mb-4" size={32} />
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/40">Proxying Content...</p>
              </div>
            )}

            {showFallback && !isLoading && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-center bg-[#0D0D0D]/90 backdrop-blur-xl">
                 <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary mb-6">
                  <AlertCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Hard Block Detected</h3>
                <p className="text-white/40 text-sm max-w-sm mb-8 leading-relaxed">
                  This site uses advanced protection that blocks proxies. We recommend opening it directly.
                </p>
                <a 
                  href={activeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 px-8 py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:scale-105 transition-transform shadow-xl shadow-primary/20"
                >
                  <span>Launch External View</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            )}

            <iframe 
              key={proxyUrl}
              src={proxyUrl}
              onLoad={handleIframeLoad}
              className="w-full h-full border-none bg-white"
              title="Web Explorer View"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-storage-access-by-user-activation"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media;"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-6">
            <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center text-white/10 rotate-12">
              <Globe size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight text-white/60">Ready to Explore</h3>
              <p className="text-white/20 text-sm max-w-xs font-medium">Input a URL above to start browsing any website through our high-speed proxy hub.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AlertCircle({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
