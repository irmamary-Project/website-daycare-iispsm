"use client";

import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';

interface CCTVPlayerProps {
  src: string;
}

const CCTVPlayer: React.FC<CCTVPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }
  }, [src]);

  return (
    <video controls ref={videoRef} className="w-full h-full object-cover rounded-lg"></video>
  );
};

export default CCTVPlayer;
