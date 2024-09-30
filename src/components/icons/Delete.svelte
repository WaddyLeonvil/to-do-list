<script>
  export let deleteFn;
</script>

<button class="btn" on:click={deleteFn}>
  <svg
    viewBox="0 0 15 17.5"
    height="17.5"
    width="15"
    xmlns="http://www.w3.org/2000/svg"
    class="icon"
  >
    <path
      transform="translate(-2.5 -1.25)"
      d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z"
      id="Fill"
    ></path>
  </svg>
</button>

<style>
  .btn {
    background-color: transparent;
    position: relative;
    border: none;
    cursor: pointer;
  }

  .icon {
    transform: scale(1.2);
    transition: 0.4s;
  }

  .btn:hover > .icon {
    transform: scale(1.3);
  }

  .icon path {
    fill: var(--delete-fill);
  }

  .btn:hover > .icon path {
    fill: rgb(255, 0, 0);
  }

  .btn:hover::after {
    visibility: visible;
    opacity: 1;
    top: -160%;
  }

  svg {
    margin-top: 4px;
  }
</style>
