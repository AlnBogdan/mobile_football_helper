<script lang="ts">
  import { page } from '$app/stores';
  import type { Session } from '@supabase/supabase-js';
  import "../styles/global.css";
  
  // Вариант 1: Если data действительно не используется в компоненте
  export const data: { session: Session | null } = $page.data;
  
  // Вариант 2: Если нужно сохранить реактивность
  // export let data: { session: Session | null };
  // $: data = $page.data;
</script>

<slot />

<script context="module" lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return { session: session || null };
  };
</script>