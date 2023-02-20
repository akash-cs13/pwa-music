<script lang="ts">
  import "../styles.css";
  import back_arrow from "$lib/svg/back-arrow.svg";
  import album_art from "$lib/album/album.png";
  import edit_pencil from "$lib/svg/edit-pencil.svg";
  import add_icon from "$lib/svg/add-symbol.svg";
  import upload_icon from "$lib/svg/upload-symbol.svg";
  import { onMount } from "svelte";
  import { uploadSong } from "../stores";

  let albumImage = album_art;

  onMount(() => {
    if ($uploadSong.image != "") {
      albumImage = $uploadSong.image;
    }
  });
</script>

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

<div class="addSongClass3">
  <div class="image-area">
    <div />
    <img src={albumImage} alt="" srcset="" class="cover" />
    <button
      ><img
        src={edit_pencil}
        alt=""
        srcset=""
        style="width: 20px; height: 20px;"
      /></button
    >
  </div>
  <div class="text-area">
    <div class="full">
      <label for="song-field">Name</label>
      <input
        type="text"
        name="song-field"
        class="input-field"
        id=""
        value={$uploadSong.song}
      />
    </div>
    <div class="full">
      <label for="artist-field">Artist</label>
      <input
        type="text"
        name="artist-field"
        class="input-field"
        id=""
        value={$uploadSong.artist}
      />
    </div>
    <div class="half">
      <label for="lyrics-field">Lyrics</label>
      <textarea
        name="lyrics-field"
        class="input-field lyrics-field"
        id=""
        cols="30"
        rows="3">{$uploadSong.lyrics}</textarea
      >

      <button
        ><img
          src={add_icon}
          alt=""
          srcset=""
          style="width: 14px; height: 14px;"
        /></button
      >
    </div>
  </div>
  <button class="upload"
    ><p>Upload</p>
    <img
      src={upload_icon}
      alt=""
      srcset=""
      style="width: 46px; height: 32px;"
    /></button
  >
</div>

<style>
  .addSongClass3 {
    width: 100%;
    height: 100%;
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 1fr 1fr 1fr;
    align-items: center;
    justify-content: center;
  }

  .input-field {
    /* width: 222px; */
    height: 36px;
    color: var(--TextColour2);
    font-size: 16px;
    background: var(--mainColour2);
    border: 3px solid var(--accentColor);
    border-radius: 14px;
    padding: 0px 10px;
  }

  /* .lyrics-field {
    width: 171px;
  } */

  .cover {
    width: 148px;
    height: 148px;

    filter: drop-shadow(0px 6px 20px rgba(0, 0, 0, 0.15));
    border-radius: 25px;
    align-self: center;
    justify-self: center;
  }

  .upload {
    width: 285px;
    height: 70px;
    background: var(--accentColor);
    border: 3px solid var(--accentColor);
    border-radius: 14px;
    justify-self: center;
    color: var(--TextColour2);
    font-family: "Poppins", sans-serif;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0% 10%;
  }

  .addSongClass3 .image-area {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 20% 60% 20%;
  }

  .addSongClass3 .image-area button:nth-child(3) {
    width: 41px;
    height: 36px;
    background: var(--accentColor);
    border: 3px solid var(--accentColor);
    border-radius: 14px;
    align-self: end;
    margin-left: 5px;

    justify-content: center;
    align-items: center;
  }

  .addSongClass3 .text-area {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 1fr 1fr 3fr;
    gap: 5px;
    width: 100%;
    height: 100%;
  }

  .addSongClass3 .text-area div.full {
    display: grid;
    width: 100%;
    grid-auto-flow: column;
    grid-template-columns: 20% calc(75% - 20px);
    justify-content: center;
    align-items: center;
  }

  .addSongClass3 .text-area div.half {
    display: grid;
    width: 100%;
    grid-auto-flow: column;
    grid-template-columns: 20% calc(62% - 20px) 13%;
    justify-content: center;
    align-items: center;
  }

  .addSongClass3 .text-area div.half button {
    width: 41px;
    height: 36px;
    background: var(--accentColor);
    border: 3px solid var(--accentColor);
    border-radius: 14px;

    justify-self: end;
    justify-content: center;
    align-items: center;
  }
  .addSongClass3 .text-area div.half label {
    align-self: start;
    padding-top: 5%;
  }
  .addSongClass3 .text-area div.half textarea {
    height: calc(100% - 10px);
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .addSongClass3 .text-area div.half button {
    align-self: end;
  }
</style>
