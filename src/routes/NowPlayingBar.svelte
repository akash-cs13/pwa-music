<script lang="ts">
  import "./styles.css";
  import { onMount } from "svelte";
  import { currentPlaying, songs } from "./stores";
  let audioFile = new Audio();
  let previousSongID1: number;
  let previousSongID2: number;
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
      audioFile.pause();
    } else if (audioFile.paused == true) {
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
            audioFile.pause();
          }
          audioFile.src = $currentPlaying.audio;
          audioFile.onloadedmetadata = () => {
            audio.totalDuration = audioFile.duration;
          };
          nowPlayingSong = $currentPlaying.song;
          if (audioFile.paused == true) {
            audioFile.play();
          }
        }
      } else {
        runOnceInitially = true;
        nowPlayingSong = "something";
      }

      //Media Session API
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: $currentPlaying.song,
          artist: $currentPlaying.artist,
          artwork: [
            {
              src: $currentPlaying.image,
            },
          ],
        });

        function updatePositionState() {
          if ("setPositionState" in navigator.mediaSession) {
            navigator.mediaSession.setPositionState({
              duration: audioFile.duration,
              playbackRate: audioFile.playbackRate,
              position: audioFile.currentTime,
            });
          }
        }

        navigator.mediaSession.setActionHandler("previoustrack", () => {
          changeSong($currentPlaying.id, $songs.totalSongs, "decrement");
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          changeSong($currentPlaying.id, $songs.totalSongs, "increment");
        });

        audioFile.addEventListener("ratechange", (event) => {
          updatePositionState();
        });
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
    //var elapsed = Date.now() - start;
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
      document.getElementById("effect")?.classList.toggle("hidden");
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
      varX = min_max(
        0,
        (e.touches[0].clientX - sliderSize?.left) / sliderSize?.width,
        1
      );
    });
    document.getElementById("touch")?.addEventListener("touchmove", (e) => {
      sliderSize = document
        .getElementById("myRange_move")
        ?.getBoundingClientRect();
      varX = min_max(
        0,
        (e.touches[0].clientX - sliderSize?.left) / sliderSize?.width,
        1
      );
    });
    document.getElementById("touch")?.addEventListener("touchend", (e) => {
      document.getElementById("myRange_move")?.classList.add("ontouch");
      document.getElementById("myRange_nomove")?.classList.remove("ontouch");
      audioFile.currentTime = varX * audio.totalDuration;
      //console.log(varX * audio.totalDuration);
    });
    let drag = false;
    document.getElementById("touch")?.addEventListener("mousedown", (e) => {
      document.getElementById("myRange_move")?.classList.remove("ontouch");
      document.getElementById("myRange_nomove")?.classList.add("ontouch");
      sliderSize = document
        .getElementById("myRange_move")
        ?.getBoundingClientRect();
      varX = min_max(0, (e.clientX - sliderSize?.left) / sliderSize?.width, 1);
      drag = true;
    });
    document.getElementById("touch")?.addEventListener("mousemove", (e) => {
      sliderSize = document
        .getElementById("myRange_move")
        ?.getBoundingClientRect();
      if (drag) {
        varX = min_max(
          0,
          (e.clientX - sliderSize?.left) / sliderSize?.width,
          1
        );
      }
    });
    document.getElementById("touch")?.addEventListener("mouseup", (e) => {
      document.getElementById("myRange_move")?.classList.add("ontouch");
      document.getElementById("myRange_nomove")?.classList.remove("ontouch");
      drag = false;
      audioFile.currentTime = varX * audio.totalDuration;
    });
  });
</script>

<div class="effect" id="effect" />
<div class="nowPlaying" id="musicOverlay">
  <div id="minimizeArea">
    <button>
      <svg
        width="19"
        height="19"
        viewBox="0 0 33 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.4414 18.205C17.3676 19.265 15.6238 19.265 14.55 18.205L0.805351 4.63658C-0.268449 3.57655 -0.268449 1.85505 0.805351 0.795023C1.87915 -0.265008 3.623 -0.265008 4.6968 0.795023L16.5 12.4469L28.3032 0.803504C29.377 -0.256528 31.1209 -0.256528 32.1947 0.803504C33.2684 1.86353 33.2684 3.58503 32.1947 4.64506L18.45 18.2135L18.4414 18.205Z"
          fill="white"
        />
      </svg>
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
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            class="colouredStroke"
            d="M16 18C14.423 18 12.9466 17.3826 11.8512 16.3346"
            stroke="#A8A8A8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            class="colouredStroke"
            d="M7.15475 8.05196C5.78876 6.76008 3.95637 6 2 6"
            stroke="#A8A8A8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            class="colouredSvg"
            d="M22.6432 19.0439C23.2699 18.6522 23.2699 17.7396 22.6432 17.3479L17.53 14.1521C16.864 13.7359 16 14.2147 16 15.0001V21.3916C16 22.1771 16.864 22.6559 17.53 22.2396L22.6432 19.0439Z"
            fill="#A8A8A8"
          />
          <path
            class="colouredStroke"
            d="M16 6V6C13.5778 6 11.3932 7.45643 10.4615 9.69231L8.92308 13.3846C7.75856 16.1795 5.02776 18 2 18V18"
            stroke="#A8A8A8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            class="colouredSvg"
            d="M21.6432 7.04388C22.2699 6.65222 22.2699 5.73956 21.6432 5.34789L16.53 2.15214C15.864 1.73586 15 2.2147 15 3.00013V9.39164C15 10.1771 15.864 10.6559 16.53 10.2396L21.6432 7.04388Z"
            fill="#A8A8A8"
          />
        </svg>
      {:else}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 18C14.423 18 12.9466 17.3826 11.8512 16.3346"
            stroke="#A8A8A8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M7.15475 8.05196C5.78876 6.76008 3.95637 6 2 6"
            stroke="#A8A8A8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22.6432 19.0439C23.2699 18.6522 23.2699 17.7396 22.6432 17.3479L17.53 14.1521C16.864 13.7359 16 14.2147 16 15.0001V21.3916C16 22.1771 16.864 22.6559 17.53 22.2396L22.6432 19.0439Z"
            fill="#A8A8A8"
          />
          <path
            d="M16 6V6C13.5778 6 11.3932 7.45643 10.4615 9.69231L8.92308 13.3846C7.75856 16.1795 5.02776 18 2 18V18"
            stroke="#A8A8A8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M21.6432 7.04388C22.2699 6.65222 22.2699 5.73956 21.6432 5.34789L16.53 2.15214C15.864 1.73586 15 2.2147 15 3.00013V9.39164C15 10.1771 15.864 10.6559 16.53 10.2396L21.6432 7.04388Z"
            fill="#A8A8A8"
          />
        </svg>
      {/if}
    </button>
    <button
      id="backControl"
      class="moreControls"
      on:click={() => {
        changeSong($currentPlaying.id, $songs.totalSongs, "decrement");
      }}
      ><svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="44"
          height="44"
          rx="22"
          fill="#969696"
          fill-opacity="0.15"
        />
        <path
          d="M28.0469 13.3478C28.5812 12.9776 29.3294 12.8932 29.965 13.1416C30.6006 13.39 31 13.9196 31 14.5007L31 29.498C31 30.0791 30.595 30.6087 29.965 30.8571C29.335 31.1055 28.5869 31.0258 28.0469 30.6509L17.2469 23.1523L16.6 22.7024V29.498C16.6 30.3275 15.7956 30.9977 14.8 30.9977C13.8044 30.9977 13 30.3275 13 29.498L13 14.5007C13 13.6712 13.8044 13.001 14.8 13.001C15.7956 13.001 16.6 13.6712 16.6 14.5007V21.2964L17.2469 20.8464L28.0469 13.3478Z"
          fill="#D7D7D7"
        />
      </svg>
    </button>
    <button
      id="pausePlay"
      on:click={() => {
        playPause();
      }}
    >
      {#if audioFile.paused}
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="28" cy="28" r="28" fill="white" />
          <path
            d="M37 26.268C38.3333 27.0378 38.3333 28.9623 37 29.7321L25 36.6603C23.6667 37.4301 22 36.4678 22 34.9282V21.0718C22 19.5322 23.6667 18.5699 25 19.3397L37 26.268Z"
            fill="black"
          />
        </svg>
      {:else}
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="28" cy="28" r="28" fill="white" />
          <rect x="19" y="16" width="7" height="24" rx="2" fill="black" />
          <rect x="29" y="16" width="7" height="24" rx="2" fill="black" />
        </svg>
      {/if}
    </button>
    <button
      id="forwardControl"
      class="moreControls"
      on:click={() => {
        changeSong($currentPlaying.id, $songs.totalSongs, "increment");
      }}
      ><svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="44"
          height="44"
          rx="22"
          fill="#969696"
          fill-opacity="0.15"
        />
        <path
          d="M15.9531 30.6522C15.4188 31.0224 14.6706 31.1068 14.035 30.8584C13.3994 30.61 13 30.0804 13 29.4993V14.502C13 13.9209 13.405 13.3913 14.035 13.1429C14.665 12.8945 15.4131 12.9742 15.9531 13.3491L26.7531 20.8477L27.4 21.2976V14.502C27.4 13.6725 28.2044 13.0023 29.2 13.0023C30.1956 13.0023 31 13.6725 31 14.502V29.4993C31 30.3288 30.1956 30.999 29.2 30.999C28.2044 30.999 27.4 30.3288 27.4 29.4993V22.7036L26.7531 23.1536L15.9531 30.6522Z"
          fill="#D7D7D7"
        />
      </svg>
    </button>
    <button
      id="repeatControl"
      class="moreControls"
      on:click={() => {
        audio.repeat = !audio.repeat;
        audioFile.loop = audio.repeat;
      }}
    >
      {#if audio.repeat}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            class="colouredSvg"
            d="M21.6432 6.04388C22.2699 5.65222 22.2699 4.73956 21.6432 4.34789L16.53 1.15214C15.864 0.735855 15 1.2147 15 2.00013V8.39164C15 9.17707 15.864 9.65592 16.53 9.23964L21.6432 6.04388Z"
            fill="#A8A8A8"
          />
          <path
            class="colouredSvg"
            d="M2.47008 19.0439C1.84341 18.6522 1.84341 17.7396 2.47008 17.3479L7.58328 14.1521C8.24933 13.7359 9.11328 14.2147 9.11328 15.0001V21.3916C9.11328 22.1771 8.24933 22.6559 7.58328 22.2396L2.47008 19.0439Z"
            fill="#A8A8A8"
          />
          <path
            class="colouredStroke"
            d="M4 11V11C4 7.68629 6.68629 5 10 5V5H15"
            stroke="#A8A8A8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            class="colouredStroke"
            d="M19 12V12C19 15.3137 16.3137 18 13 18V18H8"
            stroke="#A8A8A8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      {:else}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.6432 6.04388C22.2699 5.65222 22.2699 4.73956 21.6432 4.34789L16.53 1.15214C15.864 0.735855 15 1.2147 15 2.00013V8.39164C15 9.17707 15.864 9.65592 16.53 9.23964L21.6432 6.04388Z"
            fill="#A8A8A8"
          />
          <path
            d="M2.47008 19.0439C1.84341 18.6522 1.84341 17.7396 2.47008 17.3479L7.58328 14.1521C8.24933 13.7359 9.11328 14.2147 9.11328 15.0001V21.3916C9.11328 22.1771 8.24933 22.6559 7.58328 22.2396L2.47008 19.0439Z"
            fill="#A8A8A8"
          />
          <path
            d="M4 11V11C4 7.68629 6.68629 5 10 5V5H15"
            stroke="#A8A8A8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M19 12V12C19 15.3137 16.3137 18 13 18V18H8"
            stroke="#A8A8A8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      {/if}
    </button>
  </div>
</div>
