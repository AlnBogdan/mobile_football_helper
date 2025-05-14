<script lang="ts">
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import AdminExercises from "$lib/components/AdminExercises.svelte";

  async function checkSession() {        
    const {data: { session },error,} = await supabase.auth.getSession();
    if (error) {  console.error("Error getting session:", error);return;}
    console.log('Текущая сессия админ:', session);     
  }

  onMount(async () => {
    await checkSession();    
  });
</script>

<AdminExercises/>


