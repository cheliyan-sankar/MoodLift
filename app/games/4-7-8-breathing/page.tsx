'use client';

import { useState, useEffect, useRef } from 'react';
import { AppFooter } from "@/components/app-footer";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useBackgroundMusic } from '@/hooks/use-background-music';

type Phase = 'inhale' | 'hold' | 'exhale' | 'complete';

export default function Breathing478() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState(2); // in minutes
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<Phase>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);
  const [orbSize, setOrbSize] = useState(100);
  const [glowIntensity, setGlowIntensity] = useState(0.6);
  const [showCompletion, setShowCompletion] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseRef = useRef<Phase>('inhale');
  const timeRef = useRef(0);
  const cycleRef = useRef(0);
  const sessionStartRef = useRef(0);
  const sessionDurationSecondsRef = useRef(0);

  useBackgroundMusic(true, 0.25);

  // Breathing pattern configuration
  const breathingPattern = {
    inhale: 4,
    hold: 7,
    exhale: 8,
  };
  
  const cycleDuration = breathingPattern.inhale + breathingPattern.hold + breathingPattern.exhale; // 19 seconds
  const totalCycles = Math.floor((selectedDuration * 60) / cycleDuration);
  
  const config = {
    cycles: totalCycles,
    inhale: breathingPattern.inhale,
    hold: breathingPattern.hold,
    exhale: breathingPattern.exhale,
  };

  useEffect(() => {
    if (!audioContextRef.current && typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const playAmbientSound = (duration: number, frequency: number = 440) => {
    if (!soundEnabled || !audioContextRef.current) return;

    try {
      const audioContext = audioContextRef.current;
      const now = audioContext.currentTime;

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.type = 'sine';
      osc.frequency.value = frequency;

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.1, now + duration * 0.3);
      gain.gain.linearRampToValueAtTime(0.05, now + duration * 0.7);
      gain.gain.linearRampToValueAtTime(0, now + duration);

      osc.start(now);
      osc.stop(now + duration);
    } catch (error) {
      console.error('Audio error:', error);
    }
  };

  const handleDurationSelect = (minutes: number) => {
    if (!isRunning) {
      setSelectedDuration(minutes);
    }
  };

  const startBreathing = () => {
    setIsRunning(true);
    phaseRef.current = 'inhale';
    timeRef.current = 0;
    cycleRef.current = 0;
    setCyclesCompleted(0);
    setShowCompletion(false);
    setCurrentPhase('inhale');
    setPhaseTime(0);
    sessionStartRef.current = Date.now();
    sessionDurationSecondsRef.current = selectedDuration * 60;
  };

  const resetBreathing = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setCyclesCompleted(0);
    setCurrentPhase('inhale');
    setPhaseTime(0);
    setShowCompletion(false);
    setOrbSize(100);
    setGlowIntensity(0.6);
    phaseRef.current = 'inhale';
    timeRef.current = 0;
    cycleRef.current = 0;
  };

  // Main breathing cycle
  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      timeRef.current += 0.1;
      
      let phaseDuration = 0;
      let nextPhase: Phase | null = null;

      // Determine phase duration
      if (phaseRef.current === 'inhale') {
        phaseDuration = config.inhale;
      } else if (phaseRef.current === 'hold') {
        phaseDuration = config.hold;
      } else if (phaseRef.current === 'exhale') {
        phaseDuration = config.exhale;
      }

      // Update orb and glow based on phase
      if (phaseRef.current === 'inhale') {
        const progress = Math.min(timeRef.current / config.inhale, 1);
        setOrbSize(100 + progress * 50);
        setGlowIntensity(0.6 + progress * 0.4);
        playAmbientSound(0.1, 320 + progress * 80);
      } else if (phaseRef.current === 'hold') {
        setOrbSize(150);
        setGlowIntensity(1);
      } else if (phaseRef.current === 'exhale') {
        const progress = Math.min(timeRef.current / config.exhale, 1);
        setOrbSize(150 - progress * 50);
        setGlowIntensity(1 - progress * 0.4);
        playAmbientSound(0.1, 400 - progress * 80);
      }

      setPhaseTime(timeRef.current);

      // Check if phase complete
      if (timeRef.current >= phaseDuration) {
        timeRef.current = 0;

        if (phaseRef.current === 'inhale') {
          phaseRef.current = 'hold';
          nextPhase = 'hold';
        } else if (phaseRef.current === 'hold') {
          phaseRef.current = 'exhale';
          nextPhase = 'exhale';
        } else if (phaseRef.current === 'exhale') {
          cycleRef.current += 1;
          setCyclesCompleted(cycleRef.current);

          // Check if session duration is complete
          const elapsedSeconds = (Date.now() - sessionStartRef.current) / 1000;
          if (elapsedSeconds >= sessionDurationSecondsRef.current) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsRunning(false);
            setShowCompletion(true);
            setCurrentPhase('complete');
            return;
          }

          phaseRef.current = 'inhale';
          nextPhase = 'inhale';
        }

        if (nextPhase) {
          setCurrentPhase(nextPhase);
        }
      }
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, soundEnabled]);

  const phaseLabels = {
    inhale: 'Inhale',
    hold: 'Hold',
    exhale: 'Exhale',
    complete: 'Complete',
  };

  const phaseDurations = {
    inhale: config.inhale,
    hold: config.hold,
    exhale: config.exhale,
    complete: 0,
  };

  // Completion Screen
  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col items-center justify-center px-6 py-12 relative">
        <div className="absolute top-6 left-6">
          <Button onClick={() => router.back()} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
            Back
          </Button>
        </div>

        <div className="w-full max-w-3xl mx-auto pt-14 md:pt-0">
          <div className="text-center mb-12">
            <div className="text-7xl mb-6">✨</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Well Done
            </h1>
            <p className="text-lg text-gray-600">
              Your body is calmer now. You completed {cyclesCompleted} breathing cycles.
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-12">
            <Button
              size="lg"
              onClick={startBreathing}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 transition-opacity text-white py-6 text-lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Repeat
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full text-slate-700 py-6"
            >
              Continue
            </Button>
          </div>

          <div className="max-w-2xl mx-auto pt-12 border-t border-gray-200">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What is 4-7-8 Breathing?</h2>
                <p className="text-gray-700 leading-relaxed">
                  4-7-8 breathing is a Pranayama-based mindfulness technique backed by relaxation response science. This powerful breathing pattern follows a 4-7-8 rhythm: inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds. The extended exhale activates your <span className="font-bold">parasympathetic nervous system</span>, shifting your body from stress mode to calm mode.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    <span className="font-semibold text-cyan-600">Inhale (4 seconds):</span> Breathe in slowly through your nose, filling your lungs completely with fresh oxygen.
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-semibold text-cyan-600">Hold (7 seconds):</span> Retain your breath gently, allowing oxygen to circulate and calm your nervous system.
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-semibold text-cyan-600">Exhale (8 seconds):</span> Slowly release your breath through your mouth with a sigh, letting tension flow out of your body.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits & Mood Uplift</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-cyan-50 p-4 rounded-lg">
                    <p className="font-semibold text-cyan-700 mb-2">😌 Reduces Anxiety</p>
                    <p className="text-gray-700 text-sm">The extended exhale activates your vagus nerve, triggering immediate calming responses.</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-blue-700 mb-2">😴 Improves Sleep</p>
                    <p className="text-gray-700 text-sm">Regular practice helps regulate your sleep-wake cycle and promotes deeper rest.</p>
                  </div>
                  <div className="bg-cyan-50 p-4 rounded-lg">
                    <p className="font-semibold text-cyan-700 mb-2">💭 Enhances Focus</p>
                    <p className="text-gray-700 text-sm">Calming your nervous system increases mental clarity and concentration.</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-blue-700 mb-2">🧘 Deepens Mindfulness</p>
                    <p className="text-gray-700 text-sm">Regular practice builds your ability to stay present and aware.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AppFooter />
      </div>
    );
  }

  // Main Breathing Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="absolute top-6 left-6">
        <Button onClick={() => router.back()} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
          Back
        </Button>
      </div>

      <div className="max-w-3xl w-full text-center pt-12 md:pt-0">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">4-7-8 Breathing</h1>
        <p className="text-xs md:text-sm text-gray-600 mb-2">A soothing Pranayama-inspired <span className="font-bold">Breathwork and Somatic Regulation</span> approach that gently slows your breathing rhythm to calm your body and quiet the mind.</p>

        {/* Glowing Orb */}
        <div className="flex justify-center mb-2">
          <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full transition-all duration-100"
              style={{
                background: `radial-gradient(circle, rgba(110, 207, 246, ${glowIntensity * 0.3}), rgba(126, 141, 247, ${glowIntensity * 0.15}), transparent)`,
                filter: `blur(40px)`,
              }}
            />

            <div
              className="relative rounded-full transition-all duration-100"
              style={{
                width: `${orbSize}px`,
                height: `${orbSize}px`,
                background: `radial-gradient(circle at 30% 30%, rgba(163, 218, 255, ${glowIntensity}), rgba(126, 141, 247, ${glowIntensity * 0.8}), rgba(110, 207, 246, ${glowIntensity * 0.6}))`,
                boxShadow: `
                  0 0 20px rgba(110, 207, 246, ${glowIntensity * 0.8}),
                  0 0 40px rgba(126, 141, 247, ${glowIntensity * 0.6}),
                  inset -20px -20px 40px rgba(0, 0, 0, ${glowIntensity * 0.1}),
                  inset 10px 10px 30px rgba(255, 255, 255, ${glowIntensity * 0.3})
                `,
              }}
            />

            {isRunning && (
              <>
                <div
                  className="absolute rounded-full border-2 border-cyan-400"
                  style={{
                    width: `${orbSize + 30}px`,
                    height: `${orbSize + 30}px`,
                    opacity: 0.3,
                    animation: `pulse 2s ease-out infinite`,
                  }}
                />
                <div
                  className="absolute rounded-full border border-blue-300"
                  style={{
                    width: `${orbSize + 60}px`,
                    height: `${orbSize + 60}px`,
                    opacity: 0.2,
                    animation: `pulse 3s ease-out infinite`,
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* Phase Info */}
        <div className="mb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-0">
            {phaseLabels[currentPhase]}
          </h2>
          <p className="text-base md:text-lg text-cyan-600 font-semibold">
            {phaseDurations[currentPhase]}s
          </p>
          {!isRunning && !showCompletion && (
            <p className="text-xs text-gray-500 mt-1">
              Select your session duration and click Begin to start.
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div className="mb-12 flex justify-center">
            <div className="w-full max-w-xs">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-100"
                  style={{ width: `${Math.min((phaseTime / phaseDurations[currentPhase]) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Cycle {cyclesCompleted + 1} of {config.cycles}
              </p>
            </div>
          </div>
        )}

        {/* Session Duration Selection */}
        {!isRunning && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-700 mb-1">Duration:</p>
            <div className="flex gap-1 md:gap-3 justify-center flex-wrap">
              {[2, 3, 5].map((minutes) => {
                const cyclesForDuration = Math.floor((minutes * 60) / cycleDuration);
                return (
                  <Button
                    key={minutes}
                    onClick={() => handleDurationSelect(minutes)}
                    variant={selectedDuration === minutes ? 'default' : 'outline'}
                    className={
                      selectedDuration === minutes
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white'
                        : 'border-cyan-300 text-cyan-600 hover:bg-cyan-50'
                    }
                  >
                    {minutes}m (~{cyclesForDuration} cycles)
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2 md:gap-4 justify-center items-center flex-wrap mb-6 md:mb-12">
          {!isRunning ? (
            <Button
              onClick={startBreathing}
              size="sm"
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white shadow-lg md:size-lg md:px-8"
            >
              Begin
            </Button>
          ) : (
            <Button
              onClick={() => setIsRunning(false)}
              size="sm"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg md:size-lg md:px-8"
            >
              Pause
            </Button>
          )}

          <Button
            onClick={resetBreathing}
            variant="outline"
            size="sm"
            className="border-2 border-cyan-300 text-cyan-600 hover:bg-cyan-50"
          >
            <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
          </Button>

          <Button
            onClick={() => setSoundEnabled(!soundEnabled)}
            variant="outline"
            size="sm"
            className="border-2 border-cyan-300 text-cyan-600 hover:bg-cyan-50"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </Button>
        </div>

        {/* Information Section */}
        <div className="max-w-2xl mx-auto pt-12 border-t border-gray-200">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What is 4-7-8 Breathing?</h2>
              <p className="text-gray-700 leading-relaxed">
                4-7-8 breathing is a Pranayama-based mindfulness technique backed by relaxation response science. This powerful breathing pattern follows a 4-7-8 rhythm: inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds. For best results, practice for <span className="font-bold">2 - 3 minutes</span>. The extended exhale activates your <span className="font-bold">parasympathetic nervous system</span>, shifting your body from stress mode to calm mode.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  <span className="font-semibold text-cyan-600">Inhale (4 seconds):</span> Breathe in slowly through your nose, filling your lungs completely with fresh oxygen.
                </p>
                <p className="leading-relaxed">
                  <span className="font-semibold text-cyan-600">Hold (7 seconds):</span> Retain your breath gently, allowing oxygen to circulate and calm your nervous system.
                </p>
                <p className="leading-relaxed">
                  <span className="font-semibold text-cyan-600">Exhale (8 seconds):</span> Slowly release your breath through your mouth with a sigh, letting tension flow out of your body.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits & Mood Uplift</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <p className="font-semibold text-cyan-700 mb-2">😌 Reduces Anxiety</p>
                  <p className="text-gray-700 text-sm">The extended exhale activates your vagus nerve, triggering immediate calming responses.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-blue-700 mb-2">😴 Improves Sleep</p>
                  <p className="text-gray-700 text-sm">Regular practice helps regulate your sleep-wake cycle and promotes deeper rest.</p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <p className="font-semibold text-cyan-700 mb-2">💭 Enhances Focus</p>
                  <p className="text-gray-700 text-sm">Calming your nervous system increases mental clarity and concentration.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-blue-700 mb-2">🧘 Deepens Mindfulness</p>
                  <p className="text-gray-700 text-sm">Regular practice builds your ability to stay present and aware.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppFooter />

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
