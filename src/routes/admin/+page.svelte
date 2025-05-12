<script lang="ts">
  import { page } from '$app/stores';
  
  // Доступ к сессии через $page.data
  $: user = $page.data.session?.user;
</script>

{#if user}
  <p>Welcome, {user.email}!</p>
{/if}