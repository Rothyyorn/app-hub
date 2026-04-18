import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { bookmarks } from '../data/bookmarks';
import { ExternalLink, Globe, LayoutGrid, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Home() {
  const [activeUrl, setActiveUrl] = useState(bookmarks[0]?.url || '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Use our proxy to bypass X-Frame-Options
  const proxyUrl = `/api/proxy?url=${encodeURIComponent(activeUrl)}`;

  return (
    <div className="h-[calc(100vh-80px)] w-full bg-[#0D0D0D] flex overflow-hidden">
      <Helmet>
        <title>SEC | Web Hub</title>
        <meta name="description" content="Premium adult video hub and web explorer center." />
      </Helmet>

      {/* Quick Navigation Sidebar */}
      <div className={cn(
        "bg-[#111] border-r border-white/5 transition-all duration-500 ease-out flex flex-col relative z-20 shadow-2xl",
        isSidebarOpen ? "w-72" : "w-16"
      )}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          {isSidebarOpen && <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary/80">SEC Hub</span>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40 transition-colors ml-auto"
          >
            {isSidebarOpen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        <div className="flex-grow overflow-y-auto py-4 px-2 space-y-1">
          {bookmarks.map((site) => (
            <button
              key={site.url}
              onClick={() => setActiveUrl(site.url)}
              className={cn(
                "w-full flex items-center space-x-3 p-3 rounded-2xl transition-all group relative",
                activeUrl === site.url 
                  ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
                  : "text-white/40 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                activeUrl === site.url ? "bg-white/20" : "bg-black/40 border border-white/10"
              )}>
                <Globe size={14} />
              </div>
              
              {isSidebarOpen && (
                <div className="flex-grow text-left overflow-hidden">
                  <p className="text-xs font-bold truncate tracking-tight">{site.name}</p>
                  <p className="text-[9px] opacity-40 truncate lowercase">{site.url.replace('https://', '')}</p>
                </div>
              )}

              {isSidebarOpen && activeUrl === site.url && <ChevronRight size={14} className="opacity-40" />}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/5">
          <div className={cn(
            "p-3 rounded-2xl bg-white/5 flex items-center space-x-3 transition-opacity",
            !isSidebarOpen && "opacity-0"
          )}>
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <LayoutGrid size={14} />
            </div>
            <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
              SEC v1.4 Premium
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area (Embedded Viewer) */}
      <div className="flex-grow relative h-full bg-black">
        {/* URL Bar Overlay (Small/Minimal) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
           <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center space-x-3 shadow-2xl">
              <Globe size={12} className="text-primary" />
              <span className="text-[10px] font-medium text-white/60 tracking-tight">{activeUrl}</span>
              <a href={activeUrl} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
                <ExternalLink size={10} />
              </a>
           </div>
        </div>

        <iframe 
          key={proxyUrl}
          src={proxyUrl}
          className="w-full h-full border-none"
          title="Web Viewer"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-storage-access-by-user-activation"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media;"
        />
      </div>
    </div>
  );
}

