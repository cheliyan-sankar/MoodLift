'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { rewardsService, type ActivityType } from '@/lib/rewards-service';

export function useRewards() {
  const { user } = useAuth();
  const [totalPoints, setTotalPoints] = useState(0);
  const [badges, setBadges] = useState<any[]>([]);
  const [currentMilestone, setCurrentMilestone] = useState<any>(null);
  const [nextMilestone, setNextMilestone] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadRewards = async () => {
      try {
        const rewards = await rewardsService.getUserRewards(user.id);
        setTotalPoints(rewards.total_points);

        const userBadges = await rewardsService.getUserBadges(user.id);
        setBadges(userBadges);

        const current = await rewardsService.getCurrentMilestone(rewards.total_points);
        setCurrentMilestone(current);

        const next = await rewardsService.getNextMilestone(rewards.total_points);
        setNextMilestone(next);
      } catch (error) {
        console.error('Error loading rewards:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRewards();
  }, [user]);

  const addActivity = async (activityType: ActivityType, description?: string) => {
    if (!user) return;

    try {
      const result = await rewardsService.addActivity(user.id, activityType, description);
      setTotalPoints(result.newTotal);

      // Reload milestones and badges after update
      const current = await rewardsService.getCurrentMilestone(result.newTotal);
      setCurrentMilestone(current);

      const next = await rewardsService.getNextMilestone(result.newTotal);
      setNextMilestone(next);

      const userBadges = await rewardsService.getUserBadges(user.id);
      setBadges(userBadges);

      return result;
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  };

  return {
    totalPoints,
    badges,
    currentMilestone,
    nextMilestone,
    loading,
    addActivity,
  };
}
