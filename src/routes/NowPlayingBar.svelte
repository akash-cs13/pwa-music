<script>
  import "./styles.css";
  import play_song from "$lib/svg/play-song.svg";
  import pause_song from "$lib/svg/pause-song.svg";
  import minimize_button from "$lib/svg/minimize-button.svg";
  import album_art from "$lib/album/album.png";
  import backwards_btn from "$lib/svg/backwards-button.svg";
  import forwards_btn from "$lib/svg/fordward-button.svg";
  import shuffle_btn from "$lib/svg/Shuffle.svg";
  import repeat_btn from "$lib/svg/Repeat.svg";
  import { onMount } from "svelte";
  import { app, currentPlaying } from "./stores";
  import { getStorage, ref, getDownloadURL } from "firebase/storage";

  let changingButton = play_song;
  const storage = getStorage($app);

  const audio = {
    play: true,
    currentTime: 0,
    totalDuration: 0,
    seeking: true,
  };

  const playPause = () => {
    if (audio.play == false) {
      audio.play = true;
      changingButton = play_song;
    } else if (audio.play == true) {
      audio.play = false;
      changingButton = pause_song;
    } else {
      console.log("Error while playing");
    }
  };

  // @ts-ignore
  function fmtMSS(duration) {
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;
    let ret = "";
    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }

  onMount(async () => {
    document.getElementById("minimizeArea")?.addEventListener("click", () => {
      document.getElementById("musicOverlay")?.classList.toggle("fullScreen");
      document.getElementById("musicOverlay")?.classList.toggle("nowPlaying");
    });
    document.getElementById("lyrics")?.addEventListener("click", () => {
      document.getElementById("musicOverlay")?.classList.toggle("lyricsResize");
    });
  });

  export const prerender = false;
  export const ssr = false;
</script>

<div class="effect" />
<div class="nowPlaying" id="musicOverlay">
  <div id="minimizeArea">
    <button>
      <img
        src={minimize_button}
        alt=""
        srcset=""
        style="height: 19px; width: 19px;"
      />
    </button>
  </div>

  <img src={album_art} id="albumImage" alt="" srcset="" />

  <div>
    <p id="song">{$currentPlaying.song}</p>
    <p id="artist">{$currentPlaying.artist}</p>
  </div>

  <div id="lyrics">
    <p class="lyricsLabel">Lyrics</p>
  </div>

  <div>
    <input
      type="range"
      step="0.01"
      min="0.0"
      max={audio.totalDuration}
      class="slider"
      id="myRange"
      bind:value={audio.currentTime}
    />
    <div class="slidertime">
      <p style="padding-left: 3px;">{fmtMSS(audio.currentTime)}</p>
      <p style="padding-right: 3px;">{fmtMSS(audio.totalDuration)}</p>
    </div>
  </div>

  <div>
    <button id="shuffleControl" class="moreControls"
      ><img src={shuffle_btn} alt="" srcset="" /></button
    >
    <button id="backControl" class="moreControls"
      ><img src={backwards_btn} alt="" srcset="" /></button
    >
    <button
      id="pausePlay"
      on:click={() => {
        playPause();
      }}
    >
      <img src={changingButton} alt="" srcset="" />
    </button>
    <button id="forwardControl" class="moreControls"
      ><img src={forwards_btn} alt="" srcset="" /></button
    >
    <button id="repeatControl" class="moreControls"
      ><img src={repeat_btn} alt="" srcset="" /></button
    >
  </div>
</div>
<!--<div id="minimise" class="minimise" />-->
<audio
  id="audio"
  bind:paused={audio.play}
  bind:currentTime={audio.currentTime}
  bind:duration={audio.totalDuration}
  bind:seeking={audio.seeking}
  on:ended={() => {
    console.log("audio has ended");
    playPause();
  }}
/>
