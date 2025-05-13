<script>
  import Header from "$lib/components/Header.svelte";
</script>

<Header />

<main class="container">
  <div class="download-card">
    <h1 class="program-title">Программа тренировок</h1>
    <p class="program-description">
      Ниже вы можете ознакомиться с полной программой тренировок для
      специализированных учебно-спортивных учреждений и отделений развития
      молодежного футбола в структуре клубов по футболу, средних школ – училищ
      олимпийского резерва в Республике Беларусь:
    </p>
    <div class="download-section">      
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
    color: var(--primary-color-dark);
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
        
    .download-card {
      padding: 1.5rem 1rem;
      max-width: 100%;
      border-radius: 0.5rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid #e5e7eb;
    }
    
    .program-title {
      font-size: 1.3rem;
      margin-bottom: 0.8rem;
    }
    
    .program-description {
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 1rem;
    }
    
    .download-section {
      flex-direction: column;
      gap: 1rem;
    }
    
    .download-info {
      text-align: center;
      width: 100%;
    }
    
    .document-title {
      font-size: 1.05rem;
      margin-bottom: 0.3rem;
    }
    
    .document-meta {
      font-size: 0.9rem;
    }
    
    .download-button {
      width: 100%;
      padding: 0.8rem;
      font-size: 1rem;
      justify-content: center;
      border-radius: 0.4rem;
    }
    
    .download-icon {
      width: 18px;
      height: 18px;
    }
  }

  /* Для очень маленьких экранов */
  @media (max-width: 400px) {
    .program-title {
      font-size: 1.2rem;
    }
    
    .program-description {
      font-size: 0.92rem;
    }
    
    .download-button {
      padding: 0.7rem;
      font-size: 0.95rem;
    }
  }
</style>