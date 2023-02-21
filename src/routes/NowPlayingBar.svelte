<script lang="ts">
  import "./styles.css";
  import play_song from "$lib/svg/play-song.svg";
  import pause_song from "$lib/svg/pause-song.svg";
  import minimize_button from "$lib/svg/minimize-button.svg";
  import backwards_btn from "$lib/svg/backwards-button.svg";
  import forwards_btn from "$lib/svg/fordward-button.svg";
  import shuffle_btn from "$lib/svg/Shuffle.svg";
  import repeat_btn from "$lib/svg/Repeat.svg";
  import { onMount } from "svelte";
  import { currentPlaying, songs } from "./stores";
  import { collectionGroup } from "firebase/firestore";

  let changingButton = play_song;
  let audioFile = document.createElement("audio");
  let previousSongID1;
  let previousSongID2;
  //console.log($currentPlaying, $songs);

  const audio = {
    currentTime: 0,
    totalDuration: 0,
    seeking: false,
    seektime: 0,
    repeat: false,
    shuffle: false,
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

      if (previousSongID1 != $currentPlaying.id) {
        previousSongID2 = previousSongID1;
        previousSongID1 = $currentPlaying.id;
        //console.log(previousSongID2, previousSongID1);
      }

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

  const randomSong = () => {
    let myarray: number[] = [];
    for (let i = 1; i <= $songs.totalSongs; i++) {
      //console.log(previousSongID1, previousSongID2);
      if (i != previousSongID1 && i != previousSongID2) {
        myarray.push(i);
      }
    }
    var random = Math.floor(Math.random() * myarray.length);
    //console.log(myarray, myarray[random]);
    return myarray[random];
  };

  var start = Date.now();
  function draw() {
    requestAnimationFrame(draw);
    var elapsed = Date.now() - start;
    //console.log(elapsed / 1000);
    if (!audio.seeking) {
      audio.currentTime = audioFile.currentTime;

      if (audioFile.ended) {
        if (audio.shuffle) {
          var random = randomSong();
          $songs.songs.forEach((songs) => {
            if (songs.id == random) {
              $currentPlaying = songs;
            }
          });
        } else {
          changeSong($currentPlaying.id, $songs.totalSongs, "increment");
        }
      }
    }
  }
  draw();
  let varX = 0;
  onMount(() => {
    audioFile = new Audio();
    previousSongID1 = 0;
    document.getElementById("minimizeArea")?.addEventListener("click", () => {
      document.getElementById("musicOverlay")?.classList.toggle("fullScreen");
      document.getElementById("musicOverlay")?.classList.toggle("nowPlaying");
    });
    document.getElementById("lyrics")?.addEventListener("click", () => {
      document.getElementById("musicOverlay")?.classList.toggle("lyricsResize");
    });

    let sliderSize;
    const min_max = (min: number, element: number, max: number) => {
      if (element <= min) {
        return min;
      } else if (element >= max) {
        return max;
      } else {
        return element;
      }
    };

    document.getElementById("touch")?.addEventListener("touchstart", (e) => {
      document.getElementById("myRange_move")?.classList.remove("ontouch");
      document.getElementById("myRange_nomove")?.classList.add("ontouch");
      sliderSize = document
        .getElementById("myRange_move")
        ?.getBoundingClientRect();
      varX = min_max(0, (e.touches[0].clientX - 25) / sliderSize?.width, 1);
    });

    document.getElementById("touch")?.addEventListener("touchmove", (e) => {
      sliderSize = document
        .getElementById("myRange_move")
        ?.getBoundingClientRect();
      varX = min_max(0, (e.touches[0].clientX - 25) / sliderSize?.width, 1);
    });

    document.getElementById("touch")?.addEventListener("touchend", (e) => {
      document.getElementById("myRange_move")?.classList.add("ontouch");
      document.getElementById("myRange_nomove")?.classList.remove("ontouch");
      audioFile.currentTime = varX * audio.totalDuration;
      //console.log(varX * audio.totalDuration);
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
    <div class="lyricsLines">
      {#if $currentPlaying.lyrics.type == "tlrc"}
        {#each $currentPlaying.lyrics.data.lines as line}
          {#if line.start >= audio.currentTime}
            <p class="lyricsLine ">{line.text}</p>
          {:else}
            <p class="lyricsLine dim">{line.text}</p>
          {/if}
        {/each}
      {:else if $currentPlaying.lyrics.type == "lrc"}
        {#each $currentPlaying.lyrics.data.lines as line}
          <p class="lyricsLine dim">{line}</p>
        {/each}
      {:else}
        <p class="lyricsLine">Looks like no lyrics are added...</p>
      {/if}
    </div>
  </div>

  <div>
    <input
      type="range"
      step="0.01"
      min="0.0"
      max={1}
      bind:value={varX}
      class="slider move ontouch"
      id="myRange_move"
    />
    <div class="touch" id="touch" />
    <input
      type="range"
      step="0.01"
      min="0.0"
      max={audio.totalDuration}
      class="slider nomove"
      id="myRange_nomove"
      bind:value={audio.currentTime}
    />

    <div class="slidertime">
      <p style="padding-left: 3px;">{fmtMSS(audio.currentTime)}</p>
      <p style="padding-right: 3px;">{fmtMSS(audio.totalDuration)}</p>
    </div>
  </div>

  <div>
    <button
      id="shuffleControl"
      class="moreControls"
      on:click={() => {
        audio.shuffle = !audio.shuffle;
      }}
    >
      {#if audio.shuffle}
        <img
          src={shuffle_btn}
          style="filter: invert(47%) sepia(57%) saturate(6782%) hue-rotate(218deg) brightness(90%) contrast(89%);"
          alt=""
          srcset=""
        />
      {:else}
        <img src={shuffle_btn} alt="" srcset="" />
      {/if}
    </button>
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
    <button
      id="repeatControl"
      class="moreControls"
      on:click={() => {
        audio.repeat = !audio.repeat;

        audioFile.loop = audio.repeat;
      }}
    >
      {#if audio.repeat}
        <img
          src={repeat_btn}
          style="filter: invert(47%) sepia(57%) saturate(6782%) hue-rotate(218deg) brightness(90%) contrast(89%);"
          alt=""
          srcset=""
        />
      {:else}
        <img src={repeat_btn} alt="" srcset="" />
      {/if}
    </button>
  </div>
</div>
