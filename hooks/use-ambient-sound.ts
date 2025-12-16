'use client';

import { useEffect, useRef } from 'react';

export function useAmbientSound(
  shouldPlay: boolean = true,
  volume: number = 0.15,
  soundUrl: string = '/audio/Sunset-Landscape(chosic.com)_1764326307962.mp3'
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = document.createElement('audio');
      audio.src = soundUrl;
      audio.loop = true;
      audio.volume = volume;
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    audio.volume = volume;

    if (shouldPlay && audio.paused) {
      audio.play().catch(() => {
        // Autoplay might be blocked
      });
    } else if (!shouldPlay && !audio.paused) {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [shouldPlay, volume, soundUrl]);
}
