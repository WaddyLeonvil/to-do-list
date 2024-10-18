<script>
  import { auth, resetPassword, signIn, signUp } from '../lib/server/firebase';
  import Back from './icons/Back.svelte';

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  let email = '';
  let password = '';
  let errorMessage = '';
  let successMessage = '';
  let forgotPass = false;
  let authState = 'login';
  let authStateOptions = [
    {
      value: 'login',
      label: 'Log In',
    },
    {
      value: 'signup',
      label: 'Sign Up',
    },
  ];

  async function handleSignIn() {
    if (authState === 'login') {
      try {
        const user = await signIn(email, password);
      } catch (error) {
        errorMessage = 'Invalid email or password.';
      }
    } else if (authState === 'signup') {
      try {
        const user = await signUp(email, password);
      } catch (error) {
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email.';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already in use.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Passwords should be at least 6 characters.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'There was a network error, please try again.';
            break;
          default:
            errorMessage = 'There was a problem creating your account.';
        }
      }
    }
  }

  async function handleReset() {
    try {
      await resetPassword(email);
    } catch (error) {
      switch (error.code) {
        case 'auth/missing-email':
          errorMessage = 'Please input an email.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'The email you inputted is invalid.';
          break;
        default:
          errorMessage = 'There was a problem sending the email.';
      }
    }
  }
</script>

<div class="container">
  {#if forgotPass === false}
    <div class="header">QuickTasks</div>
    <div class="radio-inputs">
      {#each authStateOptions as authMode}
        <label class="radio">
          <input
            type="radio"
            name="radio"
            bind:group={authState}
            value={authMode.value}
            on:change={() => {
              errorMessage = '';
            }}
          />
          <span class="name">{authMode.label}</span>
        </label>
      {/each}
    </div>

    <form on:submit|preventDefault={handleSignIn}>
      <div class="input-group">
        <input required="" name="email" bind:value={email} class:valid={email != ''} />
        <label class="user-label" for="email">Email</label>
      </div>
      <div class="input-group">
        <input
          required=""
          name="password"
          bind:value={password}
          class:valid={password != ''}
          autocomplete="off"
          type="password"
        />
        <label class="user-label" for="password">Password</label>
      </div>
      {#if errorMessage}
        <div class="error">
          {errorMessage}
        </div>
      {/if}

      {#if authState === 'login'}
        <button
          type="button"
          class="forgot"
          on:click={() => {
            forgotPass = true;
          }}>Forgot Password?</button
        >
      {/if}

      <button>{authState === 'login' ? 'Log In' : 'Sign Up'}</button>
    </form>
  {:else}
    <button
      class="back"
      on:click={() => {
        forgotPass = false;
        errorMessage = '';
        successMessage = '';
      }}
    >
      <Back />
    </button>
    <div class="header">Change Password</div>

    <div>
      Enter your email and click the button below to be sent an email in order to reset your
      password.
    </div>

    <div class="input-group change-input">
      <input required="" name="email" bind:value={email} class:valid={email != ''} />
      <label class="user-label" for="email">Email</label>
    </div>

    {#if errorMessage}
      <div class="error">
        {errorMessage}
      </div>
    {/if}

    {#if successMessage}
      <div class="success">
        {successMessage}
      </div>
    {/if}

    <button type="button" on:click={handleReset}> Send Reset E-mail </button>
  {/if}
</div>

<style>
  .container {
    margin: 12px 24px;
  }

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 24px;
    font-size: 24px;
    font-family: 'Montserrat';
    font-weight: 700;
  }

  .input-group {
    position: relative;
    margin-bottom: 16px;
  }

  input {
    width: 264px;
    border: solid 1.5px #9e9e9e;
    border-radius: 1rem;
    background: none;
    padding: 1rem;
    font-size: 1rem;
    color: #f5f5f5;
    transition: border 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .user-label {
    position: absolute;
    left: 15px;
    color: #e8e8e8;
    pointer-events: none;
    transform: translateY(1rem);
    transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  input:focus {
    outline: none;
    border: 1.5px solid #1a73e8;
  }

  input:focus ~ label {
    color: #2196f3;
  }

  input:focus ~ label,
  input.valid ~ label {
    transform: translateY(-50%) scale(0.8);
    background-color: #242424;
    padding: 0 0.2em;
  }

  button {
    width: 100%;
    border: none;
    border-radius: 0.375rem;
    padding: 0.75rem;
    background-color: #1a73e8;
    transition: all 0.25s;
    cursor: pointer;
    font-family: 'Montserrat';
  }

  button:hover:not(.forgot, .back) {
    background-color: #2180fc;
  }

  .forgot {
    width: fit-content;
    padding: 0;
    margin-bottom: 16px;
    background-color: transparent;
    color: #2196f3;
  }

  .error {
    display: flex;
    justify-content: center;
    width: 100%;
    color: red;
    margin-bottom: 8px;
  }

  .success {
    display: flex;
    justify-content: center;
    width: 100%;
    color: rgb(0, 220, 0);
    margin-bottom: 8px;
  }

  .radio-inputs {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    background-color: #5b5b5b;
    box-sizing: border-box;
    box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
    padding: 0.25rem;
    margin-bottom: 16px;
    width: 300px;
    font-size: 14px;
  }

  .radio-inputs .radio {
    flex: 1 1 auto;
    text-align: center;
  }

  .radio-inputs .radio input {
    display: none;
  }

  .radio-inputs .radio .name {
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    border: none;
    padding: 0.5rem 0;
    color: rgb(234, 234, 234);
    transition: all 0.15s ease-in-out;
    font-family: 'Montserrat';
  }

  .radio-inputs .radio input:checked + .name {
    background-color: #fff;
    color: black;
  }

  .change-input {
    margin: 20px 0;
  }

  .back {
    width: fit-content;
    padding: 0;
    background-color: transparent;
  }
</style>
