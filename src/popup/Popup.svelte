<script lang="ts">
  import { onMount } from 'svelte';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import ThemeToggle from '../components/ThemeToggle.svelte';
  import Todo from '../components/Todo.svelte';
  import SignIn from '../components/SignIn.svelte';
  import { signOutOfAccount } from '../lib/server/firebase';
  import Loader from '../components/icons/Loader.svelte';
  import Logout from '../components/icons/Logout.svelte';
  import Coffee from '../components/icons/Coffee.svelte';

  let user = null;
  let error = null;
  let auth = null;

  let isAuthenticated = false;
  let isLoading = true;

  async function checkAuth() {
    return new Promise<boolean>((resolve) => {
      auth = getAuth();
      auth == null ? resolve(false) : resolve(true);
    });
  }

  onMount(async () => {
    isAuthenticated = await checkAuth();
    isLoading = false;

    onAuthStateChanged(
      auth,
      (currentUser) => {
        user = currentUser;
      },
      (err) => {
        error = err;
      },
    );
  });
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" />
</svelte:head>

<template>
  {#if isLoading}
    <div class="loader-container">
      <Loader />
    </div>
  {:else if user}
    <main>
      <div class="header">Q<span>uick</span>T<span>asks</span></div>

      <div class="sign-out">
        <button on:click={signOutOfAccount}>
          <Logout />
        </button>
      </div>

      <div class="tooltip-container">
        <a href="https://www.buymeacoffee.com/wleonvil" target="_blank" class="coffee">
          <Coffee />
        </a>
        <span class="tooltip">Buy Me a Coffee</span>
      </div>

      <div class="theme-toggle">
        <ThemeToggle />
      </div>
      <Todo firebase_uid={user.uid} />
    </main>
  {:else}
    <SignIn />
  {/if}
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
    --tooltip-bg: rgb(34, 34, 34);
    --tooltip-text: white;
    transition: all 0.2s;
  }

  :global(body.dark) {
    --primary: #0094de;
    --background: #242424;
    --text: white;
    --delete-fill: white;
    --tooltip-bg: white;
    --tooltip-text: rgb(34, 34, 34);
    transition: all 0.2s;
  }

  main {
    text-align: center;
    padding: 1.8em 1em 1em;
    margin: 0 auto;
  }

  .header {
    color: var(--primary);
    text-transform: uppercase;
    font-size: 1.75rem;
    font-weight: 400;
    margin: 1.5rem auto 1rem;
  }

  .header span {
    font-size: 1.3rem;
  }

  .sign-out {
    position: absolute;
    top: 18px;
    left: 12px;
  }

  .sign-out button {
    width: fit-content;
    background: none;
    border: none;
    color: black;
    cursor: pointer;
  }

  .theme-toggle {
    position: absolute;
    top: 12px;
    right: 12px;
  }

  .tooltip-container {
    display: flex;
    position: absolute;
    top: 18px;
    left: 50%;
    margin-left: -12px;
  }

  .tooltip {
    position: absolute;
    bottom: 0;
    width: max-content;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.3em 0.6em;
    opacity: 0;
    pointer-events: none;
    transition: all 0.5s;
    background-color: var(--tooltip-bg);
    border-radius: 12px;
    color: var(--tooltip-text);
    cursor: pointer;
  }

  .tooltip::before {
    content: '';
    position: absolute;
    height: 0.6em;
    width: 0.6em;
    top: -0.2em;
    left: 50%;
    transform: translate(-50%) rotate(45deg);
    background-color: var(--tooltip-bg);
  }

  .tooltip-container:hover .tooltip {
    bottom: -100%;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .loader-container {
    margin: 120px auto;
  }
</style>
