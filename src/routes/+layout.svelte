<script>
  import "./styles.css";
  import NowPlayingBar from "./NowPlayingBar.svelte";
  import { onMount } from "svelte";
</script>

<body>
  <slot />
  <NowPlayingBar />
</body>
