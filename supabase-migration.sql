-- =============================================
-- MK TIPS — Supabase Migration
-- Execute no SQL Editor do Supabase Dashboard
-- =============================================

-- 1. Tipsters (criar primeiro pois users referencia)
CREATE TABLE IF NOT EXISTS tipsters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT DEFAULT '',
  specialty TEXT DEFAULT '',
  sports TEXT[] DEFAULT '{}',
  markets TEXT[] DEFAULT '{}',
  bio TEXT DEFAULT '',
  socials JSONB DEFAULT '{}',
  status TEXT DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Bloqueado', 'Pendente')),
  verified BOOLEAN DEFAULT FALSE,
  badge TEXT DEFAULT '',
  color TEXT DEFAULT '#10B981',
  stats JSONB DEFAULT '{
    "tipsCount": 0, "greens": 0, "reds": 0, "voids": 0,
    "roi": 0, "yield": 0, "profit": 0, "avgStake": 0,
    "avgOdd": 0, "accuracy": 0, "maxGreen": 0, "maxRed": 0,
    "currentStreak": 0
  }',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Users
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT DEFAULT '',
  city TEXT DEFAULT '',
  country TEXT DEFAULT 'Brasil',
  language TEXT DEFAULT 'pt-BR',
  plan TEXT DEFAULT 'Free' CHECK (plan IN ('Free', 'Starter', 'Premium', 'VIP Anual')),
  role TEXT DEFAULT 'User' CHECK (role IN ('Master', 'Admin', 'Gerente', 'Suporte', 'Financeiro', 'Tipster', 'Moderador', 'User')),
  status TEXT DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Bloqueado', 'Pendente')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ DEFAULT NOW(),
  last_login_ip TEXT DEFAULT '0.0.0.0',
  device TEXT DEFAULT '',
  os TEXT DEFAULT '',
  browser TEXT DEFAULT '',
  days_remaining INT DEFAULT 0,
  revenue_generated NUMERIC(10,2) DEFAULT 0,
  total_paid NUMERIC(10,2) DEFAULT 0,
  last_payment_date TIMESTAMPTZ,
  bankroll NUMERIC(10,2) DEFAULT 0,
  bankroll_currency TEXT DEFAULT 'R$',
  roi_individual NUMERIC(5,2) DEFAULT 0,
  cpf TEXT DEFAULT '',
  tipster_id UUID REFERENCES tipsters(id) ON DELETE SET NULL
);

-- 3. Tips
CREATE TABLE IF NOT EXISTS tips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sport TEXT NOT NULL,
  league TEXT NOT NULL,
  match TEXT NOT NULL,
  datetime TIMESTAMPTZ NOT NULL,
  market TEXT NOT NULL,
  type TEXT NOT NULL,
  odd NUMERIC(5,2) NOT NULL,
  stake NUMERIC(5,2) DEFAULT 1,
  confidence INT DEFAULT 5 CHECK (confidence >= 0 AND confidence <= 10),
  recommended_bookmaker TEXT DEFAULT '',
  affiliate_url TEXT DEFAULT '',
  tipster_id UUID REFERENCES tipsters(id) ON DELETE CASCADE,
  tipster_name TEXT DEFAULT '',
  justification TEXT DEFAULT '',
  risk_indicators TEXT[] DEFAULT '{}',
  estimated_probability NUMERIC(5,2) DEFAULT 50,
  ev NUMERIC(5,2) DEFAULT 0,
  views INT DEFAULT 0,
  favorites_count INT DEFAULT 0,
  status TEXT DEFAULT 'Pendente' CHECK (status IN ('Green', 'Red', 'Void', 'Pendente', 'Cancelada')),
  odds_comparison JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Logs
CREATE TABLE IF NOT EXISTS logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  type TEXT DEFAULT 'System' CHECK (type IN ('Auth', 'System', 'Payment', 'Audit', 'Error')),
  message TEXT NOT NULL,
  ip TEXT DEFAULT '127.0.0.1',
  device TEXT DEFAULT 'Web App',
  "user" TEXT DEFAULT 'System'
);

-- 5. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  author TEXT NOT NULL,
  operation TEXT NOT NULL,
  target TEXT DEFAULT '',
  old_value TEXT DEFAULT '',
  new_value TEXT DEFAULT '',
  ip TEXT DEFAULT '127.0.0.1',
  session TEXT DEFAULT ''
);

-- 6. Tickets
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  category TEXT DEFAULT '',
  status TEXT DEFAULT 'Aberto' CHECK (status IN ('Aberto', 'Respondido', 'Fechado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  messages JSONB DEFAULT '[]'
);

-- 7. Bankroll Logs
CREATE TABLE IF NOT EXISTS bankroll_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  value NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Favorites
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tip_id UUID REFERENCES tips(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tip_id)
);

-- 9. Referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  plan TEXT DEFAULT '',
  status TEXT DEFAULT 'Ativo',
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount TEXT NOT NULL,
  tipster_id UUID REFERENCES tipsters(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Challenge Stages
CREATE TABLE IF NOT EXISTS challenge_stages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id TEXT NOT NULL,
  step_number INT DEFAULT 1,
  match TEXT NOT NULL,
  sport TEXT DEFAULT '',
  market TEXT DEFAULT '',
  odd NUMERIC(5,2) DEFAULT 1.5,
  stake_suggested NUMERIC(5,2) DEFAULT 10,
  time TEXT DEFAULT '',
  justification TEXT DEFAULT '',
  status TEXT DEFAULT 'Pendente',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS + Políticas públicas (temporárias)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipsters ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bankroll_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_all" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON tipsters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON tips FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON bankroll_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON favorites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON referrals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON coupons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON challenge_stages FOR ALL USING (true) WITH CHECK (true);

-- Seed Admin
INSERT INTO users (name, email, phone, city, country, language, plan, role, status, days_remaining)
VALUES ('Admin Master', 'admin@mktips.com', '+55 (11) 99999-9999', 'Curitiba', 'Brasil', 'pt-BR', 'VIP Anual', 'Master', 'Ativo', 365)
ON CONFLICT (email) DO NOTHING;

-- Credentials for client login (service role / public policies)
CREATE TABLE IF NOT EXISTS user_credentials (
  email TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON user_credentials FOR ALL USING (true) WITH CHECK (true);
