'use client';

import { useState, useEffect } from 'react';

export function useVoiceOver(instruction: string, autoPlay: boolean = true) {
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  useEffect(() => {
    if (autoPlay && voiceEnabled && instruction && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(instruction);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [instruction, autoPlay, voiceEnabled]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return { speak, voiceEnabled, setVoiceEnabled, stopVoice };
}
