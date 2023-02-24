<script>
  import "./styles.css";
  import NowPlayingBar from "./NowPlayingBar.svelte";
  import { currentPlaying } from "./stores";
  import { openDB } from "idb";
  import { onMount } from "svelte";

  const createIDB = async () => {
    const db = await openDB("MySongs", 1, {
      upgrade(db) {
        db.createObjectStore("songs", { keyPath: "id" });
      },
    });

    db.close();
  };

  onMount(async () => {
    await createIDB();
  });
</script>

<svelte:head>
  <title>Svelteify</title>
</svelte:head>

<body class="appbody">
  <div class="myappbody">
    <slot />
    {#if $currentPlaying.song !== "none"}
      <NowPlayingBar />
    {/if}
  </div>
</body>
