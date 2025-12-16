'use client';

import { useEffect, useRef, useCallback } from 'react';

export function useBackgroundMusic(
  shouldPlay: boolean = true,
  volume: number = 0.25
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInitializedRef = useRef(false);

  const createAudio = useCallback(() => {
    if (isInitializedRef.current) return audioRef.current;
    
    const audio = document.createElement('audio');
    audio.src = 'https://media.soundcloud.com/soundcloud-mixes';
    audio.loop = true;
    audio.volume = volume;
    audio.setAttribute('crossOrigin', 'anonymous');
    audio.preload = 'auto';
    audioRef.current = audio;
    isInitializedRef.current = true;
    return audio;
  }, [volume]);

  useEffect(() => {
    const audio = createAudio();
    if (!audio) return;

    audio.volume = volume;

    if (shouldPlay && audio.paused) {
      audio.play().catch(() => {
        // Autoplay might be blocked
      });
    } else if (!shouldPlay && !audio.paused) {
      audio.pause();
    }

    return () => {
      if (audio && !shouldPlay) {
        audio.pause();
      }
    };
  }, [shouldPlay, volume, createAudio]);
}
