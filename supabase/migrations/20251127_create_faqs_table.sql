-- Create FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page VARCHAR(100) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on page for quick filtering
CREATE INDEX idx_faqs_page ON faqs(page);
CREATE INDEX idx_faqs_active ON faqs(active);

-- Enable RLS
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Admin can read all FAQs
CREATE POLICY "Admin can read all FAQs"
  ON faqs FOR SELECT
  USING (true);

-- Admin can insert FAQs (via service role)
CREATE POLICY "Admin can insert FAQs"
  ON faqs FOR INSERT
  WITH CHECK (true);

-- Admin can update FAQs (via service role)
CREATE POLICY "Admin can update FAQs"
  ON faqs FOR UPDATE
  USING (true);

-- Admin can delete FAQs (via service role)
CREATE POLICY "Admin can delete FAQs"
  ON faqs FOR DELETE
  USING (true);
