-- Add canonical_url column to seo_metadata table
ALTER TABLE seo_metadata
ADD COLUMN canonical_url TEXT;

-- Set default canonical_url based on page_url for existing records
UPDATE seo_metadata 
SET canonical_url = 'https://moodlift.app' || page_url 
WHERE canonical_url IS NULL;
