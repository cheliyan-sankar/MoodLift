-- Update any legacy SEO meta descriptions and Open Graph descriptions
-- that still reference the old brand name "Moodify" to "MoodLift".

-- Replace in primary meta description field
UPDATE seo_metadata
SET description = REPLACE(description, 'Moodify', 'MoodLift')
WHERE description ILIKE '%Moodify%';

-- Replace in Open Graph description field, if present
UPDATE seo_metadata
SET og_description = REPLACE(og_description, 'Moodify', 'MoodLift')
WHERE og_description ILIKE '%Moodify%';
