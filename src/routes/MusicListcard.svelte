<script lang="ts">
  import download_button from "$lib/svg/download_button.svg";
  import album_art from "$lib/album/album.png";
  import { app, currentPlaying } from "./stores";
  import { getStorage, ref, getDownloadURL, getBlob } from "firebase/storage";
  const storage = getStorage($app);

  interface currentInfo {
    audio: string;
    artist: string;
    image: string;
    song: string;
    lyrics: string;
  }
  export let song: currentInfo;

  async function audioURL() {
    //$currentPlaying.audio
    let url = await Promise.resolve(
      getDownloadURL(ref(storage, song.audio))
        .then((url) => {
          url;
          console.log(url);

          document.getElementById("audio")?.setAttribute("src", url);
        })
        .catch((error) => {
          console.log(error.code);
        })
    );

    return url;
  }

  getDownloadURL(ref(storage, "images/stars.jpg"))
    .then((url) => {
      // `url` is the download URL for 'images/stars.jpg'

      // This can be downloaded directly:
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = (event) => {
        const blob = xhr.response;
      };
      xhr.open("GET", url);
      xhr.send();

      // Or inserted into an <img> element
      const img = document.getElementById("myimg");
      img?.setAttribute("src", url);
    })
    .catch((error) => {
      // Handle any errors
    });
</script>

<div class="MusicCard">
  <div class="clickable">
    <button
      on:click={() => {
        $currentPlaying = song;
        audioURL();
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
        src={album_art}
        alt={album_art}
        srcset=""
      />
    </div>

    <div>
      <p class="songName">{song.song}</p>
      <p class="artistName">{song.artist}</p>
    </div>

    <div>
      <button
        on:click={() => {
          console.log("downlaod ", song.audio);
          getBlob(ref(storage, song.audio));
        }}
      >
        <img
          src={download_button}
          alt=""
          srcset=""
          style="width: 34px; height: 34px;"
        />
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
</style>
