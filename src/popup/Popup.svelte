<script lang="ts">
  import { onMount } from 'svelte';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import ThemeToggle from '../components/ThemeToggle.svelte';
  import Todo from '../components/Todo.svelte';
  import SignIn from '../components/SignIn.svelte';
  import { signOutOfAccount } from '../lib/server/firebase';
  import Loader from '../components/icons/Loader.svelte';
  import Logout from '../components/icons/Logout.svelte';
  import Menu from '../components/icons/Menu.svelte';

  let user = null;
  let error = null;
  let auth = null;
  let menuOpen = false;

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
    <Loader />
  {:else if user}
    <main>
      <h3>To do list</h3>

      <div class="sign-out">
        <Menu bind:checked={menuOpen} />
        {menuOpen}
        <button on:click={signOutOfAccount}>
          <Logout />
        </button>
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
    transition: all 0.2s;
  }

  :global(body.dark) {
    --primary: #0094de;
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
</style>
