import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { bookmarks } from '../data/bookmarks';
import { ExternalLink, Globe, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Home() {
  const [activeUrl] = useState(bookmarks[0]?.url || '');
  
  // Use our proxy to bypass X-Frame-Options
  const proxyUrl = `/api/proxy?url=${encodeURIComponent(activeUrl)}`;

  return (
    <div className="h-[calc(100vh-80px)] w-full bg-[#0D0D0D]">
      <Helmet>
        <title>SEC | Web Center</title>
        <meta name="description" content="Premium adult video hub and web explorer center." />
      </Helmet>

      {/* Embedded Web View (Via Proxy) */}
      <iframe 
        key={proxyUrl}
        src={proxyUrl}
        className="w-full h-full border-none bg-black"
        title="Web Viewer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-storage-access-by-user-activation"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media;"
      />
    </div>
  );
}

