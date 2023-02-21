<script lang="ts">
  import "../styles.css";
  import back_arrow from "$lib/svg/back-arrow.svg";
  import album_art from "$lib/album/album.png";
  import edit_pencil from "$lib/svg/edit-pencil.svg";
  import add_icon from "$lib/svg/add-symbol.svg";
  import upload_icon from "$lib/svg/upload-symbol.svg";
  import { onMount } from "svelte";
  import { app, uploadSong } from "../stores";
  import { getStorage, ref, uploadBytes } from "firebase/storage";
  import { getFirestore, doc, setDoc } from "firebase/firestore";

  const storage = getStorage($app);
  const db = getFirestore($app);

  let albumImage: any = album_art;
  let GetImage: any;
  let GetLyrics: any;

  const UploadToCloud = async () => {
    let folder_name = String($uploadSong.song.trim().split(" ").join("_"));
    console.log(folder_name, String(folder_name + "/" + folder_name + ".mp3"));

    let uploadingImage: any = $uploadSong.image;
    if (typeof uploadingImage == "string") {
      const blob = fetch(uploadingImage).then((res) => res.blob());
      const blobImg = new Blob([blob], { type: "image/png" });
      uploadingImage = blobImg;
    }
    console.log(uploadingImage);

    uploadBytes(
      ref(storage, String(folder_name + "/" + folder_name + ".mp3")),
      $uploadSong.audio
    ).then((snapshot) => {
      console.log("Uploaded mp3");
    });

    uploadBytes(
      ref(storage, String(folder_name + "/" + folder_name + ".png")),
      uploadingImage
    ).then((snapshot) => {
      console.log("Uploaded png");
    });

    // if no error from cloud write to db

    const docData = {
      artist: $uploadSong.artist,
      audio: String(folder_name + "/" + folder_name + ".mp3"),
      image: String(folder_name + "/" + folder_name + ".png"),
      lyrics: JSON.stringify($uploadSong.lyrics),
      song: $uploadSong.song,
    };

    await setDoc(doc(db, "Music", String($uploadSong.id)), docData);

    alert("Upload complete \nGo to home screen to play your uploaded song");
  };

  function convertTime(string: string) {
    var regex = new RegExp("\\d+:\\d*.\\d+");
    var l = regex.exec(string)?.[0];
    var minutes = parseInt(String(l?.split(":")[0]));
    var seconds = parseFloat(String(l?.split(":")[1]));
    if (minutes > 0) {
      const sc = minutes * 60 + seconds;
      return parseFloat(sc.toFixed(2));
    }
    return seconds;
    //return Number(l?.split(":")[0]) * 60 + Number(l?.split(":")[1]);
  }
  const LyricsParser = (lyrics: { type: string; data: any }) => {
    var regex = new RegExp("\\d+:\\d*.\\d+");
    if (lyrics.data == "") {
      return { type: "none", data: "" };
    } else {
      const lines = lyrics.data.split("\r\n");

      const returner = (myarray: any) => {
        const data: { length: number; lines: any } = { length: 0, lines: [] };
        var regex = new RegExp("\\d+:\\d*.\\d+");
        for (let line of myarray) {
          if (line.includes("[length:")) {
            data.length = convertTime(line);
          } else if (regex.exec(line)?.length > 0) {
            const splitLine = line.split("]");

            data.lines.push({
              start: convertTime(splitLine[0]),
              text: splitLine[1],
            });
          } else {
            console.log("line omitted: ", line);
          }
        }

        return { type: "tlrc", data: data };
      };

      if (lines.length > 1) {
        return returner(lines);
      } else if ((lines.length = 1 && regex.exec(lines[0])?.length > 0)) {
        return returner(lyrics.data.split("\n"));
      } else {
        const data = [];
        const notimed_lines = lyrics.data.split("\n");
        for (let line of notimed_lines) {
          data.push(line);
        }
        return { type: "lrc", data: data };
      }
    }
  };

  $: if (GetImage) {
    for (const file of GetImage) {
      const reader = new FileReader();
      reader.addEventListener("load", function () {
        albumImage = reader.result;
      });
      reader.readAsDataURL(file);

      $uploadSong.image = file;
    }
  }

  $: if (GetLyrics) {
    for (const file of GetLyrics) {
      const reader = new FileReader();
      reader.addEventListener("load", function () {
        $uploadSong.lyrics = { type: "lrc", data: reader.result };
      });
      reader.readAsText(file);
    }
  }

  $: $uploadSong,
    (() => {
      const embedImage = $uploadSong.image;
      if (embedImage != "") {
        albumImage = embedImage;
      }
    })();
  onMount(() => {
    //console.log(typeof $uploadSong.image, $uploadSong.image);
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

    <label>
      <input
        type="file"
        accept=".png, .jpg"
        bind:files={GetImage}
        style="display: none;"
      />
      <img
        src={edit_pencil}
        alt=""
        srcset=""
        style="width: 20px; height: 20px; 
        justify-self: center;
        align-self: center;"
      /></label
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
        bind:value={$uploadSong.song}
      />
    </div>
    <div class="full">
      <label for="artist-field">Artist</label>
      <input
        type="text"
        name="artist-field"
        class="input-field"
        id=""
        bind:value={$uploadSong.artist}
      />
    </div>
    <div class="full">
      <label for="lyrics-field" class="half"
        >Lyrics
        <label style="display: flex;">
          <img
            src={add_icon}
            alt=""
            srcset=""
            style="width: 14px; height: 14px;"
          />
          <input
            type="file"
            accept=".lrc"
            bind:files={GetLyrics}
            style="display: none;"
          />
        </label>
      </label>
      <textarea
        name="lyrics-field"
        class="input-field lyrics-field"
        id=""
        cols="30"
        rows="3"
        bind:value={$uploadSong.lyrics.data}
      />
    </div>
  </div>
  <button
    class="upload"
    on:click={() => {
      // $uploadSong.lyrics = JSON.stringify(LyricsParser($uploadSong.lyrics));
      // console.log($uploadSong.lyrics);
      $uploadSong.lyrics = LyricsParser($uploadSong.lyrics);
      UploadToCloud();
    }}
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

  .addSongClass3 .image-area label:nth-child(3) {
    width: 41px;
    height: 36px;
    background: var(--accentColor);
    border: 3px solid var(--accentColor);
    border-radius: 14px;
    align-self: end;
    display: flex;
    justify-content: center;
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

  .addSongClass3 .text-area div.full label label {
    width: 41px;
    height: 36px;
    background: var(--accentColor);
    border: 3px solid var(--accentColor);
    border-radius: 14px;

    justify-self: end;
    justify-content: center;
    align-items: center;
  }

  .addSongClass3 .text-area div.full textarea {
    height: calc(100% - 10px);
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .half {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
  }
</style>
