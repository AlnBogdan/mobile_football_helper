<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

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
        if (params.has("step")) {
            const step = params.get("step");
            if (step === "3") currentStep = 3;
            if (params.has("stage")) selectedOptions[1] = params.get("stage");
            if (params.has("age")) selectedOptions[2] = params.get("age");
            if (params.has("selectedBlock"))
                selectedOptions[3] = params.get("selectedBlock");
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
        if (params.has("step") && params.get("step") === "3") {
            currentStep = 3;
            if (params.has("selectedBlock")) {
                selectedOptions[3] = params.get("selectedBlock");
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

<div class="page-wrapper">
    <Header />

    <div class="content-background">
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
                    <svg
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path
                            d="M15 18l-6-6 6-6"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
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
                        План-конспект
                    </button>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    :root {
        --bg-light: #f5f7fa;
        --bg-white: #ffffff;
        --shadow-color: rgba(0, 0, 0, 0.1);
        --primary-color: #3b82f6;
        --text-dark: #1e293b;
        --border-color: #e2e8f0;
    }

    .page-wrapper {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .content-background {
        flex: 1;
        background-color: var(--bg-light);
        padding: 20px;
    }

    .form-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 1.5rem;
        background: var(--bg-white);
        box-shadow: 0 2px 10px var(--shadow-color);
        border-radius: 0.5rem;
        transition: all 0.2s ease;
    }

    .form-container:hover {
        box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
    }

    h2 {
        color: var(--text-dark);
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
    }

    h3 {
        color: var(--text-dark);
        margin: 0 0 1.5rem 0;
        font-weight: 500;
        font-size: 1.1rem;
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
        background: #f8fafc;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid var(--border-color);
    }

    .option:hover:not(.disabled) {
        background: #f1f5f9;
        border-color: #cbd5e1;
    }

    .option.disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: #f1f5f9;
    }

    .option input[type="radio"] {
        margin-right: 12px;
    }

    .option-content {
        flex-grow: 1;
    }

    .option-name {
        font-weight: 600;
        color: var(--text-dark);
        margin-bottom: 4px;
    }

    .option-title {
        font-size: 0.9em;
        color: #64748b;
    }

    .coming-soon {
        font-size: 0.8em;
        color: #64748b;
        margin-left: 8px;
    }

    .navigation {
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        gap: 15px;
    }

    button {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .back-button {
        /* position: absolute; убрано */
        left: 0; /* можно тоже убрать */
        background: #f0f0f0;
        border: none;
        color: var(--primary-color);
        font-size: 0.9rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 0.4rem;
        margin-left: 0;
        transition: all var(--transition-speed) ease;
    }

    .back-button svg {
        stroke: var(--primary-color);
        transition: stroke var(--transition-speed) ease;
    }

    .back-button:hover {
        background-color: var(--primary-color);
        color: white;
    }

    .back-button:hover svg {
        stroke: white;
    }

    .next-button,
    .submit-button {
        background: var(--primary-color);
        color: white;
    }

    .next-button:hover:not(:disabled),
    .submit-button:hover:not(:disabled) {
        background: #2563eb;
    }

    @media (max-width: 768px) {
        .content-background {
            padding: 15px;
        }

        .options-grid {
            grid-template-columns: 1fr;
        }

        .form-container {
            padding: 1rem;
        }
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --bg-light: #1e293b;
            --bg-white: #334155;
            --text-dark: #f8fafc;
            --border-color: #475569;
        }

        .option {
            background: #475569;
            border-color: var(--border-color);
        }

        .option:hover:not(.disabled) {
            background: #4b5563;
        }

        .option.disabled {
            background: #475569;
        }

        .option-title,
        .coming-soon {
            color: #94a3b8;
        }

        .back-button {
            background: #475569;
            color: #e2e8f0;
        }

        .back-button:hover:not(:disabled) {
            background: #4b5563;
        }
    }
</style>