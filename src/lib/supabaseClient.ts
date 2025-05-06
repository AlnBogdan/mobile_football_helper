import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wueyuonklqdtzftvbrmu.supabase.co'
//import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1ZXl1b25rbHFkdHpmdHZicm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MzU3ODAsImV4cCI6MjA2MjAxMTc4MH0.tU5iAUAJU9p2tQvaU7tdBFcTITpitvYeQ_CF8HY-8WE'
//import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)