-- Add missing columns to books table for cover images and recommendations

ALTER TABLE books
ADD COLUMN IF NOT EXISTS cover_image_url text,
ADD COLUMN IF NOT EXISTS recommended_by text,
ADD COLUMN IF NOT EXISTS recommendation_reason text,
ADD COLUMN IF NOT EXISTS amazon_affiliate_link text,
ADD COLUMN IF NOT EXISTS flipkart_affiliate_link text;

-- Add missing columns to games table for cover images
ALTER TABLE games
ADD COLUMN IF NOT EXISTS cover_image_url text;
