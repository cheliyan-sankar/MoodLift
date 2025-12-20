-- Add affiliate_link column to books for external affiliate/download links

ALTER TABLE books
ADD COLUMN IF NOT EXISTS affiliate_link text;
