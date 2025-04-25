<script lang="ts" >
    import { fade } from "svelte/transition";

    let selectedDateStart = ''; 
    let selectedDateEnd = ''; 
    let selectedAge = ''; 
    let selectedDays: number[] = []; // Массив для хранения выбранных дней
    let CountDays =0;
    
    const DAYS = [
    
    { id: 0, name: 'Вс' },
    { id: 1, name: 'Пн' },
    { id: 2, name: 'Вт' },
    { id: 3, name: 'Ср' },
    { id: 4, name: 'Чт' },
    { id: 5, name: 'Пт' },
    { id: 6, name: 'Сб' }
  ];

  const BLOCK = [    
    {id: 1, year:'5-6 лет', num:1, name: 'Блок 1 Техника передвижения', countTrains: 12},
    {id: 2, year:'5-6 лет', num:2, name: 'Блок 2 Ведение мяча', countTrains: 12},
    {id: 3, year:'6-7 лет', num:1, name: 'Блок 1 Техника передвижения', countTrains: 12},
    {id: 4, year:'6-7 лет', num:2, name: 'Блок 2 Ведение и развороты', countTrains: 12},
    {id: 5, year:'6-7 лет', num:3, name: 'Блок 3 Удары', countTrains: 12},
    {id: 6, year:'7-8 лет', num:1, name: 'Блок 1 Ведение и финты', countTrains: 12},
    {id: 7, year:'7-8 лет', num:2, name: 'Блок 2 Отбор мяча', countTrains: 12},
    {id: 8, year:'7-8 лет', num:3, name: 'Блок 3 Удары', countTrains: 12},
    {id: 9, year:'8-9 лет', num:1, name: 'Блок 1 Передача мяча', countTrains: 12},
    {id: 10, year:'8-9 лет', num:2, name: 'Блок 2 Остановка мяча', countTrains: 12},
    {id: 11, year:'8-9 лет', num:3, name: 'Блок 3 Ведение и финты', countTrains: 12},
    {id: 12, year:'8-9 лет', num:4, name: 'Блок 4 Отбор мяча', countTrains: 12},
    {id: 13, year:'8-9 лет', num:5, name: 'Блок 5 Удары', countTrains: 12},
    {id: 14, year:'8-9 лет', num:6, name: 'Блок 6 Игра головой', countTrains: 12}   
  ];


    let lastClicked: number | null = null;
    $: filteredBlocks = BLOCK.filter(block => block.year === selectedAge);
  // Генерация тренировок в выбранные дни недели в указанном периоде
  $: trainings = (() => {
    const result = [];
    let trainingNumber = 1;
    const current = new Date(selectedDateStart);
    const end = new Date(selectedDateEnd);
    let currentBlockIndex = 0;
    let trainingsInCurrentBlock = 0;  
    
    while (current <= end) {
      if (selectedDays.includes(current.getDay())) {
        const currentBlock = filteredBlocks[currentBlockIndex % filteredBlocks.length];
       
        result.push({
          number: trainingNumber++,
          date: current.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          dayName: DAYS.find(d => d.id === current.getDay())!.name,
          dateObj: new Date(current),
          blockName: currentBlock.name     


        });
        trainingsInCurrentBlock++;
        if (trainingsInCurrentBlock >= currentBlock.countTrains) {
        currentBlockIndex++;
        trainingsInCurrentBlock = 0;
      }

      }
      current.setDate(current.getDate() + 1);
    }
    
    return result;
  })();

  function handleTrainingClick(num: number) {
    lastClicked = num;
  }

  function formatPeriod() {
    const start = new Date(selectedDateStart);
    const end = new Date(selectedDateEnd);
    return `${start.toLocaleDateString('ru-RU')} - ${end.toLocaleDateString('ru-RU')}`;
  }

  function formatSelectedDays() {
    return DAYS
      .filter(day => selectedDays.includes(day.id))
      .map(day => day.name)
      .join(', ');
  }

  function createGroup(){
    CountDays =1;
  }
</script>

<div class="age-selector">
  <h1>Создать группу</h1>
  <!-- svelte-ignore a11y_label_has_associated_control -->
  <label>Выберите возрастную группу:</label>
  <div class="radio-group" role="radiogroup" aria-label="Выбор возрастной группы">
    <label class:selected={selectedAge === '5-6 лет'}>
      <input 
        type="radio" 
        name="options" 
        value="5-6 лет" 
        bind:group={selectedAge}
        hidden
        aria-label="5-6 лет"
      />
      <span>5-6 лет</span>
    </label>
    
    <label class:selected={selectedAge === '6-7 лет'}>
      <input 
        type="radio" 
        name="options" 
        value="6-7 лет" 
        bind:group={selectedAge}
        hidden
        aria-label="6-7 лет"
      />
      <span>6-7 лет</span>
    </label>
    
    <label class:selected={selectedAge === '7-8 лет'}>
      <input 
        type="radio" 
        name="options" 
        value="7-8 лет" 
        bind:group={selectedAge}
        hidden
        aria-label="7-8 лет"
      />
      <span>7-8 лет</span>
    </label>
    
    <label class:selected={selectedAge === '8-9 лет'}>
      <input 
        type="radio" 
        name="options" 
        value="8-9 лет" 
        bind:group={selectedAge}
        hidden
        aria-label="8-9 лет"
      />
      <span>8-9 лет</span>
    </label>
  </div>
</div>

<div class="date-picker-container">
  <div class="date-inputs">
    <div class="date-input-group">
      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label>Начало занятий:</label>
      <input type="date" bind:value={selectedDateStart} class="date-input" />
    </div>
    
    <div class="date-input-group">
      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label>Окончание занятий:</label>
      <input type="date" bind:value={selectedDateEnd} class="date-input" />
    </div>
  </div>
  
  <!-- svelte-ignore a11y_label_has_associated_control -->
  <label>Выберите дни недели:</label>
  <div class="days-grid">
    {#each DAYS as day}
      <label class:selected={selectedDays.includes(day.id)}>
        <input 
          type="checkbox" 
          bind:group={selectedDays} 
          value={day.id}
          hidden
          aria-label="{day.name}"
        >
        {day.name}
      </label>
    {/each}
  </div>
</div>  

<div class="button-container">
  <button 
    on:click={createGroup} 
    class="create-group-button"
    disabled={!selectedDateStart || !selectedDateEnd || !selectedAge || !selectedDays.length}
    in:fade
  >
    Создать группу
  </button>
</div>
  <!--<p>Выбрана группа: <strong>{selectedAge || 'ничего'}</strong></p>
  <p>Выбранная дата от: {selectedDateStart}</p>
  <p>Выбранная дата до: {selectedDateEnd}</p>
  <p>Занятия проходят по: <strong>{selectedDays.join(', ')}</strong></p>--> 

{#if CountDays !== 0}
    <div class="trainings">
      <!--<p>{trainings.length}</p>-->
      {#each trainings as training}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div 
          class="training-label"
          class:active={lastClicked === training.number}
          on:click={() => handleTrainingClick(training.number)}
        >
          <div class="training-header">
            <span class="training-number">Тренировка {training.number}</span>
            <span class="training-day">{training.dayName}</span>
          </div>
          <div class="training-date">{training.date}</div> 
          <div class="training-date">{training.blockName}</div>          
        </div>
      {/each}
    </div>
{/if}

<style>
  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    width: 100%;
  }

  .create-group-button {
    padding: 0.75rem 1.5rem;
    background-color: #3b82f6;
    color: white;
    font-weight: 500;
    border: none;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    font-size: 1rem;
  }

  .create-group-button:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .create-group-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  .create-group-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    margin-top: 0px;
  }

  .days-grid label {
    padding: 10px 0;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: bold;
  }

  .days-grid label.selected {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }   

  label {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    font-weight: bold;
  }  

  .trainings {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    margin-top: 10px;
  }

  .training-label {
    padding: 12px 16px;
    background-color: #f0f0f0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    font-weight: bold;
  }

  .training-label:hover {
    background-color: #e0e0e0;
    transform: translateY(-2px);
  }

  .training-label.active {
    background-color: #3b82f6;
    color: white;
  } 

  .date-picker-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 0px;
    font-family: Arial, sans-serif;
  }

  .date-inputs {
    display: flex;
    gap: 10px;
    margin-bottom: 25px;
    align-items: flex-end;
  }

  .date-input-group {
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex: 1;
  }

  label {
    font-weight: bold;
    color: #333;
    font-size: 0.9em;
  }

  .date-input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1em;
    width: 100%;
    box-sizing: border-box;
  }  

  .days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
  }

  .days-grid label {
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: normal;
  }

  .days-grid label.selected {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .days-grid label:hover {
    background-color: #f0f0f0;
  }

  .days-grid label.selected:hover {
    background-color: #2563eb;
  }

  @media (max-width: 600px) {
    .date-inputs {
      flex-direction: column;
      gap: 15px;
    }
  }

  .age-selector {
    max-width: 500px;
    margin: 0 auto;
    padding: 5px;
    font-family: Arial, sans-serif;
  } 

  .radio-group {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }

  .radio-group label {
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: normal;
    display: flex;
    align-items: center;
  }

  .radio-group label.selected {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .radio-group label:hover {
    background-color: #f0f0f0;
  }

  .radio-group label.selected:hover {
    background-color: #2563eb;
  }

  @media (max-width: 600px) {
    .radio-group {
      flex-direction: column;
    }
  }
</style>