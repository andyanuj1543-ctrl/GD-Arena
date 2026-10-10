import React, { useState, useRef, useEffect } from 'react';

interface VideoBackgroundProps {
  src: string;
  poster?: string;
  overlayClass?: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  poster,
  overlayClass = 'bg-black/50',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, [src]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-stone-950">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-80'
        }`}
      />
      <div className={`absolute inset-0 pointer-events-none ${overlayClass}`} />
    </div>
  );
};

export default VideoBackground;
