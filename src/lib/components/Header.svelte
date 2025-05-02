<script lang="ts">
  import { onMount } from 'svelte';
  
  let isLoggedIn = false;
  let activeNavItem = 'landing'; // Значение по умолчанию
  
  // При загрузке страницы проверяем текущий путь
  onMount(() => {
    const path = window.location.pathname;
    if (path.includes('trains')) activeNavItem = 'trains';
    else if (path.includes('calendar')) activeNavItem = 'calendar';
    else if (path.includes('profile')) activeNavItem = 'profile';
    else activeNavItem = 'landing';
  });
  
  function setActive(item: string): void {
    activeNavItem = item;
  }
</script>

<header class="app-header">
  <div class="header-top">
    <div class="container">
      <div class="header-logo">
        <a href="/" aria-label="Логотип Помощник">
          <img src="https://www.svgrepo.com/show/490538/ball-football.svg" alt="Логотип" width="36" height="36">                 
        </a>
        <span class="logo-text">Мобильный помощник тренера</span>
      </div>
      <div class="header-actions">
        <button class="btn-login" aria-label="{isLoggedIn ? 'Выйти' : 'Войти'}">
          {#if isLoggedIn}Выйти{:else}Войти{/if}
        </button>
      </div>
    </div>
  </div>  

  <nav class="header-nav" aria-label="Основная навигация">
    <div class="container">
      <ul class="nav-menu">
        <li class:active={activeNavItem === 'landing'}>
          <a href="/landing" class="nav-link" on:click={() => setActive('landing')}>Главная</a>
        </li>
        <li class:active={activeNavItem === 'trains'}>
          <a href="/trains" class="nav-link" on:click={() => setActive('trains')}>Тренировка</a>
        </li>
        <li class:active={activeNavItem === 'calendar'}>
          <a href="/calendar" class="nav-link" on:click={() => setActive('calendar')}>Календарь</a>
        </li>
        <li class:active={activeNavItem === 'profile'}>
          <a href="/profile" class="nav-link" on:click={() => setActive('profile')}>Профиль</a>
        </li>
      </ul>
    </div>
  </nav>
</header>

<style>
  :root {
    --primary-color: #3b82f6;
    --primary-hover: #2563eb;
    --text-white: #ffffff;
    --bg-white: #ffffff;
    --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    --transition: all 0.2s ease;
  }

  .app-header {
    font-family: Arial, sans-serif;
    box-shadow: var(--shadow);
    position: relative;
    z-index: 100;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }
  
  /* Header Top Styles */
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
    border-radius: 4px;
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
  
  /* Navigation Styles */
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
    content: '';
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
    width: 50% !important;
  }
  
  /* Mobile Styles */
  @media (max-width: 768px) {
    .app-header {
      position: relative;
      padding-bottom: 0px; /* Для фиксированного меню */
    }
    
    .header-top {
      position: sticky;
      top: 0;
      z-index: 101;
      padding: 10px 0;
    }
    
    .header-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
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
    
    /* Иконки */
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
      mask-image: url('https://cdn-icons-png.flaticon.com/128/553/553376.png');
    }
    .nav-menu li:nth-child(2) .nav-link::before {
      mask-image: url('https://cdn-icons-png.flaticon.com/128/94/94174.png');
    }
    .nav-menu li:nth-child(3) .nav-link::before {
      mask-image: url('https://cdn-icons-png.flaticon.com/128/7691/7691413.png');
    }
    .nav-menu li:nth-child(4) .nav-link::before {
      mask-image: url('https://cdn-icons-png.flaticon.com/128/64/64572.png');
    }
    .nav-menu li.active .nav-link {
      background: rgba(255, 255, 255, 0.15);
    }
    
    .nav-menu li.active .nav-link::before {
      background-color: #f8f8f8; /* Более яркий цвет для активной иконки */
    }
  }
</style>