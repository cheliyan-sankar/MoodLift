-- Remove rating column from testimonials table
-- This aligns the database schema with the application code,
-- which no longer uses a rating field for testimonials.

ALTER TABLE testimonials
  DROP COLUMN IF EXISTS rating;
