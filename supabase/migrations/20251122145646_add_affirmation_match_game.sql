/*
  # Add Affirmation Match Game

  1. New Game Entry
    - `Affirmation Match` game added to the games table
    - Provides matching pairs of positive affirmations
    - Boosts mood through positive reinforcement
    - Includes beautiful card-matching gameplay with smooth animations
*/

INSERT INTO public.games (
  title,
  description,
  category,
  icon,
  color_from,
  color_to
) VALUES (
  'Affirmation Match',
  'Find matching pairs of positive affirmations to boost your mood and practice self-compassion',
  'Mindfulness',
  'heart',
  '#EC4899',
  '#F43F5E'
);
