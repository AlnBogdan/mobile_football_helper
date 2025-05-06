// src/hooks.server.ts
import { supabase } from '$lib/supabaseClient';
import type { Handle } from '@sveltejs/kit';
import type { AppUser } from '$lib/types';

export const handle: Handle = async ({ event, resolve }) => {
  // Инициализация Supabase в locals
  event.locals.supabase = supabase;

  // Получение сессии
  event.locals.getSession = async () => {
    const { data: { session } } = await event.locals.supabase.auth.getSession();
    return session;
  };

  // Получение пользователя с ролью
  event.locals.getUser = async (): Promise<AppUser | null> => {
    const session = await event.locals.getSession();
    if (!session) return null;

    const { data: profile } = await event.locals.supabase
      .from('profiles')
      .select('username, role')
      .eq('id', session.user.id)
      .single();

    return {
      id: session.user.id,
      email: session.user.email,
      role: profile?.role || 'user',
      username: profile?.username
    };
  };

  return resolve(event);
};