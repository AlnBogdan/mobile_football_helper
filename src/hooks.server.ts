// src/hooks.server.ts
import { supabase } from '$lib/supabaseClient';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Получаем сессию из cookies
  const session = event.cookies.get('sb-access-token');
  
  if (session) {
    try {
      // Проверяем сессию через Supabase
      const { data: { user }, error } = await supabase.auth.getUser(session);
      
      if (!error && user) {
        // Добавляем пользователя в locals
        event.locals.user = {
          email: user.email ?? '',
          id: user.id
        };
        return await resolve(event);
      }
    } catch (error) {
      console.error('Error validating session:', error);
    }
  }

  // Если нет сессии или произошла ошибка
  event.locals.user = null;
  return await resolve(event);
};