import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = await locals.getUser();
  if (!user || user.role !== 'admin') throw redirect(303, '/');
  
  return {
    // Дополнительные данные страницы
  };
};