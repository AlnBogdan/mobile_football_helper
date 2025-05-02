<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { onMount } from 'svelte';

    interface Option {
        id: string;
        name: string;
        title: string;
        disabled?: boolean;
    }

    type Step1Data = {
        title: string;
        options: Option[];
    };

    type Step2Data = {
        [key: string]: {
            options: Option[];
            stepTitle: string;
        };
    };

    type Step3Data = {
        [key: string]: {
            options: Option[];
            stepTitle: string;
        };
    };

    const step1Data: Step1Data = {
        title: "Выберите этап подготовки",
        options: [
            { id: "0", name: "5-9 лет", title: "Начальная подготовка" },
            {
                id: "1",
                name: "10-14 лет",
                title: "Учебно-тренировочный этап",
                disabled: true,
            },
            {
                id: "2",
                name: "15-17 лет",
                title: "Спортивное совершенствование",
                disabled: true,
            },
        ],
    };

    const step2Data: Step2Data = {
        "0": {
            stepTitle: "Выберите этап начальной подготовки",
            options: [
                {
                    id: "0",
                    name: "5-6 лет",
                    title: "Общая физическая подготовка с элементами футбола",
                },
                { id: "1", name: "6-7 лет", title: "Начальная подготовка 1" },
                { id: "2", name: "7-8 лет", title: "Начальная подготовка 2" },
                { id: "3", name: "8-9 лет", title: "Начальная подготовка 3" },
            ],
        },
    };

    const step3Data: Step3Data = {
        "0": {
            stepTitle: "Выберите блок ОФП с элементами футбола",
            options: [
                { id: "0", name: "Блок 1 Техника передвижения", title: " " },
                { id: "1", name: "Блок 2 Ведение мяча", title: "" },
            ],
        },
        "1": {
            stepTitle: "Выберите блок начальной подготовки 1",
            options: [
                { id: "0", name: "Блок 1 Техника передвижения", title: "" },
                { id: "1", name: "Блок 2 Ведение и развороты", title: " " },
                { id: "2", name: "Блок 3 Удары", title: " " },
            ],
        },
        "2": {
            stepTitle: "Выберите блок начальной подготовки 2",
            options: [
                { id: "0", name: "Блок 1 Ведение и финты", title: "" },
                { id: "1", name: "Блок 2 Отбор мяча", title: "" },
                { id: "2", name: "Блок 3 Удары", title: "" },
            ],
        },
        "3": {
            stepTitle: "Выберите блок начальной подготовки 3",
            options: [
                { id: "0", name: "Блок 1 Передача мяча", title: "" },
                { id: "1", name: "Блок 2 Остановка мяча", title: "" },
                { id: "2", name: "Блок 3 Ведение и финты", title: "" },
                { id: "3", name: "Блок 4 Отбор мяча", title: "" },
                { id: "4", name: "Блок 5 Удары", title: "" },
                { id: "5", name: "Блок 6 Игра головой", title: "" },
            ],
        },
    };
    onMount(() => {
    // Восстановление состояния при загрузке
    const params = $page.url.searchParams;
    
    if (params.has('step')) {
      const step = params.get('step');
      if (step === '3') currentStep = 3;
      
      if (params.has('stage')) selectedOptions[1] = params.get('stage');
      if (params.has('age')) selectedOptions[2] = params.get('age');
      if (params.has('selectedBlock')) selectedOptions[3] = params.get('selectedBlock');
    }
  });

    let currentStep: 1 | 2 | 3 = 1;
    let selectedOptions: {
        1: string | null;
        2: string | null;
        3: string | null;
    } = {
        1: null,
        2: null,
        3: null,
    };

    $: currentStepTitle = (() => {
        switch (currentStep) {
            case 1:
                return step1Data.title;
            case 2:
                return selectedOptions[1]
                    ? step2Data[selectedOptions[1]].stepTitle
                    : "Выберите вариант";
            case 3:
                return selectedOptions[2]
                    ? step3Data[selectedOptions[2]].stepTitle
                    : "Выберите вариант";
            default:
                return "";
        }
    })();

    $: currentOptions = (() => {
        switch (currentStep) {
            case 1:
                return step1Data.options;
            case 2:
                return selectedOptions[1]
                    ? step2Data[selectedOptions[1]].options
                    : [];
            case 3:
                return selectedOptions[2]
                    ? step3Data[selectedOptions[2]].options
                    : [];
            default:
                return [];
        }
    })();

       $: {
  // Реактивное обновление при изменении параметров
  const params = $page.url.searchParams;
  if (params.has('step') && params.get('step') === '3') {
    currentStep = 3;
    if (params.has('selectedBlock')) {
      selectedOptions[3] = params.get('selectedBlock');
    }
  }
}

    function getSelectedOptionText(step: number): string {
        const optionId = selectedOptions[step as 1 | 2 | 3];
        if (!optionId) return "";

        switch (step) {
            case 1:
                return (
                    step1Data.options.find((o) => o.id === optionId)?.name || ""
                );
            case 2:
                return (
                    step2Data[selectedOptions[1]!].options.find(
                        (o) => o.id === optionId,
                    )?.name || ""
                );
            case 3:
                return (
                    step3Data[selectedOptions[2]!].options.find(
                        (o) => o.id === optionId,
                    )?.name || ""
                );
            default:
                return "";
        }
    }

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
            if (currentStep === 2) {
                selectedOptions[2] = null;
            } else if (currentStep === 3) {
                selectedOptions[3] = null;
            }
            currentStep -= 1 as 1 | 2 | 3;
        }
    }

    function submitForm() {
        const params = new URLSearchParams();
        params.set("stage", selectedOptions[1] || "");
        params.set("age", selectedOptions[2] || "");
        params.set("block", selectedOptions[3] || "");

        goto(`/trains/create-plan?${params.toString()}`);
    }
</script>

<Header />

<div class="form-container">
    <h2>Шаг {currentStep} из 3</h2>
    <h3>{currentStepTitle}</h3>

    <div class="options-grid">
        {#each currentOptions as option}
            <label class="option {option.disabled ? 'disabled' : ''}">
                <input
                    type="radio"
                    name={`step-${currentStep}`}
                    value={option.id}
                    checked={selectedOptions[currentStep] === option.id}
                    on:change={() =>
                        !option.disabled &&
                        selectOption(currentStep, option.id)}
                    disabled={option.disabled}
                />
                <div class="option-content">
                    <div class="option-name">{option.name}</div>
                    {#if option.title}
                        <div class="option-title">{option.title}</div>
                    {/if}
                </div>
                {#if option.disabled}
                    <span class="coming-soon">(скоро)</span>
                {/if}
            </label>
        {/each}
    </div>

    <div class="navigation">
        <button
            class="back-button"
            on:click={prevStep}
            disabled={currentStep === 1}
        >
        ← Назад
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
                Создать тренировку
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

    h3 {
        margin: 10px 0 20px;
        color: #333;
        font-size: 1.2em;
    }

    .options-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
        margin: 20px 0;
    }

    .option {
        display: flex;
        align-items: center;
        padding: 15px;
        background: #f5f5f5;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .option.disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: #e0e0e0;
    }

    .option:hover:not(.disabled) {
        background: #e0e0e0;
    }

    .option input[type="radio"] {
        margin-right: 12px;
        flex-shrink: 0;
    }

    .option-content {
        flex-grow: 1;
    }

    .option-name {
        font-weight: bold;
        margin-bottom: 4px;
    }

    .option-title {
        font-size: 0.9em;
        color: #555;
    }

    .coming-soon {
        font-size: 0.8em;
        color: #666;
        margin-left: 8px;
        flex-shrink: 0;
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

    .next-button,
    .submit-button {
        background: #4caf50;
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

        .option {
            padding: 12px;
        }

        button {
            padding: 10px 16px;
        }
    }
</style>
