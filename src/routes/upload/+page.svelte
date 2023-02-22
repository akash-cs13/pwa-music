<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { songs, uploadSong } from "../stores";

  $uploadSong = {
    audio: "",
    artist: "",
    image: "",
    song: "",
    lyrics: { type: "none", data: "" },
    id: $songs.totalSongs + 1,
  };

  let fileName: string;
  let files: any;
  let jsmediatags: any = window.jsmediatags;

  onMount(() => {
    fileName = "Internal Storage";
    jsmediatags = window.jsmediatags;
  });

  $: if (files) {
    for (const file of files) {
      if (file.type == "audio/mpeg") {
        fileName = file.name;

        $uploadSong.audio = file;
      } else {
        console.log("bad file type: ", file.type);
      }
    }
  }
</script>

<svelte:head>
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.min.js"
  ></script>
</svelte:head>

<div class="navigation">
  <a href="/" style="justify-self: left; padding: 0px 30px"
    ><svg
      width="19"
      height="19"
      viewBox="0 0 19 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.795023 18.4414C-0.265008 17.3676 -0.265008 15.6238 0.795023 14.55L14.3634 0.805351C15.4235 -0.268449 17.1449 -0.268449 18.205 0.805351C19.265 1.87915 19.265 3.623 18.205 4.6968L6.55311 16.5L18.1965 28.3032C19.2565 29.377 19.2565 31.1209 18.1965 32.1947C17.1365 33.2684 15.415 33.2684 14.3549 32.1947L0.786542 18.45L0.795023 18.4414Z"
        fill="white"
      />
    </svg>
  </a>
  <p class="title">Add Song</p>
  <div />
</div>

<div class="addSongClass2">
  <div class="addSongClass">
    <label class="ytlinkLable" for="ytlink">Youtube Link</label>
    <input type="text" id="ytlink" name="ytlink" class="ytlink" /><br /><br />
    <div class="lname">
      <label for="lname">
        <div class="lnameclass">
          <p>{fileName}</p>
          <svg
            width="37"
            height="37"
            viewBox="0 0 37 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.625 34.6875H32.375C34.926 34.6875 37 32.6135 37 30.0625V11.5625C37 9.01152 34.926 6.9375 32.375 6.9375H21.5713C20.3428 6.9375 19.1648 6.45332 18.2977 5.58613L16.3826 3.66387C15.5154 2.79668 14.3375 2.3125 13.109 2.3125H4.625C2.07402 2.3125 0 4.38652 0 6.9375V30.0625C0 32.6135 2.07402 34.6875 4.625 34.6875Z"
              fill="white"
            />
          </svg>
        </div>
      </label>
      <input
        type="file"
        id="lname"
        name="lname"
        bind:files
        accept=".mp3"
        style="  opacity: 0;
      width: 0.1px;
      height: 0.1px;
      position: absolute;"
      /><br /><br />
    </div>
    <button
      class="nextButton"
      on:click={() => {
        jsmediatags.read($uploadSong.audio, {
          onSuccess: function (tag) {
            //console.log(tag);
            try {
              //console.log(typeof tag.tags.title, tag.tags.title == undefined);
              if (tag.tags.title != undefined) {
                $uploadSong.song = tag.tags.title;
              } else {
                $uploadSong.song = fileName;
              }

              if (tag.tags.artist != undefined) {
                $uploadSong.artist = tag.tags.artist;
              }

              if (tag.tags.lyrics != undefined) {
                $uploadSong.lyrics = { type: "lrc", data: tag.tags.lyrics };
              }

              if (tag.tags.picture != undefined) {
                const { data, format } = tag.tags.picture;
                let base64String = "";
                for (let i = 0; i < data.length; i++) {
                  base64String += String.fromCharCode(data[i]);
                }
                const img = `data:${data.format};base64,${window.btoa(
                  base64String
                )}`;

                $uploadSong.image = img;
              } else {
                $uploadSong.image = "";
              }
            } catch (error) {
              console.log(error);
            }
          },
          onError: function (error) {
            console.log(error);
          },
        });
        goto("/addsong");
      }}
      ><div class="nextButtonClass">
        <p>Next</p>
        <svg
          width="19"
          height="33"
          viewBox="0 0 19 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.205 14.5586C19.265 15.6324 19.265 17.3762 18.205 18.45L4.63658 32.1946C3.57655 33.2684 1.85505 33.2684 0.795023 32.1946C-0.265008 31.1208 -0.265008 29.377 0.795023 28.3032L12.4469 16.5L0.803504 4.6968C-0.256528 3.623 -0.256528 1.87915 0.803504 0.805349C1.86353 -0.26845 3.58503 -0.26845 4.64506 0.805349L18.2135 14.55L18.205 14.5586Z"
            fill="white"
          />
        </svg>
      </div></button
    >
  </div>
</div>
