/*
  # Remove All Games Except 4 Breathing Techniques
  
  1. Delete non-breathing games
    - Affirmation Match
    - Calm Breath
    - Gratitude Garden
    - Mindful Moments
  
  2. Keep only the 4 breathing games:
    - Diaphragmatic Breathing (will be added if not present)
    - Box Breathing
    - 4-7-8 Breathing
    - Alternate Nostril Breathing
*/

-- Delete non-breathing games
DELETE FROM games WHERE title IN (
  'Affirmation Match',
  'Calm Breath',
  'Gratitude Garden',
  'Mindful Moments'
);

-- Add Diaphragmatic Breathing if it doesn't exist
INSERT INTO games (title, description, category, icon, color_from, color_to) 
VALUES (
  'Diaphragmatic Breathing',
  'Deep belly breathing technique to reduce stress and anxiety naturally',
  'Breathing',
  'heart',
  '#06B6D4',
  '#3B82F6'
)
ON CONFLICT (title) DO NOTHING;
