'use client';

import { useState, useEffect } from 'react';
import { AppFooter } from "@/components/app-footer";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useBreathingGuide, useVoiceGuide, type BreathingCycle } from '@/hooks/use-breathing-guide';
import { useLogGameActivity } from '@/hooks/use-log-game-activity';

export default function FourSevenEightBreathing() {
  const router = useRouter();
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const breathingCycles: BreathingCycle[] = [
    { phase: 'inhale', duration: 4, instruction: 'Breathe in through your nose for 4 counts' },
    { phase: 'hold', duration: 7, instruction: 'Hold your breath for 7 counts' },
    { phase: 'exhale', duration: 8, instruction: 'Exhale through your mouth for 8 counts' },
    { phase: 'inhale', duration: 4, instruction: 'Breathe in through your nose for 4 counts' },
    { phase: 'hold', duration: 7, instruction: 'Hold your breath for 7 counts' },
    { phase: 'exhale', duration: 8, instruction: 'Exhale through your mouth for 8 counts' },
    { phase: 'inhale', duration: 4, instruction: 'Breathe in through your nose for 4 counts' },
    { phase: 'hold', duration: 7, instruction: 'Hold your breath for 7 counts' },
    { phase: 'exhale', duration: 8, instruction: 'Exhale through your mouth for 8 counts' },
  ];

  const { speak } = useVoiceGuide();
  const guide = useBreathingGuide({
    cycles: breathingCycles,
    totalDuration: breathingCycles.reduce((sum, c) => sum + c.duration, 0),
    name: '4-7-8 Breathing',
  });

  useLogGameActivity('4-7-8 Breathing', guide.isRunning);

  useEffect(() => {
    if (voiceEnabled && guide.currentInstruction && guide.isRunning) {
      speak(guide.currentInstruction);
    }
  }, [guide.currentPhase, guide.isRunning, voiceEnabled, guide.currentInstruction, speak]);

  const getPhaseColor = () => {
    switch (guide.currentPhase) {
      case 'inhale':
        return 'from-indigo-400 to-blue-500';
      case 'hold':
        return 'from-orange-400 to-red-500';
      case 'exhale':
        return 'from-teal-400 to-cyan-500';
      default:
        return 'from-gray-300 to-gray-400';
    }
  };

  const getPhaseLabel = () => {
    switch (guide.currentPhase) {
      case 'inhale':
        return `INHALE (${guide.timeLeft})`;
      case 'hold':
        return `HOLD (${guide.timeLeft})`;
      case 'exhale':
        return `EXHALE (${guide.timeLeft})`;
      default:
        return 'REST';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <Button onClick={() => router.back()} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg text-xs sm:text-sm mb-4 sm:mb-6">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Back
          </Button>
          <div className="text-center pt-6 sm:pt-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-2">4-7-8 Breathing</h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">A <strong>Pranayama-Based Mindfulness Technique</strong> backed by <strong>Relaxation Response Science</strong> to steady your breath and mind.</p>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Card className="border-2 border-indigo-200">
          <CardContent className="p-8 sm:p-12">
            {/* Main Circle with Expanding Animation */}
            <div className="flex justify-center mb-12">
              <div className="relative w-60 h-60">
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-2xl transition-transform duration-1000 ${
                    guide.currentPhase === 'inhale'
                      ? 'scale-100'
                      : guide.currentPhase === 'hold'
                        ? 'scale-110'
                        : guide.currentPhase === 'exhale'
                          ? 'scale-80'
                          : 'scale-90'
                  }`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl font-bold mb-4">{guide.timeLeft}</div>
                    <div className="text-2xl font-semibold">{guide.currentPhase.toUpperCase()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Session Progress</span>
                <span>{Math.round(guide.progress)}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 to-blue-500 transition-all duration-300"
                  style={{ width: `${guide.progress}%` }}
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center mb-8 min-h-16 flex items-center justify-center">
              <p className="text-lg text-gray-700 italic">{guide.currentInstruction}</p>
            </div>

            {/* Controls */}
            <div className="flex gap-2 sm:gap-4 justify-center items-center flex-wrap mb-8">
              {!guide.isRunning ? (
                <Button
                  onClick={guide.start}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90 flex-1 sm:flex-none min-w-fit"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Session
                </Button>
              ) : (
                <Button
                  onClick={guide.pause}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 flex-1 sm:flex-none min-w-fit"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}

              <Button
                onClick={guide.reset}
                variant="outline"
                size="lg"
                className="border-2 flex-1 sm:flex-none min-w-fit"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>

              <Button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                variant={voiceEnabled ? 'default' : 'outline'}
                size="lg"
                className="border-2 sm:flex-none"
              >
                {voiceEnabled ? (
                  <>
                    <Volume2 className="w-5 h-5 mr-2" />
                    Voice On
                  </>
                ) : (
                  <>
                    <VolumeX className="w-5 h-5 mr-2" />
                    Voice Off
                  </>
                )}
              </Button>
            </div>

            {/* Completion Message */}
            {guide.isComplete && (
              <div className="bg-green-100 border-2 border-green-400 rounded-lg p-6 text-center">
                <p className="text-2xl font-bold text-green-700 mb-2">🎉 Perfect!</p>
                <p className="text-green-600">
                  You&apos;ve completed the 4-7-8 breathing technique. Great for deep relaxation and better sleep.
                </p>
              </div>
            )}

            {/* Information Section */}
            <div className="max-w-2xl mx-auto pt-12 border-t border-indigo-200">
              <div className="space-y-8">
                {/* What is 4-7-8 Breathing */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What is 4-7-8 Breathing?</h2>
                  <p className="text-gray-700 leading-relaxed">
                    The 4-7-8 breathing technique, developed by Dr. Andrew Weil, is a scientifically-backed method renowned for its powerful relaxation and sleep-inducing effects. By following a specific rhythm of breathing in, holding, and breathing out, this technique naturally calms your nervous system and prepares your body for deep rest. It's one of the most effective breathwork practices for managing anxiety and insomnia.
                  </p>
                </div>

                {/* How It Works */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
                  <div className="space-y-3 text-gray-700">
                    <p className="leading-relaxed">
                      <span className="font-semibold text-indigo-600">Inhale (4 seconds):</span> Slowly breathe in through your nose for a count of 4. Feel your lungs fill completely with fresh, calming oxygen.
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-semibold text-indigo-600">Hold (7 seconds):</span> Hold your breath for a count of 7. This is the critical phase where oxygen circulates deeply through your body and activates the parasympathetic nervous system.
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-semibold text-indigo-600">Exhale (8 seconds):</span> Slowly exhale through your mouth for a count of 8. The extended exhale is key to activating your vagus nerve and triggering a deep relaxation response.
                    </p>
                    <p className="leading-relaxed">
                      Repeat this cycle 3-4 times per session. The longer exhale (8 seconds) compared to the inhale (4 seconds) is what makes this technique so effective at calming your mind and body.
                    </p>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="font-semibold text-indigo-700 mb-2">😴 Improves Sleep</p>
                      <p className="text-gray-700 text-sm">One of the most effective techniques for falling asleep faster and enjoying deeper, more restorative sleep.</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="font-semibold text-indigo-700 mb-2">😰 Reduces Anxiety</p>
                      <p className="text-gray-700 text-sm">Activates your vagus nerve, triggering an immediate calming response and reducing anxiety symptoms in minutes.</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="font-semibold text-indigo-700 mb-2">🧠 Enhances Focus</p>
                      <p className="text-gray-700 text-sm">Calms racing thoughts and brings mental clarity, helping you feel more focused and present.</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="font-semibold text-indigo-700 mb-2">❤️ Lowers Blood Pressure</p>
                      <p className="text-gray-700 text-sm">Regular practice reduces cortisol and blood pressure, promoting cardiovascular health and emotional calm.</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    By practicing the 4-7-8 breathing technique regularly, you can transform your relationship with stress and sleep. Just 3-4 cycles can shift your nervous system into deep relaxation mode. This science-backed method has helped thousands find relief from anxiety and insomnia, making it one of the most powerful tools for emotional wellness.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    <AppFooter />
    </div>
  );
}
