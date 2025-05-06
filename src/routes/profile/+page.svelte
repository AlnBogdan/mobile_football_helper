<script lang="ts">
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import AuthForm from "$lib/components/Auth.svelte";
  import Header from "$lib/components/Header.svelte";

  let isLoggedIn = false;
  let userEmail = "";
  let userData: any = null;
  let isLoading = true;

  async function checkSession() {
    isLoading = true;
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      isLoading = false;
      return;
    }

    isLoggedIn = !!session?.user;
    userEmail = session?.user?.email || "";

    if (isLoggedIn && session?.user) {
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (!profileError) {
        userData = data;
      }
    }
    isLoading = false;
  }

  onMount(async () => {
    await checkSession();

    supabase.auth.onAuthStateChange((event, session) => {
      checkSession();
    });
  });

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error);
  }

  // Обработчик успешной аутентификации
  function handleAuthSuccess() {
    checkSession();
  }
</script>

<Header />

<main class="page-content">
  {#if isLoading}
    <div class="loading">Загрузка...</div>
  {:else if isLoggedIn}
    <div class="profile-container">
      <h2>Ваш профиль</h2>
      <div class="profile-info">
        <div class="info-item">
          <span class="info-label">Email:</span>
          <span class="info-value">{userEmail}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Имя:</span>
          <span class="info-value">{userData.name}</span>
        </div>
        {#if userData?.role}
          <div class="info-item">
            <span class="info-label">Роль:</span>
            <span class="info-value">{userData.role}</span>
          </div>
        {/if}
      </div>
      <button on:click={handleLogout} class="logout-btn">Выйти</button>
    </div>
  {:else}
    <AuthForm authMode="login" on:authSuccess={handleAuthSuccess} />
  {/if}
</main>

<style>
  .page-content {
    margin-top: 2rem; /* Основной отступ от хедера */
    padding: 0 1rem; /* Боковые отступы для мобильных */
  }

  .profile-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 1.5rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  /* Остальные стили без изменений */
  .profile-info {
    margin: 2rem 0;
  }

  .info-item {
    margin-bottom: 1rem;
  }

  .info-label {
    font-weight: bold;
    margin-right: 0.5rem;
  }

  .logout-btn {
    background: #ef4444;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .loading {
    text-align: center;
    padding: 2rem;
  }

  /* Адаптивные отступы */
  @media (max-width: 768px) {
    .page-content {
      margin-top: 1.5rem;
      padding: 0 0.5rem;
    }
  }
</style>
