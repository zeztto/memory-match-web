import { useCallback, useRef, useState, useEffect } from 'react';
import {readStorage,writeStorage} from '@/lib/storage';

type SoundType = 'flip' | 'match' | 'fail' | 'victory';

interface UseSoundReturn {
  playSound: (type: SoundType) => void;
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
}

// Sound URLs - using Web Audio API with generated sounds for reliability
const SOUND_FREQUENCIES: Record<SoundType, { freq: number; duration: number; type: OscillatorType }> = {
  flip: { freq: 600, duration: 0.1, type: 'sine' },
  match: { freq: 800, duration: 0.2, type: 'sine' },
  fail: { freq: 300, duration: 0.3, type: 'square' },
  victory: { freq: 523, duration: 0.5, type: 'sine' }
};

export function useSound(): UseSoundReturn {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return readStorage('card-puzzle-muted') === 'true';
    }
    return false;
  });
  
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    writeStorage('card-puzzle-muted', String(isMuted));
  }, [isMuted]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;

    try {
      const ctx = getAudioContext();
      const config = SOUND_FREQUENCIES[type];
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = config.freq;
      oscillator.type = config.type;
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + config.duration);

      // Victory sound - play a little melody
      if (type === 'victory') {
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.3);
          osc.start(ctx.currentTime + i * 0.15);
          osc.stop(ctx.currentTime + i * 0.15 + 0.3);
        });
      }
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [isMuted, getAudioContext]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    setIsMuted(muted);
  }, []);

  return { playSound, isMuted, toggleMute, setMuted };
}
