import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

const games = [
  {
    title: 'Box Breathing',
    description: 'A simple breathing technique supported by CBT principles to help reduce stress.',
    category: 'Breathing',
    icon: 'Wind',
    color_from: 'purple-400',
    color_to: 'pink-400',
    Mood_tags: 'stress,anxiety,calm',
  },
  {
    title: 'Alternate Nostril Breathing',
    description: 'A gentle Mindfulness-Based Stress Reduction (MBSR) technique to steady your breath and mind.',
    category: 'Breathing',
    icon: 'Wind',
    color_from: 'emerald-400',
    color_to: 'teal-500',
    Mood_tags: 'balance,clarity,focus',
  },
  {
    title: 'Diaphragmatic Breathing',
    description: 'Deep belly breathing that activates your parasympathetic nervous system for instant calm and stress relief.',
    category: 'Breathing',
    icon: 'Wind',
    color_from: 'blue-400',
    color_to: 'cyan-500',
    Mood_tags: 'calm,deep breathing,relaxation',
  },
  {
    title: '4-7-8 Breathing',
    description: 'The famous 4-7-8 technique for anxiety relief and better sleep. Proven to reduce stress and promote relaxation.',
    category: 'Breathing',
    icon: 'Wind',
    color_from: 'indigo-400',
    color_to: 'blue-500',
    Mood_tags: 'sleep,anxiety,relaxation',
  },
  {
    title: 'Cognitive Grounding',
    description: 'Engage your mind with grounding techniques backed by cognitive behavioral therapy.',
    category: 'Grounding',
    icon: 'Brain',
    color_from: 'blue-400',
    color_to: 'cyan-400',
    Mood_tags: 'grounding,focus,awareness',
  },
  {
    title: 'Physical Grounding',
    description: 'Use physical sensations to anchor yourself to the present moment. Feel your body, feel the ground.',
    category: 'Grounding',
    icon: 'Hand',
    color_from: 'orange-400',
    color_to: 'red-500',
    Mood_tags: 'grounding,present,physical',
  },
  {
    title: 'Describe Your Room',
    description: 'Use the 5 senses to anchor yourself to your environment. Notice colors, sounds, textures, and feelings.',
    category: 'Grounding',
    icon: 'Eye',
    color_from: 'violet-400',
    color_to: 'purple-500',
    Mood_tags: 'grounding,sensory,awareness',
  },
  {
    title: 'Name the Moment',
    description: 'Practice self-reassurance through affirmations. Acknowledge your feelings and build emotional resilience.',
    category: 'Emotional',
    icon: 'Heart',
    color_from: 'pink-400',
    color_to: 'rose-500',
    Mood_tags: 'affirmation,self-care,resilience',
  },
  {
    title: 'Self-Soothing',
    description: 'Learn techniques to calm your nervous system through sensory awareness and self-compassion.',
    category: 'Sensory',
    icon: 'Heart',
    color_from: 'rose-400',
    color_to: 'orange-400',
    Mood_tags: 'calm,soothe,comfort',
  },
  {
    title: 'CBT Thought-Challenger',
    description: 'Challenge automatic negative thoughts using cognitive behavioral therapy. Examine evidence and develop balanced, realistic perspectives.',
    category: 'Cognitive',
    icon: 'Brain',
    color_from: 'amber-400',
    color_to: 'orange-500',
    Mood_tags: 'anxiety,mood,self-criticism,cognitive restructuring',
  },
  {
    title: 'Affirmation Mirror',
    description: 'Transform negative self-talk into powerful affirmations. See yourself through a lens of compassion and build lasting self-esteem.',
    category: 'Emotional',
    icon: 'Heart',
    color_from: 'rose-400',
    color_to: 'pink-500',
    Mood_tags: 'self-esteem,self-compassion,affirmation,mood,anxiety',
  },
];

function checkCredentials() {
  if (!supabaseUrl || !supabaseKey) {
    return Response.json(
      { error: 'Missing Supabase credentials' },
      { status: 500 }
    );
  }
  return null;
}

export async function POST() {
  const credError = checkCredentials();
  if (credError) return credError;
  
  try {
    // Delete existing games
    await supabase.from('games').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert all games
    const { data, error } = await supabase.from('games').insert(games).select();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ message: 'All games seeded successfully', count: data?.length || 0, data }, { status: 200 });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  const credError = checkCredentials();
  if (credError) return credError;
  
  try {
    const { data, error } = await supabase.from('games').select('*');

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ data, count: data?.length || 0 }, { status: 200 });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
