<!-- src/lib/components/AuthForm.svelte -->
<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  export let authMode: "login" | "signup" | "forgot" = "login";

  let email = "";
  let password = "";
  let authError = "";
  let isLoading = false;
  let successMessage = "";

  async function handleSubmit(event: Event) {
    event.preventDefault(); // Используем стандартное предотвращение поведения формы

    isLoading = true;
    authError = "";
    successMessage = "";

    try {
      if (authMode === "login") {
        console.log("Пытаюсь войти..."); // <- Добавьте это
        const { error } = await supabase.auth.signInWithPassword({email,password,});
        if (error) throw error; 
        
        // Принудительная проверка сессии
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Текущая сессия:', session);
        //const redirectTo = $page.url.searchParams.get('redirectTo') || '/admin';
        //goto(redirectTo);
      } else if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: "user" },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        if (data?.user?.identities?.length === 0) {
          authError = "Пользователь с таким email уже существует";
          return;
        }

        successMessage = "Проверьте вашу почту для подтверждения регистрации";
        authMode = "login";
      }
    } catch (error) {
      authError = error instanceof Error ? error.message : "Неизвестная ошибка";
    } finally {
      isLoading = false;
    }
  }

  async function handlePasswordReset(event: Event) {
    event.preventDefault(); // Используем стандартное предотвращение поведения формы

    isLoading = true;
    authError = "";

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;
      successMessage = "Инструкции по сбросу пароля отправлены на вашу почту";
    } catch (error) {
      authError = error instanceof Error ? error.message : "Неизвестная ошибка";
    } finally {
      isLoading = false;
    }
  }

  function switchMode(mode: "login" | "signup" | "forgot") {
    authMode = mode;
    authError = "";
    successMessage = "";
  }
</script>

<div class="auth-container">
  <h2>
    {#if authMode === "login"}Вход в систему
    {:else if authMode === "signup"}Регистрация
    {:else}Восстановление пароля{/if}
  </h2>

  {#if authError}
    <div class="auth-error">{authError}</div>
  {/if}

  {#if successMessage}
    <div class="success-message">{successMessage}</div>
  {/if}

  <form
    on:submit|preventDefault={authMode === "forgot"
      ? handlePasswordReset
      : handleSubmit}
  >
    <input
      type="email"
      bind:value={email}
      placeholder="Email"
      disabled={isLoading}
      required
    />

    {#if authMode !== "forgot"}
      <input
        type="password"
        bind:value={password}
        placeholder="Пароль"
        disabled={isLoading}
        required
        minlength="6"
      />
    {/if}

    <button type="submit" disabled={isLoading}>
      {#if isLoading}
        <span class="spinner"></span>
      {:else if authMode === "login"}
        Войти
      {:else if authMode === "signup"}
        Зарегистрироваться
      {:else}
        Отправить инструкции
      {/if}
    </button>
  </form>

  <div class="auth-links">
    {#if authMode === "login"}
      <button
        type="button"
        class="text-button"
        on:click={() => switchMode("signup")}
      >
        Нет аккаунта? Зарегистрируйтесь
      </button>
      <button
        type="button"
        class="text-button"
        on:click={() => switchMode("forgot")}
      >
        Забыли пароль?
      </button>
    {:else if authMode === "signup"}
      <button
        type="button"
        class="text-button"
        on:click={() => switchMode("login")}
      >
        Уже есть аккаунт? Войдите
      </button>
    {:else}
      <button
        type="button"
        class="text-button"
        on:click={() => switchMode("login")}
      >
        Вернуться ко входу
      </button>
    {/if}
  </div>
</div>

<style>
  .auth-container {
    background: #fff;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: 0 auto;
    font-family: inherit;
  }

  /* Гарантируем одинаковое поведение размеров для всех элементов */
  .auth-container,
  .auth-container * {
    box-sizing: border-box;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
    color: var(--text-dark, #222);
  }

  form {
    width: 100%;
  }

  /* Все поля формы и кнопка одной ширины */
  input,
  button[type="submit"] {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 0.75rem;
    font-size: 1rem;
    border-radius: 4px;
  }

  /* Стили для инпутов */
  input {
    border: 1px solid var(--border-color, #e5e7eb);
    margin-bottom: 1rem;
    background: #fafafa;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: var(--primary-color, #3b82f6);
    background: #fff;
  }

  /* Кнопка отправки */
  button[type="submit"] {
    background: var(--primary-color, #3b82f6);
    color: #fff;
    border: none;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  button[type="submit"]:hover:not(:disabled) {
    background: var(--primary-dark, #2563eb);
  }

  button[type="submit"]:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* Сообщения об ошибке и успехе */
  .auth-error {
    color: var(--error-color, #b91c1c);
    padding: 0.75rem;
    margin-bottom: 1rem;
    background: #fee2e2;
    border-radius: 4px;
    font-size: 0.95rem;
  }

  .success-message {
    color: var(--success-color, #059669);
    padding: 0.75rem;
    margin-bottom: 1rem;
    background: #d1fae5;
    border-radius: 4px;
    font-size: 0.95rem;
  }

  /* Ссылки под формой */
  .auth-links {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .text-button {
    background: none;
    border: none;
    color: var(--primary-color, #3b82f6);
    text-decoration: underline;
    cursor: pointer;
    font-size: 0.97rem;
    padding: 0.25rem;
    transition: color 0.2s;
  }

  .text-button:hover {
    text-decoration: none;
    color: var(--primary-dark, #2563eb);
  }

  /* Спиннер загрузки */
  .spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s linear infinite;
    vertical-align: middle;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Адаптивность для мобильных */
  @media (max-width: 500px) {
    .auth-container {
      padding: 1rem;
      max-width: 98vw;
    }
    input,
    button[type="submit"] {
      font-size: 1rem;
      padding: 0.6rem;
    }
  }
</style>