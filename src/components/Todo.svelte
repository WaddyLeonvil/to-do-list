<script lang="ts">
  import { onMount } from 'svelte';
  import Checkbox from './Checkbox.svelte';
  import Delete from './Delete.svelte';

  type Task = {
    id: number;
    text: string;
    completed: boolean;
  };

  let tasks: Task[] = [];
  let newTask: string = '';

  async function addTask() {
    if (newTask.trim()) {
      const res = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTask, completed: false }),
      });
      const task = await res.json();
      tasks = [...tasks, task];
      newTask = '';
    }
  }

  async function toggleTask(task) {
    task.completed = !task.completed;
    await fetch(`http://localhost:3000/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
  }

  async function deleteTask(task) {
    await fetch(`http://localhost:3000/tasks/${task.id}`, {
      method: 'DELETE',
    });
    tasks = tasks.filter((t) => t !== task);
  }

  onMount(async () => {
    const res = await fetch('http://localhost:3000/tasks');
    tasks = await res.json();
  });
</script>

<div class="task-input">
  <form on:submit|preventDefault={addTask}>
    <input bind:value={newTask} placeholder="Add a new task..." maxlength="40" />
    <button type="submit">Add</button>
  </form>
</div>

{#each tasks as task, index}
  <div class="task">
    <Checkbox>
      <input type="checkbox" checked={task.completed} on:change={() => toggleTask(task)} />
    </Checkbox>

    <span class="task-text">{task.text}</span>
    <!-- <button on:click={() => deleteTask(task)}> Delete </button> -->
    <div class="delete">
      <Delete deleteFn={() => deleteTask(task)} />
    </div>
  </div>
{/each}

<style>
  button {
    color: black;
    border: none;
  }
  .task-input input {
    width: 65%;
    height: 32px;
    margin-bottom: 8px;
    padding: 0 12px;
    border: none;
    border-radius: 16px 0 0 16px;
    outline: solid 2px var(--primary);
    background-color: rgb(248, 248, 248);
    color: black;
  }
  :global(body.dark) .task-input input::placeholder {
    color: rgb(136, 136, 136);
  }
  :global(body.light) .task-input input::placeholder {
    color: rgb(100, 100, 100);
  }
  .task-input button {
    height: 32px;
    padding: 0 12px 0 8px;
    background-color: var(--primary);
    outline: solid 2px var(--primary);
    margin-left: -4px;
    border-radius: 0 16px 16px 0;
    cursor: pointer;
    color: white;
  }

  .task {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    /* background:
      radial-gradient(circle at 100% 100%, #242424 0, #242424 6px, transparent 6px) 0% 0%/8px 8px
        no-repeat,
      radial-gradient(circle at 0 100%, #242424 0, #242424 6px, transparent 6px) 100% 0%/8px 8px
        no-repeat,
      radial-gradient(circle at 100% 0, #242424 0, #242424 6px, transparent 6px) 0% 100%/8px 8px
        no-repeat,
      radial-gradient(circle at 0 0, #242424 0, #242424 6px, transparent 6px) 100% 100%/8px 8px
        no-repeat,
      linear-gradient(#242424, #242424) 50% 50% / calc(100% - 4px) calc(100% - 16px) no-repeat,
      linear-gradient(#242424, #242424) 50% 50% / calc(100% - 16px) calc(100% - 4px) no-repeat,
      linear-gradient(135deg, rgba(87, 159, 228, 1) 0%, #ff4d5a 100%); */
    outline: solid 2px var(--primary);
    border-radius: 8px;
    padding: 6px 60px 6px 6px;
    box-sizing: border-box;
    width: 100%;
    margin-top: 8px;
    color: var(--text);
  }
  .task-text,
  .task-input input {
    font-family: 'Montserrat';
  }
  .delete {
    position: absolute;
    right: 8px;
  }
  .task input {
    display: none;
  }
</style>
