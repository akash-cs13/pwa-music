<script>
  import "./styles.css";
  import NowPlayingBar from "./NowPlayingBar.svelte";
  import { currentPlaying } from "./stores";
  import { onMount } from "svelte";
  import { openDB, deleteDB, wrap, unwrap } from "idb";

  async function dbInitialise() {
    const db = await openDB("MySongs", 1, {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        const store = db.createObjectStore("songs", { keyPath: "id" });
        store.createIndex("download", "song");
      },
    });

    //await db.add("songs", { id: 5, song: "Lilac", artist: "IU" });

    console.log(await db.get("songs", 4));
    db.close();
  }

  onMount(async () => {
    dbInitialise();
  });
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
