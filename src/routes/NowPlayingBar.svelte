<script>
  import "./styles.css";
  import play_song from "$lib/svg/play-song.svg";
  import pause_song from "$lib/svg/pause-song.svg";
  import minimize_button from "$lib/svg/minimize-button.svg";
  import album_art from "$lib/album/album.jpg";
  import backwards_btn from "$lib/svg/backwards-button.svg";
  import forwards_btn from "$lib/svg/fordward-button.svg";
  import shuffle_btn from "$lib/svg/Shuffle.svg";
  import repeat_btn from "$lib/svg/Repeat.svg";
  import { onMount } from "svelte";

  let changingButton = play_song;
  let seeking;

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
  let buffers;

  onMount(() => {
    const nowPlayingBar = document.getElementById("myID");
    const miniButton = document.getElementById("currentpadding");
    const toggle_bar = document.getElementById("minimise");

    toggle_bar?.addEventListener("click", () => {
      toggle_bar?.classList.add("fullsize");
      nowPlayingBar?.classList.add("AfterClick");
      nowPlayingBar?.classList.remove("NowPlaying");
      document.getElementById("currentAlbumImage")?.classList.add("fullsize");
      document.getElementById("currentSong")?.classList.add("fullsize");
      document.getElementById("currentArtist")?.classList.add("fullsize");
      document.getElementById("currentLyrics")?.classList.add("fullsize");
      document.getElementById("currentProgress")?.classList.add("fullsize");
      document.getElementById("currentpadding")?.classList.add("fullsize");
      document.getElementById("currentControls")?.classList.add("fullsize");
      document.getElementById("shuffleControl")?.classList.add("fullsize");
      document.getElementById("backControl")?.classList.add("fullsize");
      document.getElementById("forwardControl")?.classList.add("fullsize");
      document.getElementById("repeatControl")?.classList.add("fullsize");
      miniButton?.classList.add("toggle");
    });

    miniButton?.addEventListener("click", () => {
      miniButton?.classList.remove("toggle");
      nowPlayingBar?.classList.remove("AfterClick");
      document
        .getElementById("currentAlbumImage")
        ?.classList.remove("fullsize");
      document.getElementById("currentSong")?.classList.remove("fullsize");
      document.getElementById("currentArtist")?.classList.remove("fullsize");
      document.getElementById("currentLyrics")?.classList.remove("fullsize");
      document.getElementById("currentProgress")?.classList.remove("fullsize");
      document.getElementById("currentpadding")?.classList.remove("fullsize");
      document.getElementById("currentControls")?.classList.remove("fullsize");
      document.getElementById("shuffleControl")?.classList.remove("fullsize");
      document.getElementById("backControl")?.classList.remove("fullsize");
      document.getElementById("forwardControl")?.classList.remove("fullsize");
      document.getElementById("repeatControl")?.classList.remove("fullsize");
      nowPlayingBar?.classList.add("NowPlaying");
    });

    const lyrics = document.getElementById("lyricsLabel");
    lyrics?.addEventListener("click", () => {
      nowPlayingBar?.classList.toggle("lyricsResize");
      document
        .getElementById("currentAlbumImage")
        ?.classList.toggle("lyricsResize");
      document.getElementById("currentSong")?.classList.toggle("lyricsResize");
      document
        .getElementById("currentArtist")
        ?.classList.toggle("lyricsResize");
      document
        .getElementById("currentpadding")
        ?.classList.toggle("lyricsResize");
      document
        .getElementById("currentControls")
        ?.classList.toggle("lyricsResize");
      document
        .getElementById("currentProgress")
        ?.classList.toggle("lyricsResize");
      document.getElementById("currentInfo")?.classList.toggle("lyricsResize");
      document
        .getElementById("currentLyrics")
        ?.classList.toggle("lyricsResize");
    });
  });
</script>

<div class="effect" />
<div class="NowPlaying" id="myID">
  <div id="currentpadding">
    <button id="minimize_button" class="minimize_button">
      <img
        src={minimize_button}
        alt=""
        srcset=""
        style="height: 19px; width: 19px;"
      />
    </button>
  </div>
  <img src={album_art} id="currentAlbumImage" alt="" srcset="" />

  <div id="currentInfo">
    <p id="currentSong">EL Diablo</p>
    <p id="currentArtist">Art</p>
  </div>

  <div id="currentLyrics">
    <p id="lyricsLabel" class="Label">Lyrics</p>
  </div>

  <div id="currentProgress">
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

  <div id="currentControls">
    <button id="shuffleControl" class="moreControls"
      ><img src={shuffle_btn} alt="" srcset="" /></button
    >
    <button id="backControl" class="moreControls"
      ><img src={backwards_btn} alt="" srcset="" /></button
    >
    <button
      id="pausePlay"
      on:click={() => {
        console.log(audio.currentTime, audio.totalDuration, buffers);
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
<div id="minimise" class="minimise" />
<audio
  src="https://vkbkt.org/fldr_spiritual/Shuklaam.mp4"
  bind:paused={audio.play}
  bind:currentTime={audio.currentTime}
  bind:duration={audio.totalDuration}
  bind:buffered={buffers}
  bind:seeking
  on:ended={() => {
    console.log("audio has ended");
  }}
/>
