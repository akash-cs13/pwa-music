<script lang="ts">
  import "./styles.css";
  import MusicListcard from "./MusicListcard.svelte";
  import circle_plus from "$lib/svg/circle-plus-solid.svg";
  import { getFirestore, collection, getDocs } from "firebase/firestore";
  import { onMount } from "svelte";
  import { app, songs } from "./stores";
  import { getStorage, ref, getDownloadURL } from "firebase/storage";

  interface mydata {
    audio: string;
    artist: string;
    image: string;
    song: string;
    lyrics: any;
    id: number;
  }

  async function MyData() {
    const db = getFirestore($app);
    const storage = getStorage($app);

    const querySnapshot = await getDocs(collection(db, "Music"));

    let temp: mydata[] = [];
    let count = 0;
    querySnapshot.forEach(async (doc) => {
      if (parseInt(doc.id) > count) {
        count = parseInt(doc.id);
      }
      temp.push({
        audio: doc.data().audio,
        artist: doc.data().artist,
        image: doc.data().image,
        song: doc.data().song,
        lyrics: JSON.parse(doc.data().lyrics),
        id: parseInt(doc.id),
      });
    });
    const temp2 = await temp;

    for (const element of temp2) {
      const imageURL = await getDownloadURL(ref(storage, element.image));
      const audioURL = await getDownloadURL(ref(storage, element.audio));
      element.image = imageURL;
      element.audio = audioURL;
    }
    return { totalSongs: count, songs: temp2 };
  }
  var checkForNew;
  onMount(async () => {
    if ($songs.totalSongs == 0) {
      $songs = await MyData();
    }
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
  {#each $songs.songs as song}
    <MusicListcard {song} />
  {:else}
    {#each Array(7) as _}
      <div class="shimmer">
        <div class="albumArt shine" />
        <div>
          <div class="songName shine" />
          <div class="artistName shine" />
        </div>
        <div class="downloadButton shine" />
      </div>
    {/each}
  {/each}

  <div style="height: 115px;" />
</div>
