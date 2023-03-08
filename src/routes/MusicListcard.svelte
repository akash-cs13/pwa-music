<script lang="ts">
  import { getStorage, ref, getBlob } from "firebase/storage";
  import { app, currentPlaying, downloadStores } from "./stores";
  import { openDB } from "idb";
  import { onMount } from "svelte";

  interface currentInfo {
    audio: string;
    artist: string;
    image: string;
    song: string;
    lyrics: string;
    downloaded: boolean;
    id: number;
  }

  export let song: currentInfo;

  let altimage = "";

  let progress: string = "blah";
  //console.log(song);

  async function setdownloadedInfo() {
    const db = await openDB("MySongs", 1);

    const response = await db.get("songs", song.id);

    db.close();
    return response;
  }

  const MyDownload = async () => {
    const storage = getStorage($app);
    const myaudioBlob = await getBlob(ref(storage, song.audio));
    const myimageBlob = await getBlob(ref(storage, song.image));
    //progress = "cached";
    return { audioBlob: myaudioBlob, imageBlob: myimageBlob };
  };

  function blobToBase64(blob: Blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  async function removeIndexedDB() {
    const db = await openDB("MySongs", 1);
    await db.delete("songs", song.id);
    progress = "downlaod";
    song.downloaded = false;
    db.close();
  }

  async function storetoIndexedDB(blob: { audioBlob: Blob; imageBlob: Blob }) {
    const db = await openDB("MySongs", 1);

    const audioBase64 = await blobToBase64(blob.audioBlob);
    const imageBase64 = await blobToBase64(blob.imageBlob);

    //console.log(imageBase64, audioBase64);
    await db.add("songs", {
      id: song.id,
      song: song.song,
      artist: song.artist,
      lyrics: song.lyrics,
      audio: audioBase64,
      image: imageBase64,
      downloaded: true,
    });
    db.close();

    progress = "cached";
    song.downloaded = true;
  }

  async function indexedDB() {
    const idb = await openDB("MySongs", 1);

    const inDatabase = await idb.get("songs", song.id);

    if (inDatabase != undefined) {
      progress = "cached";
      song.downloaded = true;
      altimage = inDatabase.image;
    }
    idb.close();
  }

  $: $downloadStores,
    (async () => {
      const db = await openDB("MySongs", 1);

      const response = await db.get("songs", song.id);
      if (response == undefined) {
        song.downloaded = false;
      }

      db.close();
    })();

  onMount(() => {
    indexedDB();
    //console.log(song.song, progress, song.downloaded);
  });
</script>

<div class="MusicCard">
  <div class="clickable">
    <button
      on:click={async () => {
        if (song.downloaded) {
          $currentPlaying = await setdownloadedInfo();
        } else {
          $currentPlaying = song;
        }
      }}
      style="height: 100%; width: 100%;"
    />
  </div>
  <div class="infoCard">
    <div>
      <img
        id="myimg"
        style="width: 84px;
  height: 84px;  filter: drop-shadow(0px 6px 20px rgba(0, 0, 0, 0.15));
  border-radius: 25px;"
        src={song.image}
        alt={altimage}
        srcset=""
      />
    </div>

    <div>
      <p class="songName">{song.song}</p>
      <p class="artistName">{song.artist}</p>
    </div>

    <div>
      <button
        on:click={async () => {
          //console.log("download ", song);

          if (!song.downloaded) {
            progress = "inProgress";

            const my_audio = await MyDownload();
            storetoIndexedDB(my_audio);

            //console.log(my_audio);
          } else if (song.downloaded) {
            removeIndexedDB();
          } else {
            console.log("error");
          }
        }}
      >
        {#if song.downloaded}
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="17"
              cy="17"
              r="16"
              fill="white"
              stroke="white"
              stroke-width="2"
            />
            <path d="M9 17.5L14 22.5L25 12" stroke="black" stroke-width="2" />
          </svg>
        {:else if progress == "inProgress"}
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="17" cy="17" r="16" stroke="white" stroke-width="2" />
            <path
              class="arrowDisp"
              d="M17 9V24M17 24L23.5 19M17 24L10 19"
              stroke="white"
              stroke-width="2"
            />
            <path
              class="arrowHide"
              d="M17 9V24M17 24L23.5 19M17 24L10 19"
              stroke="white"
              stroke-width="2"
            />
          </svg>
        {:else}
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="17" cy="17" r="16" stroke="white" stroke-width="2" />
            <path
              d="M17 9V24M17 24L23.5 19M17 24L10 19"
              stroke="white"
              stroke-width="2"
            />
          </svg>
        {/if}
      </button>
    </div>
  </div>
</div>

<style>
  .MusicCard {
    margin-bottom: 10px;
    position: relative;
  }
  .MusicCard .clickable {
    height: 100px;
    position: absolute;
    width: 80%;
    z-index: 1;
  }
  .MusicCard .infoCard {
    display: grid;
    background-color: var(--mainColor2);
    border-radius: 25px;
    min-height: 100px;
    height: 100px;
    grid-template-columns: 1fr 1.7fr 0.7fr;
  }

  .songName {
    font-weight: 700;
    font-size: 18px;
  }

  .artistName {
    font-weight: 500;
    font-size: 16px;
  }

  .MusicCard .infoCard div:nth-child(1) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .MusicCard .infoCard div:nth-child(2) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }

  .MusicCard .infoCard div:nth-child(3) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @keyframes arrowLoopD {
    from {
      transform: translateY(0%);
    }
    to {
      transform: translateY(100%);
    }
  }

  .arrowDisp {
    animation: arrowLoopD 2s cubic-bezier(0.24, 0.98, 0.34, 0.96) infinite;
  }

  @keyframes arrowLoopH {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0%);
    }
  }
  .arrowHide {
    animation: arrowLoopH 2s ease infinite;
  }
</style>
