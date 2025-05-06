<script>
  import Header from "$lib/components/Header.svelte";
</script>

<Header />

<main class="container">
  <div class="message-block">
    <h1>Страница в разработке</h1>
    <p>
      Мы работаем над этим разделом. Скоро здесь появится что-то интересное!
    </p>
  </div>
</main>

<style>
  .container {
    margin-top: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--base-padding);
    background: var(--background-light);
  }

  .message-block {
    background: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 4px 24px var(--shadow-color);
    border: 1px solid var(--border-color);
    padding: 2rem 2.5rem;
    max-width: 420px;
    width: 100%;
    text-align: center;
    transition: box-shadow var(--transition-speed);
  }

  .message-block:hover {
    box-shadow: 0 8px 32px var(--shadow-color);
  }

  h1 {
    margin: 0.5rem 0 1rem;
    font-size: 1.5rem;
    color: var(--primary-color-dark);
    font-weight: 700;
    letter-spacing: 0.01em;
  }

  p {
    color: var(--text-light);
    font-size: 1rem;
    margin: 0;
  }

  @media (max-width: 600px) {
    .message-block {
      padding: 1.2rem 1rem;
      max-width: 85vw;
    }
    h1 {
      font-size: 1.1rem;
    }
    p {
      font-size: 0.95rem;
    }
  }
</style>