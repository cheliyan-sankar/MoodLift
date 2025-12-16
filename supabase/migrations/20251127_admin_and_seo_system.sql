-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create seo_metadata table
CREATE TABLE IF NOT EXISTS seo_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT,
  og_image TEXT,
  twitter_card TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users (only accessible to admins)
CREATE POLICY "Admins can view admin_users" ON admin_users
  FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins can update admin_users" ON admin_users
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM admin_users));

-- RLS Policies for seo_metadata (public read, admin write)
CREATE POLICY "Anyone can read seo_metadata" ON seo_metadata
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert seo_metadata" ON seo_metadata
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins can update seo_metadata" ON seo_metadata
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins can delete seo_metadata" ON seo_metadata
  FOR DELETE USING (auth.uid() IN (SELECT id FROM admin_users));

-- Insert default SEO metadata for main pages
INSERT INTO seo_metadata (page_url, title, description, keywords) VALUES
  ('/', 'Mindful Living - Mental Health & Wellness', 'Explore grounding techniques, wellness games, book recommendations and mental health resources for a healthier mind.', 'mental health, wellness, grounding techniques, anxiety relief'),
  ('/discover', 'Discover - Mindful Activities & Resources', 'Discover our collection of wellness games, breathing exercises, and curated mental health book recommendations.', 'activities, games, books, mental health'),
  ('/books', 'Book Recommendations - Mental Health Reading', 'Explore curated book recommendations on mental health, mindfulness, and personal wellness.', 'books, reading, mental health, mindfulness'),
  ('/games', 'Wellness Games & Grounding Techniques', 'Interactive games and breathing exercises designed to help with anxiety, stress, and emotional well-being.', 'games, breathing, grounding, anxiety relief')
ON CONFLICT (page_url) DO NOTHING;
