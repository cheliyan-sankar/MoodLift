-- Add OG title and OG description columns to seo_metadata table
ALTER TABLE seo_metadata
ADD COLUMN og_title TEXT,
ADD COLUMN og_description TEXT;
