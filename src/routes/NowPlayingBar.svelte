<script lang="ts">
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
  import { currentPlaying, songs } from "./stores";

  let changingButton = play_song;
  let audioFile = document.createElement("audio");

  console.log($currentPlaying, $songs);

  const audio = {
    currentTime: 0,
    totalDuration: 0,
    seeking: false,
    seektime: 0,
  };

  const playPause = () => {
    if (audioFile.paused == false) {
      changingButton = play_song;
      audioFile.pause();
    } else if (audioFile.paused == true) {
      changingButton = pause_song;
      audioFile.play();
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

  let nowPlayingSong = "none";
  let runOnceInitially = false;
  $: $currentPlaying,
    (() => {
      const nextToPlaySong = $currentPlaying.song;

      if (runOnceInitially) {
        if (nowPlayingSong != "none" && nowPlayingSong != nextToPlaySong) {
          if (audioFile.paused == false) {
            changingButton = play_song;
            audioFile.pause();
          }
          audioFile.src = $currentPlaying.audio;
          audioFile.onloadedmetadata = () => {
            audio.totalDuration = audioFile.duration;
          };
          nowPlayingSong = $currentPlaying.song;
          if (audioFile.paused == true) {
            changingButton = pause_song;
            audioFile.play();
          }
        }
      } else {
        runOnceInitially = true;
        nowPlayingSong = "something";
      }
    })();
  // @ts-ignore
  const changeSong = (currentIndex, totalSongs, toDo) => {
    if (0 < currentIndex < totalSongs + 1) {
      if (toDo == "increment") {
        currentIndex = currentIndex + 1;
      } else if (toDo == "decrement") {
        currentIndex = currentIndex - 1;
      }
    }
    if (currentIndex <= 0) {
      if (toDo == "decrement") {
        currentIndex = totalSongs;
      }
    }
    if (currentIndex >= totalSongs + 1) {
      if (toDo == "increment") {
        currentIndex = 1;
      }
    }

    $songs.songs.forEach((songs) => {
      if (songs.id == currentIndex) {
        $currentPlaying = songs;
      }
    });
  };

  var start = Date.now();
  function draw() {
    requestAnimationFrame(draw);
    var elapsed = Date.now() - start;
    //console.log(elapsed / 1000);
    if (!audio.seeking) {
      audio.currentTime = audioFile.currentTime;

      if (audioFile.ended) {
        changeSong($currentPlaying.id, $songs.totalSongs, "increment");
      }
    }
  }
  draw();

  onMount(() => {
    audioFile = new Audio();
    document.getElementById("minimizeArea")?.addEventListener("click", () => {
      document.getElementById("musicOverlay")?.classList.toggle("fullScreen");
      document.getElementById("musicOverlay")?.classList.toggle("nowPlaying");
    });
    document.getElementById("lyrics")?.addEventListener("click", () => {
      document.getElementById("musicOverlay")?.classList.toggle("lyricsResize");
    });
  });
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

  <img src={$currentPlaying.image} id="albumImage" alt="" srcset="" />

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
    <button
      id="backControl"
      class="moreControls"
      on:click={() => {
        changeSong($currentPlaying.id, $songs.totalSongs, "decrement");
      }}><img src={backwards_btn} alt="" srcset="" /></button
    >
    <button
      id="pausePlay"
      on:click={() => {
        playPause();
      }}
    >
      <img src={changingButton} alt="" srcset="" />
    </button>
    <button
      id="forwardControl"
      class="moreControls"
      on:click={() => {
        changeSong($currentPlaying.id, $songs.totalSongs, "increment");
      }}><img src={forwards_btn} alt="" srcset="" /></button
    >
    <button id="repeatControl" class="moreControls"
      ><img src={repeat_btn} alt="" srcset="" /></button
    >
  </div>
</div>
