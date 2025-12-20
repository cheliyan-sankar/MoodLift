-- Add book_file_url column to books for uploaded book files

ALTER TABLE books
ADD COLUMN IF NOT EXISTS book_file_url text;
