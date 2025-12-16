'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AppFooter } from "@/components/app-footer";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useBackgroundMusic } from '@/hooks/use-background-music';

export default function BoxBreathing() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionTime, setSessionTime] = useState(120); // Start at 2 minutes (default)
  const [phase, setPhase] = useState<'inhale' | 'hold-in' | 'exhale' | 'hold-out'>('inhale');
  const [ballPosition, setBallPosition] = useState({ x: -138, y: -138 });
  const [selectedDuration, setSelectedDuration] = useState(2); // 2, 3, or 5 minutes
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useBackgroundMusic(true, 0.25);

  const SPEED = 70; // pixels per second
  const CONTAINER_SIZE = 300;
  const PHASE_DURATION = CONTAINER_SIZE / SPEED; // ~4.286 seconds
  const CYCLE_DURATION = PHASE_DURATION * 4; // One complete cycle
  const TOTAL_DURATION = selectedDuration * 60; // Convert minutes to seconds
  const HALF_CONTAINER = CONTAINER_SIZE / 2;

  useEffect(() => {
    if (!audioContextRef.current && typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const playMovementSound = () => {
    if (!soundEnabled || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const now = audioContext.currentTime;

    const bufferSize = audioContext.sampleRate * 0.4;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }

    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1500;

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.05, now + 0.35);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.4);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 0.4);
  };

  const playMeditationBell = () => {
    if (!soundEnabled || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const now = audioContext.currentTime;
    const duration = 1.8;

    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.connect(gain1);
    gain1.connect(audioContext.destination);

    osc1.type = 'sine';
    osc1.frequency.value = 400;

    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.02, now + 0.1);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.start(now);
    osc1.stop(now + duration);

    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);

    osc2.type = 'sine';
    osc2.frequency.value = 600;

    gain2.gain.setValueAtTime(0.1, now);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.0005, now + duration);

    osc2.start(now);
    osc2.stop(now + duration);
  };

  const playInhaleSound = () => {
    if (!soundEnabled || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const now = audioContext.currentTime;
    const duration = 2.5;

    const bufferSize = audioContext.sampleRate * duration;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }

    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;
    filter.Q.value = 0.5;

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.5);
    gainNode.gain.linearRampToValueAtTime(0.08, now + duration);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration);
  };

  const playExhaleSound = () => {
    if (!soundEnabled || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const now = audioContext.currentTime;
    const duration = 3;

    const bufferSize = audioContext.sampleRate * duration;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }

    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 600;
    filter.Q.value = 0.5;

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.linearRampToValueAtTime(0.14, now + 0.8);
    gainNode.gain.linearRampToValueAtTime(0.02, now + duration);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration);
  };

  const BALL_RADIUS = 12;
  const MAX_DISTANCE = HALF_CONTAINER - BALL_RADIUS;

  const calculateBallPosition = (timeInCycle: number, phaseIndex: number) => {
    const phaseTime = timeInCycle % PHASE_DURATION;
    const progress = phaseTime / PHASE_DURATION;

    let x: number, y: number;

    if (phaseIndex === 0) {
      x = -MAX_DISTANCE + ((MAX_DISTANCE * 2) * progress);
      y = -MAX_DISTANCE;
    } else if (phaseIndex === 1) {
      x = MAX_DISTANCE;
      y = -MAX_DISTANCE + ((MAX_DISTANCE * 2) * progress);
    } else if (phaseIndex === 2) {
      x = MAX_DISTANCE - ((MAX_DISTANCE * 2) * progress);
      y = MAX_DISTANCE;
    } else {
      x = -MAX_DISTANCE;
      y = MAX_DISTANCE - ((MAX_DISTANCE * 2) * progress);
    }

    return { x, y };
  };

  const updatePhase = (timeInCycle: number) => {
    const phaseIndex = Math.floor(timeInCycle / PHASE_DURATION) % 4;
    const newPhase: 'inhale' | 'hold-in' | 'exhale' | 'hold-out' =
      phaseIndex === 0 ? 'inhale' :
      phaseIndex === 1 ? 'hold-in' :
      phaseIndex === 2 ? 'exhale' :
      'hold-out';

    if (newPhase !== phase) {
      setPhase(newPhase);
      playMeditationBell();
    }

    const position = calculateBallPosition(timeInCycle, phaseIndex);
    setBallPosition(position);
  };

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSessionTime((prev) => {
        const newTime = prev - 1;

        if (newTime <= 0) {
          setIsRunning(false);
          return 0;
        }

        const timeInCycle = (TOTAL_DURATION - newTime) % (PHASE_DURATION * 4);
        updatePhase(timeInCycle);

        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, phase, updatePhase]);

  const phaseLabel = {
    inhale: 'Breathe In',
    'hold-in': 'Hold',
    exhale: 'Breathe Out',
    'hold-out': 'Hold',
  };

  const handleStart = () => {
    setIsRunning(true);
    if (sessionTime === TOTAL_DURATION) {
      setPhase('inhale');
      setBallPosition({ x: -MAX_DISTANCE, y: -MAX_DISTANCE });
      playMeditationBell();
    }
  };

  const handleReset = () => {
    setSessionTime(TOTAL_DURATION);
    setIsRunning(false);
    setPhase('inhale');
    setBallPosition({ x: -138, y: -138 });
  };

  const handleDurationSelect = (minutes: number) => {
    if (!isRunning) {
      setSelectedDuration(minutes);
      setSessionTime(minutes * 60);
      setIsRunning(false);
      setPhase('inhale');
      setBallPosition({ x: -138, y: -138 });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col items-center justify-center px-6 py-12 relative">
      {/* Header */}
      <div className="absolute top-6 left-6">
        <Button onClick={() => router.back()} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
          Back
        </Button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-3xl mx-auto text-center pt-14 md:pt-0">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 w-full">Box Breathing</h1>
        <p className="text-sm text-gray-600 mb-12 w-full">A simple breathing technique supported by <span className="font-bold">Cognitive Behavioral Therapy (CBT)</span> principles to help reduce stress.</p>

        {/* Box Breathing Animation */}
        <div className="flex justify-center mb-12">
          <div className="relative" style={{ width: '300px', height: '300px' }}>
            {/* Box outline with glow */}
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                border: '3px solid rgba(168, 85, 247, 0.8)',
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.4), inset 0 0 20px rgba(236, 72, 153, 0.1)',
              }}
            />

            {/* Timer and Phase Label - Center */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              style={{ zIndex: 5 }}
            >
              <p className="text-3xl font-bold text-purple-600">
                {formatTime(sessionTime)}
              </p>
              <p className="text-xl font-medium text-gray-600">
                {isRunning ? phaseLabel[phase] : 'Ready'}
              </p>
            </div>

            {/* Moving ball */}
            <div
              className="absolute w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full transition-all"
              style={{
                left: `calc(50% + ${ballPosition.x}px - 12px)`,
                top: `calc(50% + ${ballPosition.y}px - 12px)`,
                transitionDuration: isRunning ? `${PHASE_DURATION}s` : '0s',
                transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                boxShadow: '0 0 15px rgba(168, 85, 247, 0.8), 0 0 25px rgba(236, 72, 153, 0.6)',
                zIndex: 10,
              }}
            />
          </div>
        </div>


        {/* Timer Selection */}
        <div className="flex gap-3 justify-center items-center mb-8">
          {[2, 3, 5].map((minutes) => (
            <Button
              key={minutes}
              onClick={() => handleDurationSelect(minutes)}
              variant={selectedDuration === minutes ? 'default' : 'outline'}
              className={selectedDuration === minutes ? 
                'bg-purple-500 hover:bg-purple-600 text-white' : 
                'border-purple-300 text-purple-600 hover:bg-purple-50'}
              disabled={isRunning}
            >
              {minutes}m
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-2 sm:gap-4 justify-center items-center flex-wrap mb-12">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg px-8 flex-1 sm:flex-none min-w-fit"
            >
              Begin
            </Button>
          ) : (
            <Button
              onClick={() => setIsRunning(false)}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg px-8 flex-1 sm:flex-none min-w-fit"
            >
              Pause
            </Button>
          )}

          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 flex-1 sm:flex-none min-w-fit"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Information Section */}
        <div className="max-w-2xl mx-auto pt-12 border-t border-gray-200">
          <div className="space-y-8">
            {/* What is Box Breathing */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Box Breathing?</h2>
              <p className="text-gray-700 leading-relaxed">
                Box breathing is a powerful breathing technique that follows a simple 4-4-4-4 pattern: breathe in for 4 seconds, hold for 4 seconds, breathe out for 4 seconds, and hold for 4 seconds. This rhythmic pattern helps regulate your nervous system and brings balance to your mind and body. It's commonly used by athletes, military personnel, and wellness practitioners to manage stress and improve focus.
              </p>
            </div>

            {/* How It Works */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  <span className="font-semibold text-purple-600">Breathe In (4 seconds):</span> Slowly inhale through your nose, expanding your diaphragm and filling your lungs with fresh oxygen.
                </p>
                <p className="leading-relaxed">
                  <span className="font-semibold text-purple-600">Hold (4 seconds):</span> Hold your breath to allow oxygen to circulate through your body, activating the parasympathetic nervous system.
                </p>
                <p className="leading-relaxed">
                  <span className="font-semibold text-purple-600">Breathe Out (4 seconds):</span> Gently exhale through your mouth, releasing tension and stress from your body.
                </p>
                <p className="leading-relaxed">
                  <span className="font-semibold text-purple-600">Hold (4 seconds):</span> Hold before beginning the cycle again, allowing your body to settle into a calm state.
                </p>
              </div>
            </div>

            {/* Benefits & Mood Uplift */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits & Mood Uplift</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="font-semibold text-purple-700 mb-2">✨ Reduces Anxiety</p>
                  <p className="text-gray-700 text-sm">Activates your vagus nerve, triggering a relaxation response and calming anxious thoughts.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="font-semibold text-purple-700 mb-2">🧠 Enhances Focus</p>
                  <p className="text-gray-700 text-sm">Increases oxygen flow to your brain, sharpening mental clarity and concentration.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="font-semibold text-purple-700 mb-2">💪 Lowers Stress</p>
                  <p className="text-gray-700 text-sm">Reduces cortisol levels and promotes a sense of calm throughout your body.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="font-semibold text-purple-700 mb-2">😊 Uplifts Mood</p>
                  <p className="text-gray-700 text-sm">Regular practice releases endorphins and serotonin, naturally boosting your emotional well-being.</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mt-4">
                By practicing box breathing regularly, you train your nervous system to respond calmly to stress. Just a few minutes of this exercise can shift your mood, reduce overwhelm, and help you find peace amidst life's chaos. Make it a daily habit to experience lasting improvements in your emotional resilience and overall well-being.
              </p>
            </div>
          </div>
        </div>

      </div>
    <AppFooter />
    </div>
  );
}
