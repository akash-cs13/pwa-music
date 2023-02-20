<script lang="ts">
  import download_button from "$lib/svg/download_button.svg";
  import album_art from "$lib/album/album.png";
  import { currentPlaying } from "./stores";

  interface currentInfo {
    audio: string;
    artist: string;
    image: string;
    song: string;
    lyrics: string;
    id: number;
  }

  export let song: currentInfo;
</script>

<div class="MusicCard">
  <div class="clickable">
    <button
      on:click={() => {
        $currentPlaying = song;
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
          console.log("download ", song.audio);
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
