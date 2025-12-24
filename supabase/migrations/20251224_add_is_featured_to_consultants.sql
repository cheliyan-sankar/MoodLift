-- Migration: add is_featured column to consultants
ALTER TABLE public.consultants
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Optionally mark some existing consultants as featured using their ids:
-- UPDATE public.consultants SET is_featured = true WHERE id IN ('...');
