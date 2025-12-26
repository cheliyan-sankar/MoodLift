'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { AppFooter } from "@/components/app-footer";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useBreathingGuide, type BreathingCycle } from '@/hooks/use-breathing-guide';
import { useLogGameActivity } from '@/hooks/use-log-game-activity';

export default function AlternateNostrilBreathing() {
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [resetTrigger, setResetTrigger] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  const basePattern: BreathingCycle[] = [
    { phase: 'inhale', duration: 4, instruction: 'Breathe in through your left nostril' },
    { phase: 'hold', duration: 4, instruction: 'Hold your breath' },
    { phase: 'exhale', duration: 4, instruction: 'Exhale through your right nostril' },
    { phase: 'inhale', duration: 4, instruction: 'Breathe in through your right nostril' },
    { phase: 'hold', duration: 4, instruction: 'Hold your breath' },
    { phase: 'exhale', duration: 4, instruction: 'Exhale through your left nostril' },
  ];

  const { breathingCycles, totalDuration } = useMemo(() => {
    const totalSeconds = selectedDuration * 60;
    const cycleLength = basePattern.length;
    const phaseDuration = 4;
    const numCycles = Math.ceil(totalSeconds / (cycleLength * phaseDuration));
    
    let cycles: BreathingCycle[] = [];
    for (let i = 0; i < numCycles; i++) {
      cycles = cycles.concat(basePattern);
    }
    
    const duration = cycles.reduce((sum, c) => sum + c.duration, 0);
    return { breathingCycles: cycles, totalDuration: duration };
  }, [selectedDuration]);

  const guide = useBreathingGuide({
    cycles: breathingCycles,
    totalDuration: totalDuration,
    name: 'Alternate Nostril Breathing',
  });

  useLogGameActivity('Alternate Nostril Breathing', guide.isRunning);

  useEffect(() => {
    if (resetTrigger > 0) {
      guide.reset();
    }
  }, [resetTrigger]);

  useEffect(() => {
    if (!audioContextRef.current && typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  useEffect(() => {
    if (guide.isComplete) {
      playMeditationBell();
    }
  }, [guide.isComplete]);

  useEffect(() => {
    if (guide.isRunning && guide.cycleIndex > 0) {
      playDingSound();
    }
  }, [guide.cycleIndex, guide.isRunning]);

  const playDingSound = () => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const now = audioContext.currentTime;
    const duration = 0.15;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.type = 'sine';
    osc.frequency.value = 800;

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  };

  const getActiveNostril = () => {
    const cyclePos = guide.cycleIndex % 6;
    if (cyclePos === 0 || cyclePos === 1 || cyclePos === 2) return 'left';
    return 'right';
  };

  const getCurrentPhase = () => {
    const cyclePos = guide.cycleIndex % 6;
    if (cyclePos === 0 || cyclePos === 3) return 'inhale';
    if (cyclePos === 1 || cyclePos === 4) return 'hold';
    return 'exhale';
  };

  const getLeftNostrilLabel = () => {
    const cyclePos = guide.cycleIndex % 6;
    if (cyclePos === 0) return 'Inhale';
    if (cyclePos === 1) return 'Hold';
    if (cyclePos === 2) return 'Close';
    if (cyclePos === 3) return 'Close';
    if (cyclePos === 4) return 'Hold';
    if (cyclePos === 5) return 'Exhale';
    return 'Inhale';
  };

  const getRightNostrilLabel = () => {
    const cyclePos = guide.cycleIndex % 6;
    if (cyclePos === 0) return 'Close';
    if (cyclePos === 1) return 'Hold';
    if (cyclePos === 2) return 'Exhale';
    if (cyclePos === 3) return 'Inhale';
    if (cyclePos === 4) return 'Hold';
    if (cyclePos === 5) return 'Close';
    return 'Close';
  };

  const getPhaseColor = () => {
    const phase = getCurrentPhase();
    switch (phase) {
      case 'inhale':
        return 'from-purple-400 to-purple-500';
      case 'hold':
        return 'from-gray-300 to-gray-400';
      case 'exhale':
        return 'from-teal-400 to-emerald-500';
      default:
        return 'from-gray-300 to-gray-400';
    }
  };

  const formatSessionTime = () => {
    const remainingSeconds = Math.ceil(totalDuration * (1 - guide.progress / 100));
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const playMeditationBell = () => {
    if (!audioContextRef.current) return;

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.back()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs sm:text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div />
          </div>
        </div>
      </nav>

      <main className="flex-1 px-6 py-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl mx-auto text-center">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 w-full">Alternate Nostril Breathing</h1>
        <p className="text-sm text-gray-600 mb-12 w-full">A gentle <strong>Mindfulness-Based Stress Reduction (MBSR)</strong> technique to steady your breath and mind.</p>

        {/* Nostril Animation Container */}
        <div className="flex justify-center mb-12">
          <div className="relative rounded-lg" style={{ width: '300px', height: '300px' }}>
            {/* Nostril Circles - Top Center */}
            <div
              className="absolute inset-x-0 flex justify-center gap-8"
              style={{ top: '20px', zIndex: 10 }}
            >
              {/* Left Nostril Circle */}
              <div
                className="flex flex-col items-center transition-all duration-700"
              >
                <div
                  className={`w-32 h-32 rounded-full flex flex-col items-center justify-center font-bold text-white transition-all duration-700 ${
                    getActiveNostril() === 'left'
                      ? `bg-gradient-to-br ${getPhaseColor()} shadow-lg scale-110`
                      : 'bg-gray-300 shadow-sm'
                  }`}
                >
                  <div className="text-3xl">L</div>
                  <div className="text-sm">LEFT</div>
                </div>
                <p className="text-center text-sm font-semibold text-purple-600 mt-2">
                  {getLeftNostrilLabel()}
                </p>
              </div>

              {/* Right Nostril Circle */}
              <div
                className="flex flex-col items-center transition-all duration-700"
              >
                <div
                  className={`w-32 h-32 rounded-full flex flex-col items-center justify-center font-bold text-white transition-all duration-700 ${
                    getActiveNostril() === 'right'
                      ? `bg-gradient-to-br ${getPhaseColor()} shadow-lg scale-110`
                      : 'bg-gray-300 shadow-sm'
                  }`}
                >
                  <div className="text-3xl">R</div>
                  <div className="text-sm">RIGHT</div>
                </div>
                <p className="text-center text-sm font-semibold text-purple-600 mt-2">
                  {getRightNostrilLabel()}
                </p>
              </div>
            </div>

            {/* Timer - Below Circles */}
            <div
              className="absolute inset-x-0 flex flex-col items-center"
              style={{ bottom: '15px', zIndex: 5 }}
            >
              <p className="text-4xl font-bold text-purple-600">
                {formatSessionTime()}
              </p>
            </div>

          </div>
        </div>

        {/* Duration Selection */}
        <div className="flex gap-3 justify-center items-center mb-8">
          {[3, 5, 10, 15].map((minutes) => (
            <Button
              key={minutes}
              onClick={() => {
                if (selectedDuration !== minutes) {
                  setSelectedDuration(minutes);
                  setResetTrigger((prev) => prev + 1);
                }
              }}
              variant={selectedDuration === minutes ? 'default' : 'outline'}
              className={selectedDuration === minutes ? 
                'bg-purple-500 hover:bg-purple-600 text-white' : 
                'border-purple-300 text-purple-600 hover:bg-purple-50'}
              disabled={guide.isRunning}
            >
              {minutes}m
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-2 sm:gap-4 justify-center items-center flex-wrap mb-12">
          {!guide.isRunning ? (
            <Button
              onClick={guide.start}
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg px-8 flex-1 sm:flex-none min-w-fit"
            >
              Start
            </Button>
          ) : (
            <Button
              onClick={guide.pause}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg px-8 flex-1 sm:flex-none min-w-fit"
            >
              Pause
            </Button>
          )}

          <Button
            onClick={() => setResetTrigger((prev) => prev + 1)}
            size="lg"
            variant="outline"
            className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 flex-1 sm:flex-none min-w-fit"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Completion Message */}
        {guide.isComplete && (
          <div className="bg-green-100 border-2 border-green-400 rounded-lg p-6 max-w-md mx-auto mb-8">
            <p className="text-2xl font-bold text-green-700 mb-2">✓ Complete</p>
            <p className="text-green-600 text-sm">
              You&apos;ve completed alternate nostril breathing. This ancient yogic technique balances your nervous system.
            </p>
          </div>
        )}

        {/* Game Information Section */}
        <div className="max-w-4xl w-full mt-12 space-y-8">
          {/* Description */}
          <div className="bg-white rounded-lg border-2 border-purple-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">About This Practice</h2>
            <p className="text-gray-700 leading-relaxed">
              Alternate Nostril Breathing, also known as Nadi Shodhana, is an ancient yogic breathing technique that harmonizes the nervous system. This practice alternates breathing through the left and right nostrils to balance the two hemispheres of your brain and activate your parasympathetic nervous system, promoting deep relaxation and mental clarity.
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-lg border-2 border-purple-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-purple-500 font-bold">1.</span>
                <span className="text-gray-700">Close your right nostril with your thumb and breathe in through your left nostril</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-500 font-bold">2.</span>
                <span className="text-gray-700">Hold your breath briefly while both nostrils are closed</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-500 font-bold">3.</span>
                <span className="text-gray-700">Close your left nostril and exhale through your right nostril</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-500 font-bold">4.</span>
                <span className="text-gray-700">Repeat this pattern, continuing to alternate sides</span>
              </li>
            </ul>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-lg border-2 border-purple-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-purple-900 font-semibold">Balances Brain Hemispheres</p>
                <p className="text-purple-800 text-sm mt-1">Harmonizes the left and right sides of your brain for improved mental balance</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-purple-900 font-semibold">Reduces Stress & Anxiety</p>
                <p className="text-purple-800 text-sm mt-1">Activates your parasympathetic nervous system for deep relaxation</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-purple-900 font-semibold">Enhances Mental Clarity</p>
                <p className="text-purple-800 text-sm mt-1">Improves focus and mental sharpness through synchronized breathing</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-purple-900 font-semibold">Promotes Better Sleep</p>
                <p className="text-purple-800 text-sm mt-1">Regular practice can help calm your mind before bedtime</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
