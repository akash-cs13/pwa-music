<script>
  import "./styles.css";
  import NowPlayingBar from "./NowPlayingBar.svelte";
  import { currentPlaying } from "./stores";
</script>

<body>
  <slot />
  {#if $currentPlaying.song !== "none"}
    <NowPlayingBar />
  {/if}
</body>
