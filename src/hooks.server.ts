// src/hooks.server.ts
import { supabase } from '$lib/supabaseClient'
import type { Handle } from '@sveltejs/kit'
import type { Session, User } from '@supabase/supabase-js'

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.getSession = async (): Promise<Session | null> => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }

  event.locals.getUser = async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  event.locals.session = await event.locals.getSession()

  return resolve(event)
}