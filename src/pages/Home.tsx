import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { bookmarks } from '../data/bookmarks';

export default function Home() {
  const [activeUrl] = useState(bookmarks[0]?.url || '');

  return (
    <div className="h-[calc(100vh-80px)] w-full bg-[#0D0D0D]">
      <Helmet>
        <title>Viral Hub | Web Center</title>
        <meta name="description" content="Explore viral content and the web directly from the Hub." />
      </Helmet>

      {/* Iframe Content */}
      <iframe 
        key={activeUrl}
        src={activeUrl}
        className="w-full h-full border-none shadow-2xl"
        title="Web Explorer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}

