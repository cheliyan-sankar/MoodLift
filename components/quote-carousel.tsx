'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

type Quote = {
  text: string;
  author: string;
};

const quotes: Quote[] = [
  {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs'
  },
  {
    text: 'Believe you can and you\'re halfway there.',
    author: 'Theodore Roosevelt'
  },
  {
    text: 'Every moment is a fresh beginning.',
    author: 'T.S. Eliot'
  },
  {
    text: 'You are never too old to set another goal or to dream a new dream.',
    author: 'C.S. Lewis'
  },
  {
    text: 'The best time to plant a tree was 20 years ago. The second best time is now.',
    author: 'Chinese Proverb'
  },
  {
    text: 'Your time is limited, don\'t waste it living someone else\'s life.',
    author: 'Steve Jobs'
  },
  {
    text: 'It is during our darkest moments that we must focus to see the light.',
    author: 'Aristotle'
  },
  {
    text: 'The way to get started is to quit talking and begin doing.',
    author: 'Walt Disney'
  },
];

export function QuoteCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const nextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
    setAutoPlay(false);
  };

  const prevQuote = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
    setAutoPlay(false);
  };

  const goToQuote = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
  };

  const currentQuote = quotes[currentIndex];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-accent" />
        <h2 className="text-2xl font-semibold text-primary text-center">
          Quote of the Day
        </h2>
        <Sparkles className="w-5 h-5 text-accent" />
      </div>

      <Card className="relative border-0 overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-95" />

        <div className="relative p-8 md:p-12 min-h-64 flex flex-col justify-center items-center text-center">
          <blockquote className="space-y-6">
            <p className="text-2xl md:text-3xl font-semibold text-white leading-relaxed">
              &ldquo;{currentQuote.text}&rdquo;
            </p>
            <footer className="text-lg text-white/80">
              — {currentQuote.author}
            </footer>
          </blockquote>
        </div>

        <div className="relative flex items-center justify-between px-6 pb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevQuote}
            onMouseEnter={() => setAutoPlay(false)}
            className="hover:bg-white/20"
            aria-label="Previous quote"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex gap-2">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuote(index)}
                onMouseEnter={() => setAutoPlay(false)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-white'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to quote ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextQuote}
            onMouseEnter={() => setAutoPlay(false)}
            className="hover:bg-white/20"
            aria-label="Next quote"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
