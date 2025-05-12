<script lang="ts">
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import AuthForm from "$lib/components/Auth.svelte";  

  let isLoggedIn = false;
  let activeNavItem = "landing";
  let showAuthModal = false;
  let userEmail = "";

  onMount(() => {
    // Проверка пути
    const path = window.location.pathname;
    if (path.includes("trains")) activeNavItem = "trains";
    else if (path.includes("calendar")) activeNavItem = "calendar";
    else if (path.includes("profile")) activeNavItem = "profile";
    else activeNavItem = "landing";

    // Подписка на изменения состояния аутентификации
    supabase.auth.onAuthStateChange((event, session) => {
      isLoggedIn = !!session?.user;
      userEmail = session?.user?.email || "";
      if (isLoggedIn) showAuthModal = false; // Закрываем модальное окно при успешной авторизации
    });

    // Первоначальная проверка сессии
    checkSession();
  });

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    isLoggedIn = !!session?.user;
    userEmail = session?.user?.email || "";
  }

  function setActive(item: string): void {
    activeNavItem = item;
  }    

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  // Обработчик успешной авторизации
  function handleAuthSuccess() {
    showAuthModal = false; // Закрываем модальное окно
    checkSession(); // Обновляем состояние авторизации
  }
</script>

<header class="app-header">
  <div class="header-top">
    <div class="container">
      <div class="header-logo">
        <a href="/" aria-label="Логотип Помощник">
          <img
            src="https://www.svgrepo.com/show/490538/ball-football.svg"
            alt="Логотип"
            width="36"
            height="36"
          />
        </a>
        <span class="logo-text">BlockBYFootball</span>
      </div>
      <div class="header-actions">
        {#if isLoggedIn}
          <span class="user-email">{userEmail}</span>
          <button class="btn-login" on:click={handleLogout}>Выйти</button>
        {:else}
          <button class="btn-login" on:click={() => (showAuthModal = true)}>
            Войти
          </button>
        {/if}
      </div>
    </div>
  </div>

  <nav class="header-nav" aria-label="Основная навигация">    
    <div class="container">
      <ul class="nav-menu">
        <li class:active={activeNavItem === "landing"}>
          <a href="/landing" class="nav-link" on:click={() => setActive("landing")}>
            Главная
          </a>
        </li>
        <li class:active={activeNavItem === "trains"}>
          <a href="/trains" class="nav-link" on:click={() => setActive("trains")}>
            Тренировка
          </a>
        </li>
        <li class:active={activeNavItem === "calendar"}>
          <a href="/calendar" class="nav-link" on:click={() => setActive("calendar")}>
            Календарь
          </a>
        </li>
        <li class:active={activeNavItem === "profile"}>
          <a href="/profile" class="nav-link" on:click={() => setActive("profile")}>
            Профиль
          </a>
        </li>
      </ul>
    </div>
  </nav>
</header>

<!-- Модальное окно авторизации -->
{#if showAuthModal}
  <div class="auth-modal show">
    <div class="auth-content">
      <button on:click={() => showAuthModal = false}>×</button>
      <AuthForm 
        authMode="login"
        on:authSuccess={handleAuthSuccess}
      />
    </div>
  </div>
{/if}

<style>
  :root {
    --primary-color: #3b82f6;
    --primary-hover: #2563eb;
    --text-white: #ffffff;
    --bg-white: #ffffff;
    --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --error-color: #e74c3c;
    --error-bg: #fdecea;
    --border-radius: 8px;
    --zindex-modal: 2000;
    --zindex-header: 1000;
  }

    :global(body) {
        background-color: #f5f7fa;
        margin: 0;
        padding: 0;
        font-family: "Segoe UI", system-ui, sans-serif;
        line-height: 1.4;
        transition:
            background-color 0.3s,
            color 0.3s;
    }
  

  /* Основные стили шапки */
  .app-header {
    font-family: "Segoe UI", system-ui, sans-serif;
    box-shadow: var(--shadow);
    position: relative;
    z-index: var(--zindex-header);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }

  /* Верхняя часть шапки */
  .header-top {
    background: var(--bg-white);
    padding: 12px 0;
    border-bottom: 1px solid #e6e6e6;
  }

  .header-top .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .header-logo img {
    height: 36px;
    width: 36px;
    transition: var(--transition);
  }

  .logo-text {
    font-weight: 600;
    color: var(--primary-color);
    font-size: 1.2rem;
  }

  .btn-login {
    padding: 8px 16px;
    border-radius: var(--border-radius);
    font-weight: 600;
    cursor: pointer;
    background: var(--primary-color);
    color: var(--text-white);
    border: none;
    transition: var(--transition);
  }

  .btn-login:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
  }

  .btn-login:active {
    transform: scale(0.98);
  }

  /* Навигационное меню */
  .header-nav {
    background: var(--primary-color);
  }

  .nav-menu {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    justify-content: center;
  }

  .nav-link {
    color: var(--text-white);
    text-decoration: none;
    padding: 14px 20px;
    display: block;
    font-size: 15px;
    transition: var(--transition);
    position: relative;
  }

  .nav-link:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .nav-link::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--text-white);
    transition: var(--transition);
    transform: translateX(-50%);
  }

  .nav-link:hover::after {
    width: 50%;
  }

  .nav-menu li.active .nav-link {
    font-weight: 600;
    background: rgba(255, 255, 255, 0.2);
  }

  .nav-menu li.active .nav-link::after {
    width: 50%;
  }

  /* Мобильные стили */
  @media (max-width: 768px) {
    .app-header {
      position: relative;
      padding-bottom: 0;
    }

    .header-top {
      position: sticky;
      top: 0;
      z-index: 1101;
      padding: 10px 0;
    }

    .header-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1100;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    }

    .nav-menu {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      padding: 0;
    }

    .nav-link {
      padding: 12px 5px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .nav-link::after {
      display: none;
    }

    /* Иконки для мобильного меню */
    .nav-link::before {
      content: "";
      display: block;
      width: 24px;
      height: 24px;
      background-color: var(--text-white);
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
    }

    .nav-menu li:nth-child(1) .nav-link::before {
      mask-image: url("https://cdn-icons-png.flaticon.com/128/553/553376.png");
    }
    .nav-menu li:nth-child(2) .nav-link::before {
      mask-image: url("https://cdn-icons-png.flaticon.com/128/94/94174.png");
    }
    .nav-menu li:nth-child(3) .nav-link::before {
      mask-image: url("https://cdn-icons-png.flaticon.com/128/7691/7691413.png");
    }
    .nav-menu li:nth-child(4) .nav-link::before {
      mask-image: url("https://cdn-icons-png.flaticon.com/128/64/64572.png");
    }

    .nav-menu li.active .nav-link {
      background: rgba(255, 255, 255, 0.15);
    }

    .nav-menu li.active .nav-link::before {
      background-color: #f8f8f8;
    }
  }

  /* Стили модального окна */
  .auth-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: var(--zindex-modal);
    padding: 20px;
    box-sizing: border-box;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }

  .auth-modal.show {
    opacity: 1;
    visibility: visible;
  }

  .auth-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 100%;
    max-width: 420px;
    position: relative;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    transform: translateY(-20px);
    transition: transform 0.3s ease;
  }

  .auth-modal.show .auth-content {
    transform: translateY(0);
  }

  .auth-content > button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    padding: 4px;
    line-height: 1;
    transition: color 0.2s;
  }

  .auth-content > button:hover {
    color: #333;
  }

  /* Адаптивные стили */
  @media (max-width: 480px) {
    .auth-content {
      padding: 1.5rem;
      max-width: 95%;
    }
  }

  @media (max-width: 360px) {
    .auth-content {
      padding: 1.2rem;
    }
    
    .auth-content > button {
      top: 10px;
      right: 10px;
      font-size: 1.3rem;
    }
  }
</style>