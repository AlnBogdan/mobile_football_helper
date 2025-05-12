// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
/// <reference types="@sveltejs/kit" />
// src/app.d.ts
import { SupabaseClient, Session, User } from '@supabase/supabase-js'
import { Database } from './supabase.types'

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>
      getSession: () => Promise<Session | null>
      getUser: () => Promise<User | null>
      session: Session | null
    }
    interface PageData {
      session: Session | null
    }
  }
}

export interface Profile {
  id: string
  email: string
  name: string
  role: string
  created_at: string
}