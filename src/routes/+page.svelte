<script lang="ts">
  import "./styles.css";
  import MusicListcard from "./MusicListcard.svelte";
  import { getFirestore, collection, getDocs } from "firebase/firestore";
  import { onMount } from "svelte";
  import { app, songs } from "./stores";
  import { getStorage, ref, getDownloadURL } from "firebase/storage";
  import { openDB, deleteDB, wrap, unwrap } from "idb";

  interface mydata {
    audio: string;
    artist: string;
    image: string;
    song: string;
    lyrics: any;
    id: number;
    downloaded: boolean;
  }

  async function indexedDB(songs: { totalSongs: number; songs: mydata[] }) {
    const idb = await openDB("MySongs", 1);

    songs.songs.forEach(async (song) => {
      const checkIfPresent = await idb.get("songs", song.id);
      if (checkIfPresent != undefined) {
        song.downloaded = true;
      }
    });

    idb.close();
    return songs;
  }

  async function MyData() {
    const db = getFirestore($app);
    const storage = getStorage($app);
    const idb = await openDB("MySongs", 1);

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
        downloaded: false,
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

  onMount(async () => {
    if ($songs.totalSongs == 0) {
      const temp = await MyData();
      const wait = await indexedDB(temp);
      $songs = await wait;
    }
  });
</script>

<div class="navigation">
  <div />
  <p class="title">Songs</p>
  <a href="/upload" style="justify-self: right; padding: 0px 30px"
    ><svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 34C26.3898 34 34 26.3898 34 17C34 7.61016 26.3898 0 17 0C7.61016 0 0 7.61016 0 17C0 26.3898 7.61016 34 17 34ZM15.4062 22.8438V18.5938H11.1562C10.273 18.5938 9.5625 17.8832 9.5625 17C9.5625 16.1168 10.273 15.4062 11.1562 15.4062H15.4062V11.1562C15.4062 10.273 16.1168 9.5625 17 9.5625C17.8832 9.5625 18.5938 10.273 18.5938 11.1562V15.4062H22.8438C23.727 15.4062 24.4375 16.1168 24.4375 17C24.4375 17.8832 23.727 18.5938 22.8438 18.5938H18.5938V22.8438C18.5938 23.727 17.8832 24.4375 17 24.4375C16.1168 24.4375 15.4062 23.727 15.4062 22.8438Z"
        fill="white"
      />
    </svg>
  </a>
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
