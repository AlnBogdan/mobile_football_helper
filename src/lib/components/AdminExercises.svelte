<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  // Тип для упражнения
  type ExercisePart = "preparatory" | "main" | "final";

  interface Exercise {
  id?: number;
  name: string;
  description: string;
  scheme_url?: string | null;
  duration: number;
  part: ExercisePart;
  video_link?: string | null;
  stage: string;
  age_group: string;
  block: string;
}
  interface Option {
    id: string;
    name: string;
    title: string;
    disabled?: boolean;
  }

  interface StepData {
    [key: string]: Option[];
  }

  // Состояние компонента
  let exercises: Exercise[] = [];
  let newExercise: Exercise = {
    name: "",
    description: "",
    duration: 10,
    part: "preparatory",
    stage: "",
    age_group: "",
    block: "",
    video_link: "",
    scheme_url: "",
  };
  let editingId: number | null = null;
  let isLoading = false;
  let error = "";

  // Опции для селектов
  const parts: ExercisePart[] = ["preparatory", "main", "final"];

  // Данные для связанных селектов
  const step1Data: { title: string; options: Option[] } = {
    title: "Выберите этап подготовки",
    options: [
      {
        id: "0",
        name: "5-9 ЛЕТ",
        title: "Этап начальной подготовки (ОФП Ф, НП-1, НП-2, НП-3)",
      },
      {
        id: "1",
        name: "10-14 ЛЕТ",
        title: "Этап учебно-тренировочный (УТ-1, УТ-2, УТ-3, УТ-4, УТ-5)",
        disabled: true,
      },
      {
        id: "2",
        name: "15-17 ЛЕТ",
        title: "Этап начальной подготовки (СПС-1, СПС-2, СПС-3)",
        disabled: true,
      },
    ],
  };

  const step2Data: StepData = {
    "0": [
      {
        id: "0",
        name: "ОФПФ (5-6 лет)",
        title: "Общая физическая подготовка с элементами футбола",
      },
      {
        id: "1",
        name: "НП-1 (6-7 лет)",
        title: "Начальная подготовка 1-го года обучения",
      },
      {
        id: "2",
        name: "НП-2 (7-8 лет)",
        title: "Начальная подготовка 2-го года обучения",
      },
      {
        id: "3",
        name: "НП-3 (8-9 лет)",
        title: "Начальная подготовка 3-го года обчучения",
      },
    ],
  };

  const step3Data: StepData = {
    "0": [
      { id: "0", name: "Блок 1 Техника передвижения", title: " " },
      { id: "1", name: "Блок 2 Ведение мяча", title: "" },
    ],
    "1": [
      { id: "0", name: "Блок 1 Техника передвижения", title: "" },
      { id: "1", name: "Блок 2 Ведение и развороты", title: " " },
      { id: "2", name: "Блок 3 Удары", title: " " },
    ],
    "2": [
      { id: "0", name: "Блок 1 Ведение и финты", title: "" },
      { id: "1", name: "Блок 2 Отбор мяча", title: "" },
      { id: "2", name: "Блок 3 Удары", title: "" },
    ],
    "3": [
      { id: "0", name: "Блок 1 Передача мяча", title: "" },
      { id: "1", name: "Блок 2 Остановка мяча", title: "" },
      { id: "2", name: "Блок 3 Ведение и финты", title: "" },
      { id: "3", name: "Блок 4 Отбор мяча", title: "" },
      { id: "4", name: "Блок 5 Удары", title: "" },
      { id: "5", name: "Блок 6 Игра головой", title: "" },
    ],
  };

  // Получить доступные возрастные группы для выбранного этапа
  $: availableAgeGroups = newExercise.stage
    ? step2Data[newExercise.stage as keyof typeof step2Data] || []
    : [];

  // Получить доступные блоки для выбранной возрастной группы
  $: availableBlocks = newExercise.age_group
    ? step3Data[newExercise.age_group as keyof typeof step3Data] || []
    : [];

  // Сбросить зависимые поля при изменении этапа
  $: if (newExercise.stage) {
    if (
      !availableAgeGroups.some((ag: Option) => ag.id === newExercise.age_group)
    ) {
      newExercise.age_group = "";
      newExercise.block = "";
    }
  }

  // Сбросить блок при изменении возрастной группы
  $: if (newExercise.age_group) {
    if (!availableBlocks.some((b: Option) => b.id === newExercise.block)) {
      newExercise.block = "";
    }
  }

  // Загрузка упражнений
  async function loadExercises() {
    isLoading = true;
    error = "";
    try {
      const { data, error: sbError } = await supabase
        .from("exercises")
        .select("*")
        .order("created_at", { ascending: false });

      if (sbError) throw sbError;
      exercises = data || [];
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      error = "Не удалось загрузить упражнения";
    } finally {
      isLoading = false;
    }
  }

  // Сохранение упражнения
  async function saveExercise() {
    if (!validate()) return;

    isLoading = true;
    error = "";
    try {
      if (editingId) {
        const { error: sbError } = await supabase
          .from("exercises")
          .update(newExercise)
          .eq("id", editingId);

        if (sbError) throw sbError;
      } else {
        const { error: sbError } = await supabase
          .from("exercises")
          .insert(newExercise);

        if (sbError) throw sbError;
      }

      resetForm();
      await loadExercises();
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      error = "Ошибка при сохранении упражнения";
    } finally {
      isLoading = false;
    }
  }

  // Валидация формы
  function validate(): boolean {
    if (!newExercise.name.trim()) {
      error = "Введите название упражнения";
      return false;
    }
    if (!newExercise.description.trim()) {
      error = "Введите описание упражнения";
      return false;
    }
    if (newExercise.duration <= 0) {
      error = "Длительность должна быть больше 0";
      return false;
    }
    if (!newExercise.stage) {
      error = "Выберите этап подготовки";
      return false;
    }
    if (!newExercise.age_group) {
      error = "Выберите возрастную группу";
      return false;
    }
    if (!newExercise.block) {
      error = "Выберите блок";
      return false;
    }
    return true;
  }

  // Редактирование упражнения
  function editExercise(exercise: Exercise) {
    editingId = exercise.id || null;
    newExercise = { ...exercise };
  }

  // Удаление упражнения
  async function deleteExercise(id: number) {
    if (!confirm("Удалить это упражнение?")) return;

    isLoading = true;
    try {
      const { error: sbError } = await supabase
        .from("exercises")
        .delete()
        .eq("id", id);

      if (sbError) throw sbError;
      await loadExercises();
    } catch (err) {
      console.error("Ошибка удаления:", err);
      error = "Ошибка при удалении упражнения";
    } finally {
      isLoading = false;
    }
  }

  // Сброс формы
  function resetForm() {
    newExercise = {
      name: "",
      description: "",
      duration: 10,
      part: "preparatory",
      stage: "",
      age_group: "",
      block: "",
      video_link: "",
      scheme_url: "",
    };
    editingId = null;
    error = "";
  }

  // Загрузка данных при монтировании
  onMount(loadExercises);

  function goBack() {       
        goto(`/profile`);
    }
</script>

<div class="admin-container">
  <div class="header-container">
    <button class="back-button" on:click={goBack} aria-label="Назад">← Назад</button>
    <h1>Администрирование упражнений</h1>
  </div>
  {#if error}
    <div class="error-message">{error}</div>
  {/if}

  <!-- Форма добавления/редактирования -->
  <div class="form-section">
    <h2>{editingId ? "Редактировать" : "Добавить"} упражнение</h2>

    <div class="form-grid">
      <div class="form-group">
        <label for="name">Название*</label>
        <input id="name" type="text" bind:value={newExercise.name} />
      </div>

      <div class="form-group">
        <label for="duration">Длительность (мин)*</label>
        <input
          id="duration"
          type="number"
          bind:value={newExercise.duration}
          min="1"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="description">Описание*</label>
      <textarea id="description" bind:value={newExercise.description} rows="4"
      ></textarea>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label for="stage">Этап*</label>
        <select id="stage" bind:value={newExercise.stage}>
          <option value="">Выберите этап</option>
          {#each step1Data.options as option (option.id)}
            <option value={option.id} disabled={option.disabled}>
              {option.name} - {option.title}
            </option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label for="age">Возрастная группа*</label>
        <select
          id="age"
          bind:value={newExercise.age_group}
          disabled={!newExercise.stage}
        >
          <option value="">Выберите возрастную группу</option>
          {#each availableAgeGroups as option (option.id)}
            <option value={option.id}>{option.name} - {option.title}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label for="block">Блок*</label>
        <select
          id="block"
          bind:value={newExercise.block}
          disabled={!newExercise.age_group}
        >
          <option value="">Выберите блок</option>
          {#each availableBlocks as option (option.id)}
            <option value={option.id}>{option.name} {option.title}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label for="part">Часть тренировки</label>
        <select id="part" bind:value={newExercise.part}>
          {#each parts as part}
            <option value={part}>
              {part === "preparatory"
                ? "Подготовительная"
                : part === "main"
                  ? "Основная"
                  : part === "final"
                    ? "Заключительная"
                    : ""}
            </option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label for="video_link">Ссылка на видео</label>
        <input
          id="video_link"
          type="url"
          placeholder="https://..."
          bind:value={newExercise.video_link}
        />
      </div>
      <div class="form-group">
        <label for="scheme_url">Ссылка на схему</label>
        <input
          id="scheme_url"
          type="url"
          placeholder="https://..."
          bind:value={newExercise.scheme_url}
        />
      </div>
    </div>

    <div class="form-actions">
      <button on:click={saveExercise} disabled={isLoading}>
        {isLoading ? "Сохранение..." : "Сохранить"}
      </button>
      {#if editingId}
        <button on:click={resetForm} disabled={isLoading}>Отмена</button>
      {/if}
    </div>
  </div>

  <!-- Список упражнений -->
  <div class="list-section">
    <h2>Список упражнений</h2>

    {#if isLoading && exercises.length === 0}
      <p>Загрузка...</p>
    {:else if exercises.length === 0}
      <p>Нет упражнений</p>
    {:else}
      <div class="exercise-list">
        {#each exercises as exercise (exercise.id)}
          <div class="exercise-item">
            <div class="exercise-header">
              <h3>{exercise.name}</h3>
              <div class="exercise-meta">
                {exercise.duration} мин |
                {step1Data.options.find((s: Option) => s.id === exercise.stage)?.name || exercise.stage} |
                {step2Data[exercise.stage]?.find((a: Option) => a.id === exercise.age_group)?.name || exercise.age_group} |
                {step3Data[exercise.age_group]?.find((b: Option) => b.id === exercise.block)?.name || exercise.block}
              </div>
            </div>
            <div class="exercise-actions">
              <button on:click={() => editExercise(exercise)}>✏️</button>
              <button on:click={() => deleteExercise(exercise.id!)}>🗑️</button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .admin-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: var(--background-light);
  }

  .header-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .back-button {       
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

    .back-button:hover {
        background-color: var(--primary-color);
        color: white;
    }

  .admin-container h1 {
    text-align: center;
    margin-bottom: 32px;
  }

  .error-message {
    color: #ef4444;
    padding: 10px;
    background: #fee2e2;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .form-section,
  .list-section {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
    margin-bottom: 5px;
    min-width: 0;
  }

  .form-group {
    min-width: 0;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    box-sizing: border-box;
    min-width: 0;
  }

  textarea {
    max-width: 100%;
    resize: vertical;
  }

  .form-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }

  button {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }

  .exercise-item {
    padding: 15px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .exercise-actions button {
    background: none;
    border: none;
    font-size: 1.2em;
  }

  @media (max-width: 600px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
