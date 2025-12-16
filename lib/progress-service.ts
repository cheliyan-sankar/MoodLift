import { supabase } from './supabase';

export interface GameSession {
  id: string;
  userId: string;
  gameTitle: string;
  score: number;
  duration: number; // in seconds
  completedAt: string;
  moodBefore?: number;
  moodAfter?: number;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  score: number;
  insights: string;
  completedAt: string;
}

export interface UserProgress {
  totalGames: number;
  avgMood: number;
  currentStreak: number;
  weeklyActivity: { day: string; games: number; mood: number }[];
  achievements: { title: string; earned: boolean; description: string }[];
}

export async function saveGameSession(
  userId: string,
  gameTitle: string,
  score: number,
  duration: number,
  moodBefore?: number,
  moodAfter?: number
) {
  try {
    const { data, error } = await supabase.from('game_sessions').insert([
      {
        user_id: userId,
        game_title: gameTitle,
        score,
        duration,
        mood_before: moodBefore,
        mood_after: moodAfter,
        completed_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving game session:', error);
    return null;
  }
}

export async function saveAssessmentResult(
  userId: string,
  score: number,
  insights: string
) {
  try {
    const { data, error } = await supabase.from('assessment_results').insert([
      {
        user_id: userId,
        score,
        insights,
        completed_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving assessment result:', error);
    return null;
  }
}

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  try {
    // Fetch game sessions
    const { data: gameSessions, error: sessionsError } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (sessionsError) throw sessionsError;

    // Fetch assessment results
    const { data: assessments, error: assessmentsError } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (assessmentsError) throw assessmentsError;

    // Calculate stats
    const totalGames = gameSessions?.length || 0;
    const moodAfterScores = gameSessions?.filter(s => s.mood_after).map(s => s.mood_after) || [];
    const avgMood = moodAfterScores.length > 0
      ? (moodAfterScores.reduce((a, b) => a + b, 0) / moodAfterScores.length).toFixed(1)
      : '0';

    // Calculate weekly activity
    const weeklyActivity = getWeeklyActivity(gameSessions || []);

    // Calculate achievements
    const achievements = calculateAchievements(totalGames, assessments || [], gameSessions || []);

    return {
      totalGames,
      avgMood: parseFloat(avgMood as string),
      currentStreak: calculateStreak(gameSessions || []),
      weeklyActivity,
      achievements,
    };
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return null;
  }
}

function getWeeklyActivity(sessions: any[]) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekActivity: { [key: string]: { games: number; moods: number[] } } = {};

  days.forEach(day => {
    weekActivity[day] = { games: 0, moods: [] };
  });

  // Get last 7 days
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  sessions.forEach(session => {
    const sessionDate = new Date(session.completed_at);
    if (sessionDate >= sevenDaysAgo) {
      const dayIndex = sessionDate.getDay() === 0 ? 6 : sessionDate.getDay() - 1;
      const dayName = days[dayIndex];
      weekActivity[dayName].games += 1;
      if (session.mood_after) {
        weekActivity[dayName].moods.push(session.mood_after);
      }
    }
  });

  return days.map(day => ({
    day,
    games: weekActivity[day].games,
    mood: weekActivity[day].moods.length > 0
      ? Math.round(weekActivity[day].moods.reduce((a, b) => a + b, 0) / weekActivity[day].moods.length)
      : 0,
  }));
}

function calculateStreak(sessions: any[]): number {
  if (sessions.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(currentDate);
    checkDate.setDate(checkDate.getDate() - i);

    const hasSessionOnDay = sessions.some(session => {
      const sessionDate = new Date(session.completed_at);
      return sessionDate.toDateString() === checkDate.toDateString();
    });

    if (hasSessionOnDay) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}

function calculateAchievements(totalGames: number, assessments: any[], sessions: any[]) {
  const achievements = [
    {
      title: 'First Steps',
      description: 'Completed your first game',
      earned: totalGames >= 1,
    },
    {
      title: 'Week Warrior',
      description: '7-day streak achieved',
      earned: calculateStreak(sessions) >= 7,
    },
    {
      title: 'Gratitude Guru',
      description: 'Planted 50 gratitude flowers',
      earned: sessions.filter(s => s.game_title === 'Gratitude Garden').length >= 50,
    },
    {
      title: 'Breath Master',
      description: 'Completed 100 breathing cycles',
      earned: sessions.filter(s => s.game_title?.includes('Breath')).length >= 100,
    },
    {
      title: 'Mindful Maven',
      description: 'Finished all mindfulness activities',
      earned: new Set(sessions.map(s => s.game_title)).size >= 7,
    },
    {
      title: 'Affirmation Ace',
      description: 'Perfect score in 10 games',
      earned: sessions.filter(s => s.score === 100).length >= 10,
    },
  ];

  return achievements;
}
