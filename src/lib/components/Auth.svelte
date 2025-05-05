<!-- src/lib/components/AuthForm.svelte -->
<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
  export let authMode: "login" | "signup" | "forgot" = "login";
  export let onSuccess: () => void = () => {};
  
  let email = "";
  let password = "";
  let authError = "";
  let isLoading = false;

  async function handleAuth() {
    isLoading = true;
    authError = "";

    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onSuccess();
        dispatch('authSuccess');
      } else if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        authError = "Проверьте вашу почту для подтверждения регистрации";
        authMode = "login";
      }
    } catch (error) {
      authError = error instanceof Error ? error.message : "Неизвестная ошибка";
    } finally {
      isLoading = false;
    }
  }

  async function handlePasswordReset() {
    isLoading = true;
    authError = "";

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      authError = "Инструкции по сбросу пароля отправлены на вашу почту";
    } catch (error) {
      authError = error instanceof Error ? error.message : "Неизвестная ошибка";
    } finally {
      isLoading = false;
    }
  }

  function switchMode(mode: "login" | "signup" | "forgot") {
    authMode = mode;
    authError = "";
  }
</script>

<div class="auth-container">
<h2>
  {#if authMode === "login"}Вход в аккаунт
  {:else if authMode === "signup"}Регистрация
  {:else}Восстановление пароля{/if}
</h2>

{#if authError}
  <div class="auth-error">{authError}</div>
{/if}

{#if authMode !== "forgot"}
  <input
    type="email"
    bind:value={email}
    placeholder="Email"
    disabled={isLoading}
  />
  <input
    type="password"
    bind:value={password}
    placeholder="Пароль"
    disabled={isLoading}
  />

  <button on:click={handleAuth} disabled={isLoading}>
    {#if isLoading}
      <span class="spinner"></span>
    {:else if authMode === "login"}Войти
    {:else}Зарегистрироваться{/if}
  </button>

  <div class="auth-links">
    {#if authMode === "login"}
      <button type="button" class="text-button" on:click={() => switchMode("signup")}>
        Нет аккаунта? Зарегистрируйтесь
      </button>
      <button type="button" class="text-button" on:click={() => switchMode("forgot")}>
        Забыли пароль?
      </button>
    {:else}
      <button type="button" class="text-button" on:click={() => switchMode("login")}>
        Уже есть аккаунт? Войдите
      </button>
    {/if}
  </div>
{:else}
  <input
    type="email"
    bind:value={email}
    placeholder="Email"
    disabled={isLoading}
  />

  <button on:click={handlePasswordReset} disabled={isLoading}>
    {#if isLoading}
      <span class="spinner"></span>
    {:else}
      Отправить инструкции
    {/if}
  </button>

  <div class="auth-links">
    <button type="button" class="text-button" on:click={() => switchMode("login")}>
      Вернуться ко входу
    </button>
  </div>
{/if}
</div>

<style>
.auth-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

.auth-container h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
  color: #2c3e50;
}

.auth-container input {
  display: block;
  width: 100%;
  padding: 12px 15px;
  margin: 0 0 1rem 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.auth-container button:not(.text-button) {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 10px;
  box-sizing: border-box;
  transition: background 0.2s;
}

.auth-container button:not(.text-button):hover:not(:disabled) {
  background: #2563eb;
}

.auth-error {
  color: #e74c3c;
  margin-bottom: 1rem;
  padding: 10px 12px;
  background: #fdecea;
  border-radius: 6px;
  font-size: 0.9rem;
  word-break: break-word;
}

.auth-links {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  text-align: center;
}

.text-button {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: 4px;
  width: auto;
  margin: 0 auto;
  transition: all 0.2s ease;
}

.text-button:hover {
  background: rgba(59, 130, 246, 0.1);
  text-decoration: none;
  color: #2563eb;
}

.text-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 400px) {      
  .auth-container {
    padding: 1rem;
  }
  
  .auth-container h2 {
    font-size: 1.3rem;
  }
  
  .auth-container input,
  .auth-container button:not(.text-button) {
    padding: 10px 12px;
  }
}
</style>