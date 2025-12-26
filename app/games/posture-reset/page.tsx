'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppFooter } from "@/components/app-footer";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useBackgroundMusic } from '@/hooks/use-background-music';
import { useLogGameActivity } from '@/hooks/use-log-game-activity';

interface PostureStep {
  id: number;
  title: string;
  instruction: string;
  color: string;
}

const POSTURE_STEPS: PostureStep[] = [
  {
    id: 1,
    title: 'Position',
    instruction: 'Sit or stand tall. Imagine a string lifting the crown of your head upward.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    title: 'Shoulder Reset',
    instruction: 'Roll your shoulders up… back… and down. Feel the tension release.',
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 3,
    title: 'Chest Alignment',
    instruction: 'Lift your chest slightly. Open your shoulders wide.',
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 4,
    title: 'Jaw Relaxation',
    instruction: 'Relax your jaw and soften your facial muscles. Let your shoulders drop.',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 5,
    title: 'Hand Release',
    instruction: 'Unclench your hands and let your arms rest naturally at your sides.',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 6,
    title: 'Spine Alignment',
    instruction: 'Feel your entire spine lengthening. Align your head over your shoulders, shoulders over your hips.',
    color: 'from-lime-500 to-lime-600'
  },
  {
    id: 7,
    title: 'Deep Breath',
    instruction: 'Take one slow deep breath in… hold for a moment… and slowly exhale. Feel the alignment.',
    color: 'from-sky-500 to-sky-600'
  }
];

export default function PostureReset() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useBackgroundMusic(true, 0.25);

  useLogGameActivity('Posture Reset', isStarted);

  const playDingSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  useEffect(() => {
    if (!isStarted) return;

    setButtonEnabled(false);
    setTimeRemaining(6);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setButtonEnabled(true);
          if (timerRef.current) clearTimeout(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStepIndex, isStarted]);

  useEffect(() => {
    if (buttonEnabled && isStarted && timeRemaining === 0) {
      playDingSound();
    }
  }, [buttonEnabled, isStarted, timeRemaining]);

  const currentStep = POSTURE_STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / POSTURE_STEPS.length) * 100;
  const isLastStep = currentStepIndex === POSTURE_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setIsCompleted(true);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkipToStep = (index: number) => {
    setCurrentStepIndex(index);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsCompleted(false);
    setIsStarted(true);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col">
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => router.back()}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs sm:text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div />
            </div>
          </div>
        </nav>

        <main className="flex-1 px-6 py-12 flex items-center justify-center">
          <div className="max-w-2xl text-center">
          <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Perfect!</h1>
          <p className="text-lg text-gray-700 mb-4">You've completed the Posture Reset sequence.</p>
          <p className="text-gray-600 mb-8">
            You should now feel more aligned, energized, and aware of your posture. Make this a daily habit to maintain better alignment throughout your day.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-blue-900 mb-3">Key Takeaways:</h2>
            <ul className="text-left space-y-2 text-blue-800">
              <li>✓ Regular posture resets prevent tension buildup</li>
              <li>✓ Awareness is the first step to better alignment</li>
              <li>✓ Combine with deep breathing for maximum benefit</li>
              <li>✓ Practice 2-3 times daily for lasting improvements</li>
            </ul>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips for Best Results</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Do this exercise 2-3 times daily for maximum benefit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Move slowly and mindfully through each step</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Notice how your body feels before and after</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Combine with the box breathing exercise for deeper relaxation</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={handleReset}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8"
            >
              Repeat Session
            </Button>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="px-8"
            >
              Back
            </Button>
          </div>
          </div>
        </main>

        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.back()}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs sm:text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div />
          </div>
        </div>
      </nav>

      <main className="flex-1 px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 w-full">Posture Reset</h1>
        <p className="text-sm text-gray-600 mb-8 w-full">A <strong>Somatic Grounding Technique</strong> supported by <strong>Cognitive Behavioral Therapy (CBT)</strong> principles to help reconnect your mind and body.</p>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStepIndex + 1} of {POSTURE_STEPS.length}
            </span>
            <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className={`bg-gradient-to-br ${currentStep.color} rounded-2xl shadow-xl p-8 md:p-12 mb-12 text-white min-h-72 flex flex-col justify-center`}>
          <div className="mb-6">
            <span className="text-sm font-semibold opacity-90">STEP {currentStep.id}</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2">{currentStep.title}</h2>
          </div>

          <p className="text-xl md:text-2xl leading-relaxed font-light">
            {currentStep.instruction}
          </p>

          {!buttonEnabled && isStarted && (
            <div className="mt-6 text-sm font-medium opacity-90">
              Ready in {timeRemaining}s
            </div>
          )}
        </div>

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {POSTURE_STEPS.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleSkipToStep(index)}
              className={`w-10 h-10 rounded-full font-semibold text-sm transition-all ${
                index === currentStepIndex
                  ? `bg-gradient-to-r ${step.color} text-white shadow-lg scale-110`
                  : index < currentStepIndex
                  ? 'bg-green-500 text-white shadow'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              } cursor-pointer`}
            >
              {index < currentStepIndex ? '✓' : step.id}
            </button>
          ))}
        </div>

        <div className="flex gap-3 justify-center items-center flex-wrap mb-12">
          {currentStepIndex > 0 && (
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              ← Previous
            </Button>
          )}

          {!isStarted && (
            <Button
              onClick={handleReset}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg px-8"
            >
              Start
            </Button>
          )}

          <Button
            onClick={handleNext}
            size="lg"
            disabled={!buttonEnabled}
            className={`px-8 shadow-lg ${
              buttonEnabled
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
            }`}
          >
            {isLastStep ? 'Complete' : 'Next Step →'}
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        <div className="max-w-2xl mx-auto pt-8 border-t border-gray-200">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">What is Posture Reset?</h3>
              <p className="text-gray-700 leading-relaxed">
                Posture Reset is a guided sequence of posture-correcting movements designed to counteract the effects of prolonged sitting and poor alignment. By focusing on each body part individually, you build awareness and establish better postural habits.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  <span className="font-semibold text-blue-600">Position (6 seconds):</span> Sit or stand tall. Imagine a string lifting the crown of your head upward.
                </p>
                <p className="leading-relaxed">
                  <span className="font-semibold text-cyan-600">Shoulder Reset (6 seconds):</span> Roll shoulders back and relax them down away from your ears.
                </p>
                <p className="leading-relaxed">
                  <span className="font-semibold text-teal-600">Chest Alignment (6 seconds):</span> Open your chest and broaden your shoulders, sitting tall and proud.
                </p>
                <p className="leading-relaxed">
                  <span className="font-semibold text-green-600">Jaw Relaxation (6 seconds):</span> Unclench your jaw and let your face relax completely.
                </p>
                <p className="leading-relaxed">
                  <span className="font-semibold text-emerald-600">Hand Release (6 seconds):</span> Unclench your hands and let your arms rest naturally at your sides.
                </p>
                <p className="leading-relaxed">
                  <span className="font-semibold text-lime-600">Spine Alignment (6 seconds):</span> Feel your entire spine lengthening, with your head over shoulders and shoulders over hips.
                </p>
                <p className="leading-relaxed">
                  <span className="font-semibold text-sky-600">Deep Breath (6 seconds):</span> Take one slow deep breath in, hold for a moment, and slowly exhale feeling the alignment.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Key Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-semibold text-blue-700 mb-1">🧖 Release Tension</p>
                  <p className="text-gray-700 text-sm">Melt away accumulated stress from shoulders and neck.</p>
                </div>
                <div className="bg-cyan-50 p-3 rounded-lg">
                  <p className="font-semibold text-cyan-700 mb-1">📍 Improve Alignment</p>
                  <p className="text-gray-700 text-sm">Train your body for better posture throughout the day.</p>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg">
                  <p className="font-semibold text-teal-700 mb-1">💆 Reduce Headaches</p>
                  <p className="text-gray-700 text-sm">Alleviate tension headaches from poor posture.</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-semibold text-green-700 mb-1">⚡ Boost Energy</p>
                  <p className="text-gray-700 text-sm">Improve circulation and oxygen flow to your brain.</p>
                </div>
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
