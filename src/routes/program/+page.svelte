<script>
    import Header from '$lib/components/Header.svelte';
    //import PDFViewer from '$lib/components/PDFViewer.svelte';
  </script>
  
  <Header />
  
  <main>
    <h1>Программа тренировок</h1>
    <p>Ниже вы можете ознакомиться с полной программой тренировок:</p>
    
    <!--<PDFViewer />-->
  </main>
  
  <style>
    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
    
    h1 {
      color: #3b82f6;
      margin-bottom: 1rem;
    }
  </style>