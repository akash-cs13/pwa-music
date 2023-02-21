<script lang="ts">
  import { goto } from "$app/navigation";
  import back_arrow from "$lib/svg/back-arrow.svg";
  import folder_img from "$lib/svg/folder.svg";
  import next_button from "$lib/svg/next-button.svg";
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
  let jsmediatags: any;

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
    ><img
      src={back_arrow}
      style="height: 19px; width:19px"
      alt=""
      srcset=""
    /></a
  >
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
          <img src={folder_img} alt="" srcset="" />
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
        <img src={next_button} alt="" srcset="" />
      </div></button
    >
  </div>
</div>
