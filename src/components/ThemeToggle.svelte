<script lang="ts">
  import { onMount } from 'svelte';

  function toggleColorScheme(enableDarkMode = false) {
    if (enableDarkMode) {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }

    localStorage.setItem('darkMode', darkMode.toString());
  }

  function isDarkMode() {
    if (import.meta.env.SSR) {
      return false;
    }

    const localData = window.localStorage.getItem('darkMode');
    if (localData) {
      return 'true' === localData;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  onMount(() => {
    toggleColorScheme(isDarkMode());
  });

  let lightMode = false;

  $: darkMode = !lightMode;
  $: toggleColorScheme(darkMode);
</script>

<label class="switch">
  <input type="checkbox" bind:checked={lightMode} />
  <span class="slider"></span>
</label>

<style>
  /* The switch - the box around the slider */
  .switch {
    font-size: 17px;
    position: relative;
    display: inline-block;
    width: 3.5em;
    height: 2em;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    --slider-background: #28096b;
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--slider-background);
    transition: all 0.5s;
    transition: outline 0.1s;
    border-radius: 30px;
  }

  :global(body.dark) .slider {
    outline: solid 2px white;
  }

  :global(body.light) .slider {
    --slider-background: #00b0f6;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 1.4em;
    width: 1.4em;
    border-radius: 50%;
    left: 10%;
    bottom: 15%;
    box-shadow: inset 8px -4px 0px 0px #e8e8e8;
    background: var(--slider-background);
    transition: 0.5s;
  }

  input:checked + .slider {
    background-color: #00b0f6;
  }

  input:checked + .slider:before {
    transform: translateX(100%);
    box-shadow: inset 15px -4px 0px 15px #ffdd03;
  }
</style>
