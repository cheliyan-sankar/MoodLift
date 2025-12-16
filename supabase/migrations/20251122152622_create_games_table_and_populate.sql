/*
  # Create Games Table and Populate with All Games

  1. New Tables
    - `games`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `category` (text, not null)
      - `icon` (text, not null)
      - `color_from` (text, not null)
      - `color_to` (text, not null)
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `games` table
    - Add policy for public read access (anyone can view games)
  
  3. Data Population
    - Insert all 7 games from the codebase:
      - Affirmation Match
      - Alternate Nostril Breathing
      - Box Breathing
      - Calm Breath
      - 4-7-8 Breathing
      - Gratitude Garden
      - Mindful Moments
*/

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  icon text NOT NULL,
  color_from text NOT NULL,
  color_to text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Add policy for public read access
CREATE POLICY "Anyone can read games"
  ON games
  FOR SELECT
  TO public
  USING (true);

-- Insert all games from the codebase
INSERT INTO games (title, description, category, icon, color_from, color_to) VALUES
  ('Affirmation Match', 'Match positive affirmations in a calming memory game', 'Cognitive', 'lightbulb', '#EC4899', '#F43F5E'),
  ('Alternate Nostril Breathing', 'Ancient yogic breathing technique that balances brain hemispheres and promotes deep relaxation', 'Breathing', 'flower-2', '#06B6D4', '#3B82F6'),
  ('Box Breathing', 'Navy SEAL breathing technique for staying calm under pressure with 4-4-4-4 pattern', 'Breathing', 'target', '#3B82F6', '#8B5CF6'),
  ('Calm Breath', 'Interactive breathing exercises to reduce stress and anxiety with 4-4-6-2 technique', 'Breathing', 'heart', '#3B82F6', '#06B6D4'),
  ('4-7-8 Breathing', 'Dr. Andrew Weil breathing technique - natural tranquilizer for the nervous system', 'Breathing', 'heart', '#8B5CF6', '#EC4899'),
  ('Gratitude Garden', 'Plant seeds of positivity by reflecting on what you are grateful for', 'Mindfulness', 'flower-2', '#10B981', '#34D399'),
  ('Mindful Moments', 'Quick mindfulness activities to center yourself and reduce stress', 'Mindfulness', 'brain', '#8B5CF6', '#A78BFA')
ON CONFLICT (id) DO NOTHING;