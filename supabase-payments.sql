-- Rode no SQL Editor do Supabase (uma vez)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email TEXT,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  plan TEXT DEFAULT '',
  product_type TEXT DEFAULT 'plan',
  transaction_id TEXT,
  status TEXT DEFAULT 'paid',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'public_all'
  ) THEN
    CREATE POLICY "public_all" ON payments FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
