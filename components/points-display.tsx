'use client';

import { useRewards } from '@/hooks/use-rewards';
import { Star } from 'lucide-react';

export function PointsDisplay() {
  const { totalPoints } = useRewards();

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#3C1F71] to-[#E2DAF5] hover:from-[#3C1F71] hover:to-[#D4C5E8] transition-all duration-300 cursor-pointer group">
      <Star
        className="w-5 h-5 text-white fill-white animate-pulse group-hover:scale-110 transition-transform duration-300"
        strokeWidth={1.5}
      />
      <div className="flex flex-col">
        <span className="text-xs text-white/80 font-medium">Reward Points</span>
        <span className="text-lg font-bold text-white">{totalPoints}</span>
      </div>
    </div>
  );
}
