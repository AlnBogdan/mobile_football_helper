<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    let trainingData = {
        date: "",
        location: "",
        duration: "",
        participantsCount: "",
        coach: "",
        time: "",
        age: $page.url.searchParams.get("age") || "",
        stage: $page.url.searchParams.get("stage") || "",
        block: $page.url.searchParams.get("block") || "",
        equipment: "",
        objectives: "",
        notes: "",
    };

    function goBackToStep3() {
        const params = new URLSearchParams();
        params.set("stage", trainingData.stage);
        params.set("age", trainingData.age);
        params.set("step", "3");
        params.set("selectedBlock", trainingData.block);
        goto(`/trains?${params.toString()}`);
    }

    function submitTrainingPlan() {
        console.log("План тренировки сохранен:", trainingData);
        alert("План тренировки успешно сохранен!");
    }
</script>

<Header />

<div class="form-container">
    <div class="form-header">
        <button class="back-button" on:click={goBackToStep3} aria-label="Назад">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Назад
        </button>
        <h2>План-конспект учебно-тренировочного занятия</h2>
    </div>

    <div class="selected-params">
        <div class="param-row">
            <div class="param-item">
                <span class="param-label">Этап подготовки:</span>
                <span class="param-value badge">{trainingData.stage}</span>
            </div>
            <div class="param-item">
                <span class="param-label">Возрастная группа:</span>
                <span class="param-value badge">{trainingData.age}</span>
            </div>
            <div class="param-item">
                <span class="param-label">Блок обучения:</span>
                <span class="param-value badge">{trainingData.block}</span>
            </div>
        </div>
    </div>

    <form on:submit|preventDefault={submitTrainingPlan}>
        <div class="form-section">
            <h3>Основные данные</h3>
            <div class="form-grid">
                <div class="form-group">
                    <label for="date">Дата проведения</label>
                    <input
                        id="date"
                        type="date"
                        bind:value={trainingData.date}
                        required
                        placeholder="Выберите дату"
                    />
                </div>
                <div class="form-group">
                    <label for="time">Время</label>
                    <input
                        id="time"
                        type="time"
                        bind:value={trainingData.time}
                        required
                        placeholder="Выберите время"
                    />
                </div>
                <div class="form-group">
                    <label for="duration">Длительность (мин)</label>
                    <input
                        id="duration"
                        type="number"
                        bind:value={trainingData.duration}
                        min="30"
                        required
                        placeholder="Минуты"
                    />
                </div>
                <div class="form-group">
                    <label for="location">Место</label>
                    <input
                        id="location"
                        type="text"
                        bind:value={trainingData.location}
                        required
                        placeholder="Например, спортзал №2"
                    />
                </div>
                <div class="form-group">
                    <label for="participantsCount">Количество человек</label>
                    <input
                        id="participantsCount"
                        type="number"
                        bind:value={trainingData.participantsCount}
                        min="1"
                        required
                        placeholder="Число участников"
                    />
                </div>
                <div class="form-group">
                    <label for="coach">Тренер</label>
                    <input
                        id="coach"
                        type="text"
                        bind:value={trainingData.coach}
                        required
                        placeholder="ФИО тренера"
                    />
                </div>
            </div>
        </div>

        <div class="form-section">
            <h3>Содержание занятия</h3>
            <div class="form-group">
                <label for="objectives">Цели и задачи</label>
                <textarea
                    id="objectives"
                    bind:value={trainingData.objectives}
                    rows="3"
                    required
                    placeholder="Опишите цели и задачи занятия"
                ></textarea>
            </div>
            <div class="form-group">
                <label for="equipment">Необходимый инвентарь</label>
                <textarea
                    id="equipment"
                    bind:value={trainingData.equipment}
                    rows="2"
                    placeholder="Перечислите инвентарь"
                ></textarea>
            </div>
            <div class="form-group">
                <label for="notes">Примечания</label>
                <textarea
                    id="notes"
                    bind:value={trainingData.notes}
                    rows="2"
                    placeholder="Дополнительные заметки"
                ></textarea>
            </div>
            <div class="submit-wrapper">
                <button type="submit" class="submit-button">
                    Перейти к выбору упражнений
                </button>
            </div>
        </div>       
    </form>
</div>

<style>
    :root {
        --primary-color: #3498db;
        --primary-color-dark: #217dbb;
        --secondary-color: #2c3e50;
        --border-color: #e2e8f0;
        --shadow-color: rgba(0, 0, 0, 0.1);
        --background-light: #f8fafc;
        --text-light: #64748b;
        --text-dark: #2c3e50;
        --transition-speed: 0.2s;
        --base-padding: 0.75rem;
        --small-padding: 0.5rem;
    }
    
    :global(body) {
        background-color: #f5f7fa;
        margin: 0;
        padding: 0;
        font-family: "Segoe UI", system-ui, sans-serif;
        line-height: 1.4;
        transition: background-color 0.3s, color 0.3s;
    }
    
    .form-container {
        max-width: 900px;
        margin: 0.5rem auto;
        padding: 1rem;
        background: white;
        box-shadow: 0 2px 10px var(--shadow-color);
        transition: box-shadow var(--transition-speed) ease, background-color 0.3s, color 0.3s;
        padding-bottom: 1.5rem;
        border-radius: 0.5rem;
    }
    
    .form-container:hover {
        box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
    }
    
    .form-header {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 0 3rem;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 1rem;
    }
    
    .form-header h2 {
        margin: 0;
        color: var(--secondary-color);
        font-size: 1.25rem;
        text-align: center;
        flex-grow: 1;
        padding: 0 60px;
    }
    
    .back-button {
        position: absolute;
        left: 0;
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
    
    .selected-params {
        background: var(--background-light);
        padding: var(--small-padding);
        margin-bottom: 1.5rem;
        border: 1px solid var(--border-color);
        border-radius: 0.4rem;
        transition: box-shadow 0.3s ease;
    }
    
    .param-row {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .param-label {
        display: block;
        font-size: 0.8rem;
        color: #4a5568;
        margin-bottom: 0.3rem;
    }
    
    .param-value {
        font-weight: 500;
        font-size: 1rem;
    }
    
    .badge {
        font-weight: 600;
        font-size: 1rem;
        background: #eaf6fd;
        color: var(--primary-color);
        padding: 0.18em 0.8em;
        border-radius: 0.7em;
        margin-left: 0.5em;
        display: inline-block;
        user-select: none;
    }
    
    @media (prefers-color-scheme: dark) {
        .badge {
            background: #18405d;
            color: #b7e2ff;
        }
    }
    
    .form-section {
        margin-bottom: 2rem;
        padding: 0 0.5rem;
    }
    
    .form-section h3 {
        margin: 0 0 1rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--border-color);
        font-size: 1.1rem;
        position: relative;
        padding-left: 1.2em;
    }
    
    .form-section h3::before {
        content: '';
        position: absolute;
        left: 0; top: 0.3em;
        width: 0.5em; height: 1.2em;
        border-radius: 2px;
        background: var(--primary-color);
    }
    
    .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.1rem;
        margin: 0.5rem 0;
        padding: 0 0.5rem;
    }
    
    .form-group {
        margin-bottom: 0.5rem;
        padding: 0.1rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.4rem;
        font-weight: 500;
        font-size: 0.9rem;
    }
    
    .form-group input[type="text"],
    .form-group input[type="number"],
    .form-group input[type="date"],
    .form-group input[type="time"],
    .form-group textarea {
        width: 100%;
        padding: 0.45rem 0.7rem;
        border: 1px solid var(--border-color);
        border-radius: 0.4rem;
        font-size: 0.9rem;
        min-height: 2rem;
        transition: border-color var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
        background-color: white;
        color: var(--text-dark);
    }
    
    .form-group textarea {
        min-height: 4.5rem;
        resize: vertical;
    }
    
    .form-group input::placeholder,
    .form-group textarea::placeholder {
        color: #a0aec0;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
        border-color: var(--primary-color);
        outline: none;
        box-shadow: 0 0 6px 2px #d0e8fa;
    }
    
    .submit-wrapper {
        display: flex;
        justify-content: flex-end;
        padding: 0.5rem 0;
        margin-right: 0;
    }
    
    .submit-button {
        background: linear-gradient(90deg, var(--primary-color) 0%, var(--primary-color-dark) 100%);
        color: white;
        border: none;
        padding: 0.7rem 1.2rem;
        font-size: 1rem;
        border-radius: 0.4rem;
        cursor: pointer;
        width: 100%;
        display: block;
        transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
        user-select: none;
    }
    
    .submit-button:hover,
    .submit-button:focus {
        background: linear-gradient(90deg, var(--primary-color-dark) 0%, var(--primary-color) 100%);
        box-shadow: 0 4px 20px rgba(52, 152, 219, 0.3);
        transform: translateY(-2px) scale(1.03);
        outline: none;
    }
    
    @media (max-width: 640px) {
        .form-grid {
            gap: 1.5rem;
        }
        .form-group {
            margin-bottom: 0.8rem;
        }
        .submit-button {
            width: 100%;
        }
    }
    
    @media (min-width: 480px) {
        .form-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.2rem;
        }
    }
    
    @media (min-width: 640px) {
        .form-header {
            flex-direction: row;
            align-items: center;
        }
        .form-header h2 {
            font-size: 1.5rem;
        }
        .param-row {
            grid-template-columns: repeat(3, 1fr);
        }
        .form-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.4rem;
        }
        .submit-wrapper {
            padding: 0 0.5rem 0 0;
        }
        .submit-button {
            width: auto;
            min-width: 220px;
            margin-right: 0;
        }
    }
    
    @media (min-width: 768px) {
        .form-container {
            padding: 2rem;
            border-radius: 0.6rem;
            margin: 1.5rem auto;
            padding-bottom: 2.5rem;
        }
        .form-header h2 {
            font-size: 1.625rem;
        }
        .form-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.7rem;
        }
        .form-group input,
        .form-group textarea {
            padding: 0.7rem 0.9rem;
            font-size: 0.95rem;
        }
        .submit-wrapper {
            padding-right: 0;
        }
    }
    
    @media (min-width: 1200px) {
        .form-container {
            max-width: 1000px;
        }
    }
    
    @media (prefers-color-scheme: dark) {
        :root {
            --secondary-color: #f8fafc;
            --background-light: #2d3748;
            --border-color: #4a5568;
            --text-dark: #f8fafc;
        }
    
        :global(body) {
            background-color: #1a202c;
        }
    
        .form-container {
            background-color: #2d3748;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
        }
    
        .param-label {
            color: #cbd5e0;
        }
    
        .form-group input,
        .form-group textarea {
            background-color: #4a5568;
            border-color: #4a5568;
            color: #f8fafc;
        }
    
        .back-button {
            background-color: #4a5568;
            color: #f8fafc;
        }
    
        .selected-params {
            background-color: #4a5568;
        }
    }
    </style>