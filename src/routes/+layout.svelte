<script>
  import "./styles.css";
  import NowPlayingBar from "./NowPlayingBar.svelte";
  import { currentPlaying } from "./stores";
  import { openDB } from "idb";
  import { onMount } from "svelte";
  import { pwaInfo } from "virtual:pwa-info";

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

    if (pwaInfo) {
      const { registerSW } = await import("virtual:pwa-register");
      registerSW({
        immediate: true,
        onRegistered(r) {
          console.log(`SW Registered: ${r}`);
        },
        onRegisterError(error) {
          console.log("SW registration error", error);
        },
      });
    }

    pwaInfo &&
      (ReloadPrompt = (await import("$lib/ReloadPrompt.svelte")).default);
  });

  $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : "";
</script>

<svelte:head>
  <title>Svelteify</title>
  <meta property="og:title" content="Svelteify" />
  <meta property="og:image" content="https://i.imgur.com/kvlwyOw.png" />
  <meta
    property="og:description"
    content="A progressive web audio app with indexedDB offline caching."
  />
  {@html webManifest}
</svelte:head>

<body class="appbody">
  <div class="myappbody">
    <slot />
    {#if $currentPlaying.song !== "none"}
      <NowPlayingBar />
    {/if}
  </div>
</body>
