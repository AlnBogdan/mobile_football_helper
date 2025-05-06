<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    // Проверка роли при загрузке
  $: {
    if (!$page.data.user || $page.data.user.role !== 'admin') {
      goto('/');
    }
  }
  
    // Тип для упражнения
    type ExercisePart = 'preparatory' | 'main' | 'final';
    
    interface Exercise {
      id?: number;
      name: string;
      description: string;
      scheme_url?: string;
      duration: number;
      part: ExercisePart;
      video_link?: string;
      stage: string;
      age_group: string;
      block: string;
    }
  
    // Состояние компонента
    let exercises: Exercise[] = [];
    let newExercise: Exercise = {
      name: '',
      description: '',
      duration: 10,
      part: 'preparatory',
      stage: '',
      age_group: '',
      block: ''
    };
    let editingId: number | null = null;
    let isLoading = false;
    let error = '';
  
    // Опции для селектов
    const parts: ExercisePart[] = ['preparatory', 'main', 'final'];
    const stages = ['Начальный', 'Средний', 'Продвинутый'];
    const ageGroups = ['6-7 лет', '8-9 лет', '10-11 лет'];
    const blocks = ['Техника', 'Тактика', 'Физподготовка'];
  
    // Загрузка упражнений
    async function loadExercises() {
      isLoading = true;
      error = '';
      try {
        const { data, error: sbError } = await supabase
          .from('exercises')
          .select('*')
          .order('created_at', { ascending: false });
  
        if (sbError) throw sbError;
        exercises = data || [];
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        error = 'Не удалось загрузить упражнения';
      } finally {
        isLoading = false;
      }
    }
  
    // Сохранение упражнения
    async function saveExercise() {
      if (!validate()) return;
      
      isLoading = true;
      error = '';
      try {
        if (editingId) {
          const { error: sbError } = await supabase
            .from('exercises')
            .update(newExercise)
            .eq('id', editingId);
  
          if (sbError) throw sbError;
        } else {
          const { error: sbError } = await supabase
            .from('exercises')
            .insert(newExercise);
  
          if (sbError) throw sbError;
        }
        
        resetForm();
        await loadExercises();
      } catch (err) {
        console.error('Ошибка сохранения:', err);
        error = 'Ошибка при сохранении упражнения';
      } finally {
        isLoading = false;
      }
    }
  
    // Валидация формы
    function validate(): boolean {
      if (!newExercise.name.trim()) {
        error = 'Введите название упражнения';
        return false;
      }
      if (!newExercise.description.trim()) {
        error = 'Введите описание упражнения';
        return false;
      }
      if (newExercise.duration <= 0) {
        error = 'Длительность должна быть больше 0';
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
      if (!confirm('Удалить это упражнение?')) return;
      
      isLoading = true;
      try {
        const { error: sbError } = await supabase
          .from('exercises')
          .delete()
          .eq('id', id);
  
        if (sbError) throw sbError;
        await loadExercises();
      } catch (err) {
        console.error('Ошибка удаления:', err);
        error = 'Ошибка при удалении упражнения';
      } finally {
        isLoading = false;
      }
    }
  
    // Сброс формы
    function resetForm() {
      newExercise = {
        name: '',
        description: '',
        duration: 10,
        part: 'preparatory',
        stage: '',
        age_group: '',
        block: ''
      };
      editingId = null;
      error = '';
    }
  
    // Загрузка данных при монтировании
    onMount(loadExercises);
  </script>

  {#if $page.data.user?.role === 'admin'}
  <div class="admin-container">
    <h1>Администрирование упражнений</h1>
  
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
  
    <!-- Форма добавления/редактирования -->
    <div class="form-section">
      <h2>{editingId ? 'Редактировать' : 'Добавить'} упражнение</h2>
      
      <div class="form-grid">
        <div class="form-group">
          <label for="name">Название*</label>
          <input id="name" type="text" bind:value={newExercise.name}>
        </div>
        
        <div class="form-group">
          <label for="duration">Длительность (мин)*</label>
          <input id="duration" type="number" bind:value={newExercise.duration} min="1">
        </div>
      </div>
  
      <div class="form-group">
        <label for="description">Описание*</label>
        <textarea id="description" bind:value={newExercise.description} rows="4"></textarea>
      </div>
  
      <div class="form-grid">
        <div class="form-group">
          <label for="stage">Этап</label>
          <select id="stage" bind:value={newExercise.stage}>
            <option value="">Выберите этап</option>
            {#each stages as stage}
              <option value={stage}>{stage}</option>
            {/each}
          </select>
        </div>
        
        <div class="form-group">
          <label for="age">Возраст</label>
          <select id="age" bind:value={newExercise.age_group}>
            <option value="">Выберите возраст</option>
            {#each ageGroups as age}
              <option value={age}>{age}</option>
            {/each}
          </select>
        </div>
      </div>
  
      <div class="form-grid">
        <div class="form-group">
          <label for="block">Блок</label>
          <select id="block" bind:value={newExercise.block}>
            <option value="">Выберите блок</option>
            {#each blocks as block}
              <option value={block}>{block}</option>
            {/each}
          </select>
        </div>
        
        <div class="form-group">
          <label for="part">Часть</label>
          <select id="part" bind:value={newExercise.part}>
            {#each parts as part}
              <option value={part}>
                {part === 'preparatory' && 'Подготовительная'}
                {part === 'main' && 'Основная'}
                {part === 'final' && 'Заключительная'}
              </option>
            {/each}
          </select>
        </div>
      </div>
  
      <div class="form-actions">
        <button on:click={saveExercise} disabled={isLoading}>
          {isLoading ? 'Сохранение...' : 'Сохранить'}
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
                  {exercise.duration} мин | {exercise.stage} | {exercise.age_group}
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
  {:else}
  <div class="access-denied">
    <h2>Доступ запрещен</h2>
    <p>Требуются права администратора</p>
  </div>
{/if}
  
  <style>
    .admin-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .error-message {
      color: #ef4444;
      padding: 10px;
      background: #fee2e2;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    
    .form-section, .list-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    
    input, textarea, select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
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
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .exercise-actions button {
      background: none;
      border: none;
      font-size: 1.2em;
      margin-left: 10px;
    }
  </style>