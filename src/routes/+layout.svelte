<script>
  import "./styles.css";
  import NowPlayingBar from "./NowPlayingBar.svelte";
  import { currentPlaying } from "./stores";
  import { onMount } from "svelte";
  // @ts-ignore
  import { pwaInfo } from "virtual:pwa-info";

  onMount(async () => {
    if (pwaInfo) {
      // @ts-ignore
      const { registerSW } = await import("virtual:pwa-register");
      registerSW({
        immediate: true,
        // @ts-ignore
        onRegistered(r) {
          // uncomment following code if you want check for updates
          // r && setInterval(() => {
          //    console.log('Checking for sw update')
          //    r.update()
          // }, 20000 /* 20s for testing purposes */)
          console.log(`SW Registered: ${r}`);
        },
        // @ts-ignore
        onRegisterError(error) {
          console.log("SW registration error", error);
        },
      });
    }
  });

  $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : "";
</script>

<svelte:head>
  <title>PWA Music App</title>
  {@html webManifest}
</svelte:head>

<body>
  <slot />
  {#if $currentPlaying.song !== "none"}
    <NowPlayingBar />
  {/if}
</body>
