<script lang="ts">
  import Header from '$lib/components/Header.svelte';

  // Типы данных
  interface Option {
      id: string;
      name: string;
  }

  type Step1Data = {
      title: string;
      options: Option[];
  };

  type Step2Data = {
      [key: string]: Option[];
  };

  type Step3Data = {
      [key: string]: Option[];
  };

  // Данные для шагов
  const step1Data: Step1Data = {
      title: "Выберите этап подготовки",
      options: [
          { id: '0', name: '5-9 лет' },
          { id: '1', name: '10-14 лет' },
          { id: '2', name: '15-17 лет' }
      ]
  };

  const step2Data: Step2Data = {
      '0': [
          { id: '0', name: '5-6 лет' },
          { id: '1', name: '6-7 лет' },
          { id: '2', name: '7-8 лет' },
          { id: '3', name: '8-9 лет' }
      ]      
  };

  const step3Data: Step3Data = {
      '0': [
        { id: '0', name: 'Блок 1 Техника передвижения' },
        { id: '1', name: 'Блок 2 Ведение мяча' }
      ],
      '1': [
        { id: '0', name: 'Блок 1 Техника передвижения' },
        { id: '1', name: 'Блок 2 Ведение и развороты' },
        { id: '2', name: 'Блок 3 Удары' }
      ],
      '2': [
        { id: '0', name: 'Блок 1 Ведение и финты' },
        { id: '1', name: 'Блок 2 Отбор мяча' },
        { id: '2', name: 'Блок 3 Удары' }
      ],
      '3': [
        { id: '0', name: 'Блок 1 Передача мяча' },
        { id: '1', name: 'Блок 2 Остановка мяча' },
        { id: '2', name: 'Блок 3 Ведение и финты' },
        { id: '3', name: 'Блок 4 Отбор мяча' },
        { id: '4', name: 'Блок 5 Удары' },
        { id: '5', name: 'Блок 6 Игра головой' }
      ]
  };

  // Состояние формы
  let currentStep: 1 | 2 | 3 = 1;
  let selectedOptions: {
      1: string | null;
      2: string | null;
      3: string | null;
  } = {
      1: null,
      2: null,
      3: null
  };

  // Получаем доступные варианты для текущего шага
  $: currentOptions = (() => {
      switch (currentStep) {
          case 1:
              return step1Data.options;
          case 2:
              return selectedOptions[1] ? step2Data[selectedOptions[1]] || [] : [];
          case 3:
              return selectedOptions[2] ? step3Data[selectedOptions[2]] || [] : [];
          default:
              return [];
      }
  })();

  function selectOption(step: 1 | 2 | 3, optionId: string) {
      selectedOptions[step] = optionId;
  }

  function nextStep() {
      if (currentStep < 3 && selectedOptions[currentStep] !== null) {
          currentStep += 1 as 1 | 2 | 3;
      }
  }

  function prevStep() {
      if (currentStep > 1) {
          // Очищаем последующие шаги при возврате
          if (currentStep === 2) {
              selectedOptions[2] = null;
          } else if (currentStep === 3) {
              selectedOptions[3] = null;
          }
          currentStep -= 1 as 1 | 2 | 3;
      }
  }

  function submitForm() {
      console.log("Итоговый выбор:", selectedOptions);
      alert("Форма отправлена!");
  }
</script>

<Header />

<div class="form-container">
  <h2>Шаг {currentStep} из 3</h2>
  
  {#if currentStep === 1}
      <p>Выберите этап подготовки:</p>
  {:else if currentStep === 2}
      <p>Выберите возрастную группу:</p>
  {:else}
      <p>Выберите блок обучения:</p>
  {/if}
  
  <div class="options-grid">
      {#each currentOptions as option}
          <label class="option">
              <input
                  type="radio"
                  name={`step-${currentStep}`}
                  value={option.id}
                  checked={selectedOptions[currentStep] === option.id}
                  on:change={() => selectOption(currentStep, option.id)}
              >
              {option.name}
          </label>
      {/each}
  </div>
  
  <div class="navigation">
      <button
          class="back-button"
          on:click={prevStep}
          disabled={currentStep === 1}
      >
          Назад
      </button>
      
      {#if currentStep < 3}
          <button
              class="next-button"
              on:click={nextStep}
              disabled={selectedOptions[currentStep] === null}
          >
              Продолжить
          </button>
      {:else}
          <button
              class="submit-button"
              on:click={submitForm}
              disabled={selectedOptions[3] === null}
          >
              Отправить
          </button>
      {/if}
  </div>
</div>

<style>
  .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
  }
  
  .options-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 10px;
      margin: 20px 0;
  }
  
  .option {
      display: flex;
      align-items: center;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
  }
  
  .option:hover {
      background: #e0e0e0;
  }
  
  .option input[type="radio"] {
      margin-right: 10px;
  }
  
  .navigation {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      gap: 15px;
  }
  
  button {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s;
      flex: 1;
  }
  
  button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
  }
  
  .back-button {
      background: #f0f0f0;
      color: #333;
  }
  
  .back-button:hover:not(:disabled) {
      background: #e0e0e0;
  }
  
  .next-button, .submit-button {
      background: #4CAF50;
      color: white;
  }
  
  .next-button:hover:not(:disabled),
  .submit-button:hover:not(:disabled) {
      background: #45a049;
  }
  
  @media (max-width: 600px) {
      .options-grid {
          grid-template-columns: 1fr;
      }
      
      button {
          padding: 10px 16px;
      }
  }
</style>