import { supabase } from './supabase';

export type ActivityType = 'daily_login' | 'assessment' | 'game' | 'content_engagement';

const ACTIVITY_POINTS: Record<ActivityType, number> = {
  daily_login: 10,
  assessment: 25,
  game: 15,
  content_engagement: 5,
};

export const rewardsService = {
  async addActivity(userId: string, activityType: ActivityType, description?: string) {
    const points = ACTIVITY_POINTS[activityType];

    const { error: activityError } = await supabase
      .from('reward_activities')
      .insert({
        user_id: userId,
        activity_type: activityType,
        points_earned: points,
        description,
      });

    if (activityError) throw activityError;

    // Update total points
    const { data: currentRewards } = await supabase
      .from('user_rewards')
      .select('total_points')
      .eq('user_id', userId)
      .maybeSingle();

    const newTotal = (currentRewards?.total_points || 0) + points;

    const { error: updateError } = await supabase
      .from('user_rewards')
      .update({
        total_points: newTotal,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Check for new badge unlocks
    await rewardsService.checkAndUnlockBadges(userId, newTotal);

    return { points, newTotal };
  },

  async getUserRewards(userId: string) {
    const { data, error } = await supabase
      .from('user_rewards')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      // Create new rewards entry if doesn't exist
      const { data: newRewards, error: insertError } = await supabase
        .from('user_rewards')
        .insert({ user_id: userId, total_points: 0 })
        .select()
        .single();

      if (insertError) throw insertError;
      return newRewards;
    }

    return data;
  },

  async getUserActivities(userId: string, days = 30) {
    const { data, error } = await supabase
      .from('reward_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('activity_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getUserBadges(userId: string) {
    const { data, error } = await supabase
      .from('user_badges')
      .select('badge:badges(*), earned_at')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAllBadges() {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('points_required', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getAllMilestones() {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .order('level', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getCurrentMilestone(totalPoints: number) {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .lte('points_threshold', totalPoints)
      .order('level', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getNextMilestone(totalPoints: number) {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .gt('points_threshold', totalPoints)
      .order('level', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async checkAndUnlockBadges(userId: string, totalPoints: number) {
    const badges = await this.getAllBadges();
    const userBadges = await this.getUserBadges(userId);
    const earnedBadgeIds = new Set(userBadges.map((ub: any) => ub.badge.id));

    for (const badge of badges) {
      if (!earnedBadgeIds.has(badge.id) && totalPoints >= badge.points_required) {
        await supabase
          .from('user_badges')
          .insert({
            user_id: userId,
            badge_id: badge.id,
          });
      }
    }
  },

  async hasActivityToday(userId: string, activityType: ActivityType) {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('reward_activities')
      .select('id')
      .eq('user_id', userId)
      .eq('activity_type', activityType)
      .eq('activity_date', today)
      .limit(1);

    if (error) throw error;
    return (data?.length || 0) > 0;
  },
};
