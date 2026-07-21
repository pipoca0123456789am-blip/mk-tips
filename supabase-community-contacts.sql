-- Rode no SQL Editor do Supabase (uma vez)
CREATE TABLE IF NOT EXISTS community_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  display_name TEXT DEFAULT '',
  whatsapp_jid TEXT DEFAULT '',
  community_jid TEXT NOT NULL,
  community_name TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (phone, community_jid)
);

ALTER TABLE community_contacts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'community_contacts' AND policyname = 'public_all'
  ) THEN
    CREATE POLICY "public_all" ON community_contacts FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_community_contacts_phone ON community_contacts (phone);
CREATE INDEX IF NOT EXISTS idx_community_contacts_community ON community_contacts (community_jid);
