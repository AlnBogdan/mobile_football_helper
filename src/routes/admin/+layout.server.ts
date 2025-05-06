import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const user = await locals.getUser();
  
  // Перенаправляем неавторизованных
  if (!user) {
    throw redirect(303, '/auth/signin?redirectTo=/admin');
  }
  
  // Перенаправляем не-админов
  if (user.role !== 'admin') {
    throw redirect(303, '/?error=admin_required');
  }

  return { user };
};