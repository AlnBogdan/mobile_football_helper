// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wueyuonklqdtzftvbrmu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1ZXl1b25rbHFkdHpmdHZicm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MzU3ODAsImV4cCI6MjA2MjAxMTc4MH0.tU5iAUAJU9p2tQvaU7tdBFcTITpitvYeQ_CF8HY-8WE';

const isBrowser = typeof window !== 'undefined'
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: false,
    persistSession: true,
    autoRefreshToken: true,
    storage: isBrowser ? {
      getItem: (key) => localStorage.getItem(key),
      setItem: (key, value) => localStorage.setItem(key, value),
      removeItem: (key) => localStorage.removeItem(key)
    } : undefined
  }
})