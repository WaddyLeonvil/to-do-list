<script>
  import { onAuthStateChanged, signOut } from 'firebase/auth';

  let user = null;

  // Listening for auth state changes
  onAuthStateChange((currentUser) => {
    user = curentUser;
  });

  async function handleSignOut() {
    await signOut(auth);
  }
</script>

{#if user}
  <p>Welcome, {user.email}</p>
  <button on:click={handleSignOut}> Sign Out </button>
{:else}
  <p>You are not signed in</p>
{/if}
