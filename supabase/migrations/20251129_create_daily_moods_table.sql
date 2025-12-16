-- Create daily_moods table for tracking user moods
CREATE TABLE IF NOT EXISTS daily_moods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood text NOT NULL CHECK (mood IN ('stressed', 'sad', 'anxious', 'bored', 'happy')),
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_daily_moods_user_id ON daily_moods(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_moods_recorded_at ON daily_moods(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_moods_user_recorded ON daily_moods(user_id, recorded_at DESC);

-- Enable Row Level Security
ALTER TABLE daily_moods ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own moods
CREATE POLICY "Users can read own moods"
  ON daily_moods
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own moods
CREATE POLICY "Users can insert own moods"
  ON daily_moods
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own moods
CREATE POLICY "Users can update own moods"
  ON daily_moods
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
