-- Add cover image URLs to games and books tables

-- Add cover_image_url to games table if not exists
ALTER TABLE games ADD COLUMN IF NOT EXISTS cover_image_url text;

-- Add cover_image_url to books table if not exists  
ALTER TABLE books ADD COLUMN IF NOT EXISTS cover_image_url text;

-- Create indexes for quick filtering
CREATE INDEX IF NOT EXISTS idx_games_cover_image ON games(cover_image_url);
CREATE INDEX IF NOT EXISTS idx_books_cover_image ON books(cover_image_url);
