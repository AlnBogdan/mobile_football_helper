<h1>Мобильный помощник/Создать группу</h1>

<script>
    let selectedDateStart = ''; 
    let selectedDateEnd = ''; 
    let selectedOption = ''; 
    let days = []; // Массив для хранения выбранных дней
    const weekDays = [
    { id: 'mon', name: 'Понедельник' },
    { id: 'tue', name: 'Вторник' },
    { id: 'wed', name: 'Среда' },
    { id: 'thu', name: 'Четверг' },
    { id: 'fri', name: 'Пятница' },
    { id: 'sat', name: 'Суббота' },
    { id: 'sun', name: 'Воскресенье' },
  ];  
</script>

<form>
    <label>
      <input type="radio" name="options" value="5-6 лет" bind:group={selectedOption} />
      5-6 лет
    </label>
  
    <label>
      <input type="radio" name="options" value="6-7 лет" bind:group={selectedOption} />
      6-7 лет
    </label>
  
    <label>
      <input type="radio" name="options" value="7-8 лет" bind:group={selectedOption} />
      7-8 лет
    </label>

    <label>
    <input type="radio" name="options" value="8-9 лет" bind:group={selectedOption} />
        8-9 лет
      </label>
  </form>

  <p>Начало занятий: </p>
  <input type="date" bind:value={selectedDateStart} />

  <p>Окончание занятий: </p>
  <input type="date" bind:value={selectedDateEnd} />
  
  <h3>Выберите дни недели:</h3>
  {#each weekDays as day}
  <label>
    <input 
      type="checkbox" 
      bind:group={days} 
      value={day.id} 
    />
    {day.name}
  </label>
  {/each}

  <p>Выбрана группа: <strong>{selectedOption || 'ничего'}</strong></p>
  <p>Выбранная дата от: {selectedDateStart}</p>
  <p>Выбранная дата до: {selectedDateEnd}</p>
  <p>Занятия проходят по: <strong>{days.join(', ')}</strong></p>


  <button class="create-button">
    <a href="/workout" class="link">Создать группу</a>
  </button>