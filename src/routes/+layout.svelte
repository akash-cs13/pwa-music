<script>
  import "./styles.css";
  import NowPlayingBar from "./NowPlayingBar.svelte";
  import { currentPlaying } from "./stores";
</script>

<svelte:head>
  <title>PWA Music App</title>
</svelte:head>

<body class="appbody">
  <div class="myappbody">
    <slot />
    {#if $currentPlaying.song !== "none"}
      <NowPlayingBar />
    {/if}
  </div>
</body>
