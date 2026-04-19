import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface VideoTrack {
  kind: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
  label: string;
  src: string;
  srclang: string;
  default?: boolean;
}

interface HlsVideoPlayerProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  poster?: string;
  tracks?: VideoTrack[];
  crossOrigin?: 'anonymous' | 'use-credentials';
  ariaHidden?: boolean;
  tabIndex?: number;
  startTime?: number;
}

const HlsVideoPlayer: React.FC<HlsVideoPlayerProps> = ({
  src,
  className,
  autoPlay = false,
  muted = false,
  loop = false,
  playsInline = true,
  controls = false,
  poster,
  tracks = [],
  crossOrigin,
  ariaHidden,
  tabIndex,
  startTime = 0,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls | null = null;
    let isMounted = true;

    const handlePlay = async () => {
      if (!isMounted || !video) return;
      
      try {
        if (startTime > 0) {
          video.currentTime = startTime;
        }
        await video.play();
      } catch (e) {
        if (e instanceof Error && e.name !== 'AbortError' && isMounted) {
          // Log only unexpected errors, ignore NotAllowedError which is common for multi-tab/blocked autoplay
          if (e.name !== 'NotAllowedError') {
            console.error("Auto-play failed:", e.message);
          }
        }
      }
    };

    const isHls = src.toLowerCase().includes('.m3u8');

    if (isHls) {
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay && isMounted) {
            handlePlay();
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari
        video.src = src;
        if (autoPlay) {
          video.addEventListener('loadedmetadata', handlePlay, { once: true });
        }
      }
    } else {
      // Standard video
      video.src = src;
      video.load(); // Explicitly call load
      if (autoPlay) {
        // Wait for enough data or metadata to be loaded before playing
        const onCanPlay = () => {
          if (isMounted) {
            handlePlay();
          }
          video.removeEventListener('canplay', onCanPlay);
        };
        video.addEventListener('canplay', onCanPlay);
      }
    }

    return () => {
      isMounted = false;
      if (hls) {
        hls.destroy();
      }
      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }
    };
  }, [src, autoPlay, startTime]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      controls={controls}
      poster={poster}
      crossOrigin={crossOrigin}
      aria-hidden={ariaHidden}
      tabIndex={tabIndex}
      preload="auto"
    >
      {tracks.map((track, index) => (
        <track
          key={index}
          kind={track.kind}
          label={track.label}
          src={track.src}
          srcLang={track.srclang}
          default={track.default}
        />
      ))}
    </video>
  );
};

export default HlsVideoPlayer;
