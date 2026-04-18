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
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isMounted = true;

    const handlePlay = async () => {
      if (!isMounted || !video) return;
      try {
        await video.play();
      } catch (e) {
        // Only log if it's not the interruption error which is expected on unmount
        if (e instanceof Error && e.name !== 'AbortError' && isMounted) {
          console.error("Auto-play failed:", e);
        }
      }
    };

    if (src.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) {
            handlePlay();
          }
        });

        return () => {
          isMounted = false;
          hls.destroy();
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari
        video.src = src;
        if (autoPlay) {
          handlePlay();
        }
      }
    } else {
      // Standard video
      video.src = src;
      if (autoPlay) {
        handlePlay();
      }
    }

    return () => {
      isMounted = false;
    };
  }, [src, autoPlay]);

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
