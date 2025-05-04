<script>
    import Header from '$lib/components/Header.svelte';
</script>
  
<Header />

<main class="program-container">
    <h1 class="program-title">Программа тренировок</h1>
    <p class="program-description">Ниже вы можете ознакомиться с полной программой тренировок для специализированных учебно-спортивных учреждений и отделений развития молодежного футбола в структуре клубов по футболу, средних школ – училищ олимпийского резерва в Республике Беларусь:</p>
    
    <div class="download-card">
      <svg class="pdf-icon" viewBox="0 0 24 24">
        <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z M8,12V18H10V12H8Z M12,12V18H14V12H12Z M16,12V18H18V12H16Z"/>
      </svg>
      <div class="download-info">
        <h3 class="document-title">УЧЕБНАЯ ПРОГРАММА ПО ФУТБОЛУ</h3>
        <p class="document-meta">PDF документ • 2.4 MB</p>
      </div>
      <a href="https://abff.by/uploads/images/files/638f2c71444ee004333443.pdf" target="_blank" rel="noopener noreferrer" class="download-button">
        Скачать
        <svg class="download-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
        </svg>
      </a>
    </div>
</main>

<style>
  :root {
    --primary-color: #3b82f6;
    --primary-hover: #2563eb;
    --text-color: #333;
    --light-gray: #f5f7fa;
    --border-color: #e1e5eb;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
  }

  .program-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  }

  .program-title {
    color: var(--primary-color);
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
    font-weight: 700;
    text-align: center;
    position: relative;
    padding-bottom: 0.5rem;
  }

  .program-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: var(--primary-color);
  }

  .program-description {
    color: var(--text-color);
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2.5rem;
    text-align: center;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .download-card {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: var(--shadow);
    border: 1px solid var(--border-color);
    transition: var(--transition);
    margin: 0 auto;
    max-width: 600px;
  }

  .download-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .pdf-icon {
    width: 48px;
    height: 48px;
    color: #e74c3c;
    margin-right: 1.5rem;
    flex-shrink: 0;
  }

  .download-info {
    flex-grow: 1;
  }

  .document-title {
    color: var(--text-color);
    font-size: 1.2rem;
    margin: 0 0 0.3rem 0;
    font-weight: 600;
  }

  .document-meta {
    color: #666;
    font-size: 0.9rem;
    margin: 0;
  }

  .download-button {
    display: inline-flex;
    align-items: center;
    background: var(--primary-color);
    color: white;
    padding: 0.7rem 1.5rem;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: var(--transition);
    margin-left: 1.5rem;
    white-space: nowrap;
  }

  .download-button:hover {
    background: var(--primary-hover);
    transform: translateY(-2px);
  }

  .download-icon {
    width: 20px;
    height: 20px;
    margin-left: 0.5rem;
  }

  @media (max-width: 768px) {
    .program-container {
      padding: 1.5rem;
    }
    
    .download-card {
      flex-direction: column;
      text-align: center;
      padding: 1.5rem;
    }
    
    .pdf-icon {
      margin-right: 0;
      margin-bottom: 1rem;
    }
    
    .download-button {
      margin: 1.5rem 0 0 0;
      width: 100%;
      justify-content: center;
    }
  }
</style>