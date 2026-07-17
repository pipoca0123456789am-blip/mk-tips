import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const isValidUrl = (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')) && supabaseAnonKey.length > 0

// Create a dummy proxy object if Supabase is not fully configured to avoid null reference crashes
const dummySupabase = new Proxy({} as any, {
  get() {
    return () => dummySupabase
  }
})

export const supabase: SupabaseClient = isValidUrl
  ? createClient(supabaseUrl, supabaseAnonKey)
  : dummySupabase

export const isSupabaseConfigured = isValidUrl
