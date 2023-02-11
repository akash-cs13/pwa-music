<script lang="ts">
  import "./styles.css";
  import MusicListcard from "./MusicListcard.svelte";
  import circle_plus from "$lib/svg/circle-plus-solid.svg";
  import album_art from "$lib/album/album.png";
  import { getFirestore, collection, getDocs } from "firebase/firestore";
  import { onMount } from "svelte";
  import { app } from "./stores";
  import { initializeApp } from "firebase/app";

  interface mydata {
    audio: string;
    artist: string;
    image: string;
    song: string;
    lyrics: string;
  }
  let songs: mydata[] = [];
  onMount(async () => {
    const temp: mydata[] = [];

    const db = getFirestore($app);

    const querySnapshot = await getDocs(collection(db, "Music"));
    querySnapshot.forEach(async (doc) => {
      temp.push({
        audio: doc.data().audio,
        artist: doc.data().artist,
        image: doc.data().image,
        song: doc.data().song,
        lyrics: doc.data().image,
      });
    });
    songs = await temp;
  });
</script>

<div class="navigation">
  <div />
  <p class="title">Songs</p>
  <a href="/upload" style="justify-self: right; padding: 0px 30px"
    ><img
      src={circle_plus}
      style="height: 34px; width:34px"
      alt=""
      srcset=""
    /></a
  >
</div>

<div class="List" id="musicList">
  {#each songs as song}
    <MusicListcard {song} />
  {:else}
    <p>Loading....</p>
  {/each}

  <div style="height: 115px;" />
</div>
