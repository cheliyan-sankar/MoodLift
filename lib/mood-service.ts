import { supabase } from './supabase';

export type MoodType = 'stressed' | 'sad' | 'anxious' | 'bored' | 'happy';

export interface DailyMood {
  id: string;
  userId: string;
  mood: MoodType;
  recordedAt: string;
}

export interface GameRecommendation {
  title: string;
  description: string;
  url: string;
  reason: string;
  emoji: string;
}

const MOOD_RECOMMENDATIONS: { [key in MoodType]: GameRecommendation[] } = {
  stressed: [
    {
      title: 'Box Breathing',
      description: 'Navy SEAL technique for instant calm',
      url: '/games/box-breathing',
      reason: 'Box breathing is proven to lower cortisol levels',
      emoji: '📦',
    },
    {
      title: 'Physical Grounding',
      description: 'Use physical sensations to calm your nervous system',
      url: '/games/physical-grounding',
      reason: 'Grounding techniques interrupt stress cycles',
      emoji: '❄️',
    },
    {
      title: 'Diaphragmatic Breathing',
      description: 'Deep belly breathing for nervous system calm',
      url: '/games/diaphragmatic-breathing',
      reason: 'Activates parasympathetic nervous system',
      emoji: '🫁',
    },
  ],
  sad: [
    {
      title: 'Name the Moment Technique',
      description: 'Practice self-reassurance with compassionate affirmations',
      url: '/games/name-the-moment',
      reason: 'Self-compassion uplifts mood and self-esteem',
      emoji: '💝',
    },
    {
      title: 'Self-Soothing (DBT Technique)',
      description: 'Use comforting sensations to soothe your emotions',
      url: '/games/self-soothing',
      reason: 'Sensory grounding improves emotional state',
      emoji: '🌸',
    },
    {
      title: 'Diaphragmatic Breathing',
      description: 'Deep belly breathing to lift your mood',
      url: '/games/diaphragmatic-breathing',
      reason: 'Calming breathing reduces sadness',
      emoji: '🫁',
    },
  ],
  anxious: [
    {
      title: 'Cognitive Grounding',
      description: 'Engage your mind to shift focus and reduce anxiety',
      url: '/games/cognitive-grounding',
      reason: 'Mental exercises interrupt anxiety spirals',
      emoji: '🧠',
    },
    {
      title: 'Describe the Room Technique',
      description: 'Ground yourself using all five senses',
      url: '/games/describe-room',
      reason: 'Sensory awareness reduces anxiety symptoms',
      emoji: '👁️',
    },
    {
      title: '4-7-8 Breathing',
      description: "Dr. Weil's natural anxiety relief technique",
      url: '/games/four-seven-eight-breathing',
      reason: '4-7-8 breathing is a proven anxiety reducer',
      emoji: '⏱️',
    },
  ],
  bored: [
    {
      title: 'Cognitive Grounding',
      description: 'Challenge your mind with mental exercises',
      url: '/games/cognitive-grounding',
      reason: 'Mental engagement increases stimulation and focus',
      emoji: '🧠',
    },
    {
      title: 'Physical Grounding',
      description: 'Energize yourself with physical sensations',
      url: '/games/physical-grounding',
      reason: 'Physical activity increases alertness and energy',
      emoji: '⚡',
    },
    {
      title: 'Describe the Room Technique',
      description: 'Activate your senses and explore your environment',
      url: '/games/describe-room',
      reason: 'Sensory exploration stimulates your mind',
      emoji: '👁️',
    },
  ],
  happy: [
    {
      title: 'Self-Soothing (DBT Technique)',
      description: 'Celebrate this moment with self-care',
      url: '/games/self-soothing',
      reason: 'Self-care amplifies happiness and well-being',
      emoji: '🌸',
    },
    {
      title: 'Name the Moment Technique',
      description: 'Deepen your joy with positive affirmations',
      url: '/games/name-the-moment',
      reason: 'Affirmations reinforce positive emotions',
      emoji: '💝',
    },
    {
      title: 'Affirmation Mirror',
      description: 'Transform self-talk into powerful affirmations',
      url: '/games/affirmation-mirror',
      reason: 'Build lasting self-esteem and confidence',
      emoji: '✨',
    },
  ],
};

export async function saveDailyMood(userId: string, mood: MoodType) {
  try {
    // Check if mood already recorded today
    const today = new Date().toISOString().split('T')[0];
    const { data: existing, error: checkError } = await supabase
      .from('daily_moods')
      .select('id')
      .eq('user_id', userId)
      .gte('recorded_at', today)
      .lt('recorded_at', new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (checkError) throw checkError;

    if (existing && existing.length > 0) {
      // Update existing mood
      const { data, error } = await supabase
        .from('daily_moods')
        .update({ mood, recorded_at: new Date().toISOString() })
        .eq('id', existing[0].id)
        .select();

      if (error) throw error;
      return data;
    } else {
      // Insert new mood
      const { data, error } = await supabase.from('daily_moods').insert([
        {
          user_id: userId,
          mood,
          recorded_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error saving daily mood:', error);
    return null;
  }
}

export function getGameRecommendations(mood: MoodType): GameRecommendation[] {
  return MOOD_RECOMMENDATIONS[mood] || [];
}

export async function getTodaysMood(userId: string): Promise<MoodType | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_moods')
      .select('mood')
      .eq('user_id', userId)
      .gte('recorded_at', today)
      .lt('recorded_at', new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000).toISOString())
      .order('recorded_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data?.[0]?.mood || null;
  } catch (error) {
    console.error('Error fetching today mood:', error);
    return null;
  }
}
