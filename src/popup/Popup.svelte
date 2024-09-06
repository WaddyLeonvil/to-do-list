<script lang="ts">
  import ThemeToggle from '../components/ThemeToggle.svelte';
  import Todo from '../components/Todo.svelte';
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" />
</svelte:head>

<template>
  <main>
    <h3>To do list</h3>

    <div class="theme-toggle">
      <ThemeToggle />
    </div>

    <Todo />
  </main>
</template>

<style>
  :global(:root) {
    font-family: 'Montserrat' !important;

    color-scheme: light dark;
    background-color: #242424;
  }

  :global(body) {
    min-width: 20rem;
    margin: 0;
    background-color: var(--background);
    transition: all 0.2s;
  }

  :global(body.light) {
    --primary: #242424;
    --background: #f3f3f3;
    --text: black;
    --delete-fill: black;
    transition: all 0.2s;
  }

  :global(body.dark) {
    --primary: rgb(0, 148, 222);
    --background: #242424;
    --text: white;
    --delete-fill: white;
    transition: all 0.2s;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  h3 {
    color: var(--primary);
    text-transform: uppercase;
    font-size: 1.5rem;
    font-weight: 200;
    line-height: 1.2rem;
    margin: 2rem auto;
  }

  .theme-toggle {
    position: absolute;
    top: 12px;
    right: 12px;
  }
</style>
