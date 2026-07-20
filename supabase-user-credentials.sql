-- Rode no SQL Editor do Supabase (uma vez) para login entre dispositivos
CREATE TABLE IF NOT EXISTS user_credentials (
  email TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_credentials ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_credentials' AND policyname = 'public_all'
  ) THEN
    CREATE POLICY "public_all" ON user_credentials FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
