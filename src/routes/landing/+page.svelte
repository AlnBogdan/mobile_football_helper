<script>
  import Header from "$lib/components/Header.svelte";
</script>

<Header />

<main class="program-container">
  <div class="download-card">
    <h1 class="program-title">Программа тренировок</h1>
    <p class="program-description">
      Ниже вы можете ознакомиться с полной программой тренировок для
      специализированных учебно-спортивных учреждений и отделений развития
      молодежного футбола в структуре клубов по футболу, средних школ – училищ
      олимпийского резерва в Республике Беларусь:
    </p>
    <div class="download-section">
      <svg class="pdf-icon" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z M8,12V18H10V12H8Z M12,12V18H14V12H12Z M16,12V18H18V12H16Z"
        />
      </svg>
      <div class="download-info">
        <h3 class="document-title">УЧЕБНАЯ ПРОГРАММА ПО ФУТБОЛУ</h3>
        <p class="document-meta">PDF документ • 2.4 MB</p>
      </div>
      <a
        href="https://abff.by/uploads/images/files/638f2c71444ee004333443.pdf"
        target="_blank"
        rel="noopener noreferrer"
        class="download-button"
      >
        Скачать
        <svg class="download-icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"
          />
        </svg>
      </a>
    </div>
  </div>
</main>

<style>
  .program-container {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 60vh;
    padding: var(--base-padding);
    background: var(--background-light, #f8fafc);
  }

  .download-card {
    background: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 4px 24px var(--shadow-color, rgba(0, 0, 0, 0.08));
    border: 1px solid var(--border-color, #e5e7eb);
    padding: 2rem 2.5rem;
    max-width: 480px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: box-shadow var(--transition-speed, 0.2s);
    gap: 1.5rem;
  }

  .download-card:hover {
    box-shadow: 0 8px 32px var(--shadow-color, rgba(0, 0, 0, 0.12));
  }

  .program-title {
    font-size: 1.5rem;
    color: var(--primary-color-dark, #1d4ed8);
    font-weight: 700;
    margin: 0.5rem 0 1rem 0;
    text-align: center;
    letter-spacing: 0.01em;
  }

  .program-description {
    color: var(--text-light, #64748b);
    font-size: 1rem;
    margin: 0 0 0.5rem 0;
    text-align: center;
    max-width: 600px;
  }

  .download-section {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    width: 100%;
  }

  .pdf-icon {
    width: 48px;
    height: 48px;
    color: var(--primary-color, #3b82f6);
    flex-shrink: 0;
  }

  .download-info {
    flex: 1 1 auto;
    min-width: 0;
  }

  .document-title {
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-dark, #22223b);
    margin: 0 0 0.25rem 0;
    text-align: left;
    line-height: 1.2;
  }

  .document-meta {
    font-size: 0.95rem;
    color: var(--text-light, #64748b);
    margin: 0;
    text-align: left;
  }

  .download-button {
    display: flex;
    align-items: center;
    gap: 0.4em;
    background: var(--primary-color, #3b82f6);
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 0.7em 1.3em;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition:
      background 0.2s,
      box-shadow 0.2s;
    box-shadow: 0 1px 5px rgba(59, 130, 246, 0.07);
    outline: none;
  }

  .download-button:hover,
  .download-button:focus {
    background: var(--primary-dark, #2563eb);
    text-decoration: none;
  }

  .download-icon {
    width: 20px;
    height: 20px;
    color: #fff;
    flex-shrink: 0;
  }

  /* Адаптивность для мобильных */
  @media (max-width: 600px) {
    .program-container {
      padding: 1rem 0.2rem;
    }
    .download-card {
      padding: 1.2rem 0.7rem;
      max-width: 96vw;
      gap: 1rem;
    }
    .program-title {
      font-size: 1.1rem;
    }
    .program-description {
      font-size: 0.97rem;
      max-width: 98vw;
    }
    .download-section {
      flex-direction: column;
      align-items: stretch;
      gap: 0.8rem;
    }
    .pdf-icon {
      margin: 0 auto 0.5rem auto;
    }
    .document-title,
    .document-meta {
      text-align: center;
    }
    .download-button {
      justify-content: center;
      width: 100%;
      font-size: 0.97rem;
      padding: 0.7em 0;
    }
  }
</style>