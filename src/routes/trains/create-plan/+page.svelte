<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { supabase } from "$lib/supabaseClient";
    import { onMount } from "svelte";

    interface Exercise {
        id: number;
        name: string;
        description: string;
        scheme: string;
        duration: number;
        part: "preparatory" | "main" | "final";
        videoLink?: string;
    }

    async function getExercisesForCurrentParams(): Promise<Exercise[]> {
        const { data, error } = await supabase
            .from("exercises")
            .select("*")
            .eq("stage", trainingData.stage)
            .eq("age_group", trainingData.age)
            .eq("block", trainingData.block)
            .order("part")
            .order("id");

        if (error) {
            console.error("Error fetching exercises:", error);
            return [];
        }

        return data.map((ex) => ({
            id: ex.id,
            name: ex.name,
            description: ex.description,
            scheme: ex.scheme_url,
            duration: ex.duration,
            part: ex.part as "preparatory" | "main" | "final",
            videoLink: ex.video_link,
        }));
    }

    const equipmentOptions = [
        "Мячи",
        "Манишки",
        "Фишки",
        "Конусы",
        "Барьерчики",
        "Скакалки",
        "Ворота",
        "Маркеры",
        "Свисток",
    ];

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
        equipment: [] as string[],
        objectives: "",
        notes: "",
        selectedExercises: [] as Exercise[],
    };

    let selectedExercise: Exercise | null = null;
    let showModal = false;

    let currentExercises: Exercise[] = [];

    // Добавляем функции для работы с выбором упражнений
    function toggleExercise(exercise: Exercise, part: string) {
        const currentSelected = trainingData.selectedExercises.filter(
            (e) => e.part === part,
        );

        // Проверяем ограничения по количеству
        if (
            part === "preparatory" &&
            currentSelected.length >= 1 &&
            !trainingData.selectedExercises.some((e) => e.id === exercise.id)
        ) {
            return; // Нельзя выбрать больше 1 в подготовительной части
        }
        if (
            part === "main" &&
            currentSelected.length >= 3 &&
            !trainingData.selectedExercises.some((e) => e.id === exercise.id)
        ) {
            return; // Нельзя выбрать больше 3 в основной части
        }
        if (
            part === "final" &&
            currentSelected.length >= 1 &&
            !trainingData.selectedExercises.some((e) => e.id === exercise.id)
        ) {
            return; // Нельзя выбрать больше 1 в заключительной части
        }

        if (trainingData.selectedExercises.some((e) => e.id === exercise.id)) {
            // Удаляем если уже выбрано
            trainingData.selectedExercises =
                trainingData.selectedExercises.filter(
                    (e) => e.id !== exercise.id,
                );
        } else {
            // Добавляем если не выбрано
            trainingData.selectedExercises = [
                ...trainingData.selectedExercises,
                exercise,
            ];
        }
    }

    function isExerciseSelected(exercise: Exercise) {
        return trainingData.selectedExercises.some((e) => e.id === exercise.id);
    }

    function getSelectedCount(part: string) {
        return trainingData.selectedExercises.filter((e) => e.part === part)
            .length;
    }

    function goBackToStep3() {
        const params = new URLSearchParams();
        params.set("stage", trainingData.stage);
        params.set("age", trainingData.age);
        params.set("step", "3");
        params.set("selectedBlock", trainingData.block);
        goto(`/trains?${params.toString()}`);
    }

    function openExerciseModal(exercise: Exercise) {
        selectedExercise = exercise;
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }

    import {
        Document,
        Packer,
        Paragraph,
        TextRun,
        HeadingLevel,
        Table,
        TableRow,
        TableCell,
        WidthType,
    } from "docx";

    function submitTrainingPlan() {
        const {
            stage,
            age,
            block,
            date,
            time,
            duration,
            location,
            participantsCount,
            coach,
            objectives,
            equipment,
        } = trainingData;

        const section = (title: string) =>
            new Paragraph({
                text: title,
                heading: HeadingLevel.HEADING_2,
                spacing: { after: 200 },
            });

        const text = (label: string, value: string | number) =>
            new Paragraph({
                children: [
                    new TextRun({ text: `${label}: `, bold: true }),
                    new TextRun(String(value)),
                ],
            });

       const exercisesToExport = trainingData.selectedExercises; // Всегда только выбранные упражнения

        const exercisesToTable = (title: string, part: string) => {
            const filtered = exercisesToExport.filter((e) => e.part === part);
            if (filtered.length === 0) return [];

            const rows = filtered.map(
                (ex) =>
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph(ex.name)],
                                width: { size: 33, type: WidthType.PERCENTAGE },
                            }),
                            new TableCell({
                                children: [new Paragraph(ex.description)],
                                width: { size: 47, type: WidthType.PERCENTAGE },
                            }),
                            new TableCell({
                                children: [new Paragraph(`${ex.duration} мин`)],
                                width: { size: 20, type: WidthType.PERCENTAGE },
                            }),
                        ],
                    }),
            );

            return [
                section(title),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph("Название")],
                                    width: {
                                        size: 33,
                                        type: WidthType.PERCENTAGE,
                                    },
                                }),
                                new TableCell({
                                    children: [new Paragraph("Описание")],
                                    width: {
                                        size: 47,
                                        type: WidthType.PERCENTAGE,
                                    },
                                }),
                                new TableCell({
                                    children: [new Paragraph("Длительность")],
                                    width: {
                                        size: 20,
                                        type: WidthType.PERCENTAGE,
                                    },
                                }),
                            ],
                        }),
                        ...rows,
                    ],
                }),
            ];
        };

        const doc = new Document({
            sections: [
                {
                    children: [
                        new Paragraph({
                            text: "План-конспект учебно-тренировочного занятия",
                            heading: HeadingLevel.HEADING_1,
                            spacing: { after: 400 },
                        }),
                        text("Этап подготовки", stage),
                        text("Возрастная группа", age),
                        text("Блок обучения", block),
                        text("Дата", date),
                        text("Время", time),
                        text("Длительность", `${duration} мин`),
                        text("Место", location),
                        text("Количество участников", participantsCount),
                        text("Тренер", coach),
                        section("Цели и задачи занятия"),
                        new Paragraph(objectives),
                        section("Необходимый инвентарь"),
                        ...equipment.map(
                            (item) =>
                                new Paragraph({
                                    text: item,
                                    bullet: { level: 0 },
                                }),
                        ),
                        ...exercisesToTable(
                            "Подготовительная часть",
                            "preparatory",
                        ),
                        ...exercisesToTable("Основная часть", "main"),
                        ...exercisesToTable("Заключительная часть", "final"),
                    ],
                },
            ],
        });

        // Сохранение
        Packer.toBlob(doc).then((blob: Blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = "plan.docx";
            a.click();
            URL.revokeObjectURL(blobUrl);
        });
    }
    onMount(async () => {
        currentExercises = await getExercisesForCurrentParams();
    });
</script>

<Header />
<div class="container">
    <div class="form-container">
        <div class="form-header">
            <button
                class="back-button"
                on:click={goBackToStep3}
                aria-label="Назад к выбору блока"
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
                            aria-required="true"
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
                            aria-required="true"
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
                            aria-required="true"
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
                            aria-required="true"
                        />
                    </div>
                    <div class="form-group">
                        <label for="participantsCount">Количество человек</label
                        >
                        <input
                            id="participantsCount"
                            type="number"
                            bind:value={trainingData.participantsCount}
                            min="1"
                            required
                            placeholder="Число участников"
                            aria-required="true"
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
                            aria-required="true"
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
                        aria-required="true"
                    ></textarea>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y_label_has_associated_control -->
                    <label>Необходимый инвентарь</label>
                    <div
                        class="checkbox-list"
                        role="group"
                        aria-labelledby="equipment-label"
                    >
                        {#each equipmentOptions as item}
                            <label class="checkbox-item">
                                <input
                                    type="checkbox"
                                    value={item}
                                    bind:group={trainingData.equipment}
                                    aria-label={item}
                                />
                                {item}
                            </label>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Подготовительная часть -->
            <div class="part-section">
                <h4 id="preparatory-heading">Подготовительная часть (выбрано: {getSelectedCount("preparatory",)}/1)</h4>
                <ul class="exercises-grid" aria-labelledby="preparatory-heading">
                    {#each currentExercises.filter((e) => e.part === "preparatory") as exercise (exercise.id)}
                        <li>
                            <div class="exercise-card-container">
                                <!-- Чекбокс для выбора -->
                                <label class="exercise-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={isExerciseSelected(exercise)}
                                        on:change={() =>
                                            toggleExercise(
                                                exercise,
                                                "preparatory",
                                            )}
                                        class="exercise-checkbox"
                                        aria-label="Выбрать упражнение"
                                        disabled={getSelectedCount(
                                            "preparatory",
                                        ) >= 1 && !isExerciseSelected(exercise)}
                                    />
                                    <span class="checkmark"></span>
                                </label>

                                <!-- Карточка для просмотра деталей -->
                                <button
                                    type="button"
                                    class="exercise-card {isExerciseSelected(
                                        exercise,
                                    )
                                        ? 'selected'
                                        : ''}"
                                    on:click={() => openExerciseModal(exercise)}
                                    on:keydown={(e) =>
                                        ["Enter", "Space"].includes(e.key) &&
                                        openExerciseModal(exercise)}
                                    aria-label={`Подробнее об упражнении: ${exercise.name}`}
                                >
                                    <div class="exercise-scheme">
                                        {#if exercise.scheme}
                                            <img
                                                src={exercise.scheme}
                                                alt=""
                                                role="presentation"
                                            />
                                        {:else}
                                            <div class="scheme-placeholder">
                                                Нет изображения
                                            </div>
                                        {/if}
                                    </div>
                                    <div class="exercise-info">
                                        <h5>{exercise.name}</h5>
                                        <p>{exercise.description}</p>
                                        <div class="exercise-duration">
                                            {exercise.duration} мин
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>

            <!-- Основная часть -->
            <div class="part-section">
                <h4 id="main-heading">
                    Основная часть (выбрано: {getSelectedCount("main")}/3)
                </h4>
                <ul class="exercises-grid" aria-labelledby="main-heading">
                    {#each currentExercises.filter((e) => e.part === "main") as exercise (exercise.id)}
                        <li>
                            <div class="exercise-card-container">
                                <!-- Чекбокс для выбора -->
                                <label class="exercise-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={isExerciseSelected(exercise)}
                                        on:change={() =>
                                            toggleExercise(
                                                exercise,
                                                "main",
                                            )}
                                        class="exercise-checkbox"
                                        aria-label="Выбрать упражнение"
                                        disabled={getSelectedCount(
                                            "main",
                                        ) >= 3 && !isExerciseSelected(exercise)}
                                    />
                                    <span class="checkmark"></span>
                                </label>
                            <button
                                type="button"
                                class="exercise-card"
                                on:click={() => openExerciseModal(exercise)}
                                on:keydown={(e) =>
                                    ["Enter", "Space"].includes(e.key) &&
                                    openExerciseModal(exercise)}
                                aria-label={`Подробнее об упражнении: ${exercise.name}`}
                            >
                                <div class="exercise-scheme">
                                    {#if exercise.scheme}
                                        <img
                                            src={exercise.scheme}
                                            alt=""
                                            role="presentation"
                                        />
                                    {:else}
                                        <div class="scheme-placeholder">
                                            Нет изображения
                                        </div>
                                    {/if}
                                </div>
                                <div class="exercise-info">
                                    <h5>{exercise.name}</h5>
                                    <p>{exercise.description}</p>
                                    <div class="exercise-duration">
                                        {exercise.duration} мин
                                    </div>
                                </div>
                            </button>
                        </li>
                    {/each}
                </ul>
            </div>

            <!-- Заключительная часть -->
            <div class="part-section">
                <h4 id="final-heading">Заключительная часть</h4>
                <ul class="exercises-grid" aria-labelledby="final-heading">
                    {#each currentExercises.filter((e) => e.part === "final") as exercise (exercise.id)}
                        <li>
                            <div class="exercise-card-container">
                                <!-- Чекбокс для выбора -->
                                <label class="exercise-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={isExerciseSelected(exercise)}
                                        on:change={() =>
                                            toggleExercise(
                                                exercise,
                                                "final",
                                            )}
                                        class="exercise-checkbox"
                                        aria-label="Выбрать упражнение"
                                        disabled={getSelectedCount(
                                            "final",
                                        ) >= 1 && !isExerciseSelected(exercise)}
                                    />
                                    <span class="checkmark"></span>
                                </label>
                            <button
                                type="button"
                                class="exercise-card"
                                on:click={() => openExerciseModal(exercise)}
                                on:keydown={(e) =>
                                    ["Enter", "Space"].includes(e.key) &&
                                    openExerciseModal(exercise)}
                                aria-label={`Подробнее об упражнении: ${exercise.name}`}
                            >
                                <div class="exercise-scheme">
                                    {#if exercise.scheme}
                                        <img
                                            src={exercise.scheme}
                                            alt=""
                                            role="presentation"
                                        />
                                    {:else}
                                        <div class="scheme-placeholder">
                                            Нет изображения
                                        </div>
                                    {/if}
                                </div>
                                <div class="exercise-info">
                                    <h5>{exercise.name}</h5>
                                    <p>{exercise.description}</p>
                                    <div class="exercise-duration">
                                        {exercise.duration} мин
                                    </div>
                                </div>
                            </button>
                        </li>
                    {/each}
                </ul>
            </div>
            <div class="submit-wrapper">
                <button 
        type="submit" 
        class="submit-button"
        disabled={trainingData.selectedExercises.length === 0}
    >
        Сохранить план-конспект
    </button>    
            </div>
        </form>
    </div>
</div>

<!-- Модальное окно с деталями упражнения -->
{#if showModal && selectedExercise}
    <div
        class="modal-overlay"
        on:click|self={closeModal}
        on:keydown|self={(e) => e.key === "Escape" && closeModal()}
        tabindex="0"
        role="button"
        aria-label="Закрыть модальное окно"
    >
        <div
            class="modal-content"
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
        >
            <button
                class="modal-close"
                on:click={closeModal}
                on:keydown={(e) =>
                    ["Enter", "Space", "Escape"].includes(e.key) &&
                    closeModal()}
                aria-label="Закрыть"
            >
                ×
            </button>

            <h2 id="modal-title">{selectedExercise.name}</h2>

            {#if selectedExercise.scheme}
                <div class="exercise-scheme-modal">
                    <img src={selectedExercise.scheme} alt="Схема упражнения" />
                </div>
            {:else}
                <div class="scheme-placeholder-modal">Нет изображения</div>
            {/if}

            <h3>Описание:</h3>
            <p>{selectedExercise.description}</p>

            <div class="exercise-duration-modal">
                Длительность: {selectedExercise.duration} минут
            </div>

            {#if selectedExercise.videoLink}
                <a
                    href={selectedExercise.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="video-link"
                >
                    Смотреть видео упражнения →
                </a>
            {:else}
                <p class="no-video">Видео отсутствует</p>
            {/if}
        </div>
    </div>
{/if}

<style>
    .form-container {
        max-width: 900px;
        margin: 0.5rem auto;
        padding: 1rem;
        background: white;
        box-shadow: 0 2px 10px var(--shadow-color);
        transition:
            box-shadow var(--transition-speed) ease,
            background-color 0.3s,
            color 0.3s;
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

    @media (min-width: 640px) {
        .param-row {
            grid-template-columns: repeat(3, 1fr);
        }
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
        content: "";
        position: absolute;
        left: 0;
        top: 0.3em;
        width: 0.5em;
        height: 1.2em;
        border-radius: 2px;
        background: var(--primary-color);
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        margin: 0.5rem 0;
        padding: 0 0.5rem;
    }

    @media (min-width: 480px) {
        .form-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (min-width: 768px) {
        .form-grid {
            grid-template-columns: repeat(3, 1fr);
        }
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
        transition:
            border-color var(--transition-speed) ease,
            box-shadow var(--transition-speed) ease;
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

    .checkbox-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .checkbox-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        cursor: pointer;
    }

    .checkbox-item input {
        margin: 0;
    }

    .part-section {
        margin-bottom: 2rem;
        padding: 1rem;
        background: var(--background-light);
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
    }

    .part-section h4 {
        margin-top: 0;
        color: var(--secondary-color);
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--border-color);
    }

    .exercises-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 0.3rem;
        margin: 1rem 0;
        padding: 0;
        list-style: none;
    }

    .exercise-card {
        appearance: none;
        -webkit-appearance: none;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        padding: 0;
        cursor: pointer;
        transition:
            transform 0.2s,
            box-shadow 0.2s;
        background: white;
        text-align: left;
        width: 100%;
        display: flex;
        flex-direction: column;
        margin: 0;
        font: inherit;
        height: 280px;
        position: relative;
    }

    .exercise-card.selected {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px var(--primary-color);
    }

    .exercise-card-container {
        position: relative;
        height: 100%;
    }

    .exercise-checkbox-label {
        position: absolute;
        top: 0.5rem;
        right: 2rem;
        z-index: 2;
        cursor: pointer;
    }

    .exercise-checkbox {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 1.2rem;
        width: 1.2rem;
        background-color: white;
        border: 2px solid var(--primary-color);
        border-radius: 0.25rem;
    }

    .exercise-checkbox:checked ~ .checkmark {
        background-color: var(--primary-color);
    }

    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }

    .exercise-checkbox:checked ~ .checkmark:after {
        display: block;
    }

    .checkmark:after {
        left: 0.35rem;
        top: 0.1rem;
        width: 0.3rem;
        height: 0.6rem;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
    }

    .exercise-checkbox:disabled ~ .checkmark {
        opacity: 0.5;
        cursor: not-allowed;
        border-color: var(--text-light);
    }

    .exercise-card:hover,
    .exercise-card:focus {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        outline: none;
    }

    .exercise-card:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }

    .exercise-scheme {
        height: 120px;
        overflow: hidden;
    }

    .exercise-scheme img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .scheme-placeholder {
        width: 100%;
        height: 100%;
        background: #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-light);
    }

    .exercise-info {
        padding: 0.8rem;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    .exercise-info h5 {
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
        color: var(--secondary-color);
    }

    .exercise-info p {
        margin: 0 0 0.5rem 0;
        font-size: 0.9rem;
        color: var(--text-light);
        flex-grow: 1;
        /* Обновленные свойства для ограничения текста */
        display: -webkit-box;
        line-clamp: 3; /* ограничиваем тремя строками */
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.4; /* для лучшего отображения */
        max-height: 4.2em; /* 3 строки * 1.4 line-height */
    }

    .exercise-duration {
        font-size: 0.9rem;
        color: var(--primary-color);
        font-weight: 600;
    }
    .submit-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background-color: #cbd5e0;
    }

    /* Стили для модального окна */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 1rem;
    }

    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 0.5rem;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .modal-content p {
        white-space: normal;
        line-clamp: unset;
        max-height: none;
        overflow: visible;
    }

    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-light);
        padding: 0.5rem;
    }

    .modal-close:hover {
        color: var(--secondary-color);
    }

    .exercise-scheme-modal {
        width: 100%;
        height: 300px;
        margin: 1rem 0;
        overflow: hidden;
        border-radius: 0.25rem;
    }

    .exercise-scheme-modal img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .scheme-placeholder-modal {
        width: 100%;
        height: 200px;
        background: #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 1rem 0;
        border-radius: 0.25rem;
        color: var(--text-light);
    }

    .video-link {
        display: inline-block;
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: var(--primary-color);
        color: white;
        text-decoration: none;
        border-radius: 0.25rem;
        transition: background-color 0.2s;
    }

    .video-link:hover {
        background: var(--primary-hover);
    }

    .no-video {
        color: var(--text-light);
        font-style: italic;
    }

    .submit-wrapper {
        display: flex;
        justify-content: flex-end;
        margin-right: 0;
        padding: 0.5rem 0;
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

    .submit-button {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.7rem 1.2rem;
        font-size: 1rem;
        border-radius: 0.4rem;
        cursor: pointer;
        width: 100%;
        display: block;
        user-select: none;
    }

    @media (min-width: 640px) {
        .submit-button {
            width: auto;
            min-width: 220px;
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
        .form-group textarea,
        button.exercise-card,
        .back-button {
            background-color: #4a5568;
            color: #f8fafc;
        }

        .selected-params,
        .part-section {
            background-color: #4a5568;
        }

        .exercise-scheme img {
            background: #2d3748;
        }

        .modal-content {
            background-color: #2d3748;
            color: #f8fafc;
        }

        .scheme-placeholder,
        .scheme-placeholder-modal {
            background-color: #4a5568;
            color: #cbd5e0;
        }
    }
</style>
