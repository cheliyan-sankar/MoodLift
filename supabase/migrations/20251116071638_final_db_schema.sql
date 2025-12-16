/*
  # MoodLift Complete Database Schema - Final Consolidated Migration

  This is the complete, consolidated database schema for the MoodLift application.
  It combines all previous migrations into a single, comprehensive migration file.

  ## Tables Created:

  1. **mood_assessments**
     - Stores user mood assessment responses and AI-generated results
     - Supports both authenticated users and anonymous sessions
     - Columns: id, user_id, user_session, responses, mood_result, mood_score, recommendations, created_at

  2. **user_profiles**
     - User profile information with avatar and display preferences
     - Columns: id, email, full_name, avatar_url, profile_picture_initials, created_at, updated_at

  3. **user_streaks**
     - Tracks daily login streaks and personal bests
     - Columns: id, user_id, current_streak, longest_streak, last_login_date, created_at, updated_at

  4. **games**
     - Wellness games catalog with categorization and styling
     - Columns: id, title, description, category, icon, color_from, color_to, created_at

  5. **books**
     - Mental health book recommendations with mood-based tagging
     - Columns: id, title, author, description, cover_color, genre, mood_tags, rating, created_at

  6. **user_favorites**
     - User bookmarking system for games and books
     - Columns: id, user_id, item_type, item_id, created_at

  7. **testimonials**
     - User testimonials and reviews
     - Columns: id, user_name, user_title, feedback, rating, avatar_url, is_active, display_order, created_at

  8. **user_rewards**
     - User rewards point tracking
     - Columns: id, user_id, total_points, created_at, updated_at

  9. **reward_activities**
     - Log of user activities that earn points
     - Columns: id, user_id, activity_type, activity_date, points_earned, description, created_at

  10. **badges**
      - Available badges that users can earn
      - Columns: id, name, description, points_required, icon, created_at

  11. **user_badges**
      - Badges earned by users
      - Columns: id, user_id, badge_id, earned_at

  12. **milestones**
      - Achievement milestones based on total points
      - Columns: id, name, description, points_threshold, level, created_at

  ## Security:
  - Row Level Security (RLS) enabled on all tables
  - Policies restrict access to user's own data where applicable
  - Public read access for content tables (games, books, testimonials, badges, milestones)

  ## Automation:
  - Automatic profile, streak, and rewards creation on user signup via trigger
  - Automatic updated_at timestamp management
*/

-- ==============================================
-- MOOD ASSESSMENTS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS mood_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_session text NOT NULL,
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  mood_result text,
  mood_score integer,
  recommendations text[],
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mood_assessments_user_id ON mood_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_assessments_session ON mood_assessments(user_session);
CREATE INDEX IF NOT EXISTS idx_mood_assessments_created_at ON mood_assessments(created_at DESC);

ALTER TABLE mood_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read own assessments"
  ON mood_assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert assessments"
  ON mood_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can insert assessments"
  ON mood_assessments
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- ==============================================
-- USER PROFILES TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text DEFAULT '',
  avatar_url text,
  profile_picture_initials text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ==============================================
-- USER STREAKS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS user_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_login_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON user_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_streaks_current_streak ON user_streaks(current_streak DESC);

ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own streak"
  ON user_streaks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streak"
  ON user_streaks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==============================================
-- GAMES TABLE
-- ==============================================

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

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read games"
  ON games FOR SELECT
  USING (true);

-- ==============================================
-- BOOKS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  description text NOT NULL,
  cover_color text NOT NULL,
  genre text NOT NULL,
  mood_tags text[] DEFAULT '{}',
  rating decimal(2,1) DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read books"
  ON books FOR SELECT
  USING (true);

-- ==============================================
-- USER FAVORITES TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('game', 'book')),
  item_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own favorites"
  ON user_favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON user_favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON user_favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ==============================================
-- TESTIMONIALS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  user_title text,
  feedback text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  avatar_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (is_active = true);

-- ==============================================
-- USER REWARDS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS user_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_total_points ON user_rewards(total_points DESC);

ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own rewards"
  ON user_rewards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own rewards"
  ON user_rewards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own rewards"
  ON user_rewards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ==============================================
-- REWARD ACTIVITIES TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS reward_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL CHECK (activity_type IN ('daily_login', 'assessment', 'game', 'content_engagement')),
  activity_date date DEFAULT CURRENT_DATE,
  points_earned integer NOT NULL DEFAULT 0,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reward_activities_user_id ON reward_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_activities_date ON reward_activities(activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_reward_activities_type ON reward_activities(activity_type);

ALTER TABLE reward_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own activities"
  ON reward_activities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
  ON reward_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ==============================================
-- BADGES TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  points_required integer NOT NULL DEFAULT 0,
  icon text DEFAULT 'star',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read badges"
  ON badges
  FOR SELECT
  TO public
  USING (true);

-- ==============================================
-- USER BADGES TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own badges"
  ON user_badges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON user_badges
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ==============================================
-- MILESTONES TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  points_threshold integer NOT NULL,
  level integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(points_threshold),
  UNIQUE(level)
);

ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read milestones"
  ON milestones
  FOR SELECT
  TO public
  USING (true);

-- ==============================================
-- TRIGGER FUNCTION FOR USER CREATION
-- ==============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );

  INSERT INTO public.user_streaks (user_id, last_login_date)
  VALUES (NEW.id, CURRENT_DATE);

  INSERT INTO public.user_rewards (user_id, total_points)
  VALUES (NEW.id, 0);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ==============================================
-- SEED DATA - GAMES
-- ==============================================

INSERT INTO games (title, description, category, icon, color_from, color_to) VALUES
  ('Mind Maze', 'Navigate through cognitive puzzles to sharpen your mental agility and problem-solving skills', 'Puzzle', 'brain', '#3C1F71', '#5B3A8F'),
  ('Zen Garden', 'Create peaceful digital gardens while practicing mindfulness and stress reduction', 'Relaxation', 'flower-2', '#10B981', '#34D399'),
  ('Memory Master', 'Enhance your memory through engaging card-matching challenges and pattern recognition', 'Memory', 'lightbulb', '#F59E0B', '#FBBF24'),
  ('Focus Flow', 'Train your concentration with timed attention exercises and distraction management', 'Focus', 'target', '#3B82F6', '#60A5FA'),
  ('Emotion Explorer', 'Identify and understand different emotions through interactive scenarios', 'Emotional', 'heart', '#EC4899', '#F472B6'),
  ('Word Wellness', 'Build vocabulary while learning positive psychology concepts and affirmations', 'Learning', 'book-open', '#8B5CF6', '#A78BFA')
ON CONFLICT DO NOTHING;

-- ==============================================
-- SEED DATA - BOOKS
-- ==============================================

INSERT INTO books (title, author, description, cover_color, genre, mood_tags, rating) VALUES
  ('The Happiness Advantage', 'Shawn Achor', 'Discover how happiness fuels success, not the other way around. Science-backed strategies for positive psychology in work and life.', '#3C1F71', 'Self-Help', ARRAY['Excellent', 'Good'], 4.7),
  ('Atomic Habits', 'James Clear', 'Transform your life with tiny changes that deliver remarkable results. A practical guide to building good habits and breaking bad ones.', '#10B981', 'Personal Development', ARRAY['Excellent', 'Good', 'Moderate'], 4.8),
  ('The Anxiety Toolkit', 'Alice Boyes', 'Evidence-based strategies for managing worry, panic, and fear. Practical CBT techniques you can use immediately.', '#F59E0B', 'Mental Health', ARRAY['Moderate', 'Needs Support'], 4.5),
  ('Mindset', 'Carol Dweck', 'Learn how your mindset shapes your success. Discover the power of believing you can improve and grow.', '#3B82F6', 'Psychology', ARRAY['Excellent', 'Good'], 4.6),
  ('The Body Keeps the Score', 'Bessel van der Kolk', 'Groundbreaking work on trauma and the connections between mind, brain, and body in the healing process.', '#EC4899', 'Mental Health', ARRAY['Needs Support', 'Moderate'], 4.8),
  ('Daring Greatly', 'Brené Brown', 'Embrace vulnerability as the path to courage, engagement, and meaningful connection with others.', '#8B5CF6', 'Self-Help', ARRAY['Good', 'Moderate'], 4.7)
ON CONFLICT DO NOTHING;

-- ==============================================
-- SEED DATA - TESTIMONIALS
-- ==============================================

INSERT INTO testimonials (user_name, user_title, feedback, rating, avatar_url, is_active, display_order) VALUES
  (
    'Sarah Mitchell',
    'Teacher',
    'MoodLift has completely transformed how I manage stress. The breathing exercises are my go-to during busy days, and I love tracking my progress!',
    5,
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    true,
    1
  ),
  (
    'James Rodriguez',
    'Software Developer',
    'The AI mood assessment is incredibly accurate. It helped me identify patterns I never noticed before. The games are fun and actually work!',
    5,
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    true,
    2
  ),
  (
    'Emily Chen',
    'Marketing Manager',
    'I was skeptical at first, but the gratitude garden changed my perspective. I start every morning here now and feel more positive throughout my day.',
    5,
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    true,
    3
  ),
  (
    'Michael Thompson',
    'Entrepreneur',
    'As someone who struggles with anxiety, the calm breath exercises have been a lifesaver. Simple, effective, and always available when I need them.',
    5,
    'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    true,
    4
  ),
  (
    'Priya Sharma',
    'Healthcare Worker',
    'MoodLift understands the importance of mental health. The book recommendations are spot-on, and the streak feature keeps me motivated every day.',
    5,
    'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    true,
    5
  ),
  (
    'David Kim',
    'Student',
    'The mindfulness exercises help me stay focused during exams. I love how everything is backed by real psychology and designed with care.',
    5,
    'https://images.pexels.com/photos/1681010/pexels-photo-1181010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    true,
    6
  )
ON CONFLICT DO NOTHING;

-- ==============================================
-- SEED DATA - BADGES
-- ==============================================

INSERT INTO badges (name, description, points_required, icon) VALUES
  ('First Steps', 'Complete your first activity', 10, 'star'),
  ('Week Warrior', 'Maintain a 7-day streak', 50, 'flame'),
  ('Mood Master', 'Complete 10 mood assessments', 100, 'brain'),
  ('Game Champion', 'Play 50 wellness games', 150, 'trophy'),
  ('Bookworm', 'Engage with 10 book recommendations', 100, 'book'),
  ('Wellness Advocate', 'Reach 500 total points', 500, 'heart')
ON CONFLICT DO NOTHING;

-- ==============================================
-- SEED DATA - MILESTONES
-- ==============================================

INSERT INTO milestones (name, description, points_threshold, level) VALUES
  ('Beginner', 'Just getting started on your wellness journey', 0, 1),
  ('Explorer', 'Making great progress with consistent engagement', 100, 2),
  ('Achiever', 'Building strong habits and commitment', 250, 3),
  ('Champion', 'Demonstrating exceptional dedication', 500, 4),
  ('Master', 'Reached the pinnacle of wellness achievement', 1000, 5)
ON CONFLICT DO NOTHING;
