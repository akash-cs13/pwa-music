<script lang="ts">
  import "./styles.css";
  import MusicListcard from "./MusicListcard.svelte";
  import circle_plus from "$lib/svg/circle-plus-solid.svg";
  import album_art from "$lib/album/album.jpg";
  import { initializeApp } from "firebase/app";
  import { getFirestore, collection, getDocs } from "firebase/firestore";
  import { onMount } from "svelte";

  const firebaseConfig = {
    apiKey: "AIzaSyDLOcgayXHtMcmDfWwS-2YZ0EqDDUWzSy8",
    authDomain: "pwa-music-fced1.firebaseapp.com",
    projectId: "pwa-music-fced1",
    storageBucket: "pwa-music-fced1.appspot.com",
    messagingSenderId: "1008965709525",
    appId: "1:1008965709525:web:417ad9b2e2c70122237c5c",
    measurementId: "G-1R0SFL17XC",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  interface mydata {
    audio: string;
    artist: string;
    image: string;
    song: string;
    lyrics: string;
  }
  let songs: mydata[] = [];
  onMount(async () => {
    const querySnapshot = await getDocs(collection(db, "Music"));
    querySnapshot.forEach((doc) => {
      songs.push({
        audio: doc.data().audio,
        artist: doc.data().artist,
        image: doc.data().image,
        song: doc.data().song,
        lyrics: doc.data().lyrics,
      });
    });
    //getting output sucessfully
    console.log(songs);
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

<div class="List">
  {#each songs as song}
    <MusicListcard song={song.song} artist={song.artist} image={album_art} />
  {:else}
    <p>Loading....</p>
  {/each}
  <div style="height: 115px;" />
</div>
