<script lang="ts">
  import "../styles.css";
  import album_art from "$lib/album/album.png";
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
  <a href="/" style="justify-self: left; padding: 0px 30px">
    <svg
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

      <svg
        width="20"
        height="20"
        style="
      justify-self: center;
      align-self: center;"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.1831 0.733162L12.2904 2.6257L17.3741 7.70896L19.2668 5.81642C20.2444 4.83887 20.2444 3.25524 19.2668 2.27769L17.726 0.733162C16.7484 -0.244387 15.1647 -0.244387 14.187 0.733162H14.1831ZM11.4067 3.5094L2.29128 12.628C1.88459 13.0346 1.58739 13.5391 1.42315 14.0904L0.038834 18.7944C-0.0589286 19.1267 0.031013 19.4826 0.273464 19.725C0.515915 19.9674 0.871771 20.0574 1.20025 19.9635L5.90459 18.5793C6.45597 18.4151 6.96043 18.1179 7.36712 17.7112L16.4903 8.59266L11.4067 3.5094Z"
          fill="white"
        />
      </svg>
    </label>
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
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 0V7M7 14V7M7 7H12.5M7 7H1.5H0H7ZM7 7H14"
              stroke="white"
              stroke-width="2"
            />
          </svg>

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
    <svg
      width="46"
      height="33"
      viewBox="0 0 46 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.35 32.6875C4.63594 32.6875 0 28.0264 0 22.2812C0 17.743 2.88937 13.884 6.91437 12.4604C6.90719 12.2652 6.9 12.0701 6.9 11.875C6.9 5.48672 12.0462 0.3125 18.4 0.3125C22.6622 0.3125 26.3781 2.63945 28.3691 6.1082C29.4616 5.37109 30.7841 4.9375 32.2 4.9375C36.0094 4.9375 39.1 8.04492 39.1 11.875C39.1 12.7566 38.9347 13.5949 38.64 14.3754C42.8375 15.2281 46 18.9643 46 23.4375C46 28.5467 41.8816 32.6875 36.8 32.6875H10.35ZM16.0281 17.0059C15.3525 17.6852 15.3525 18.7836 16.0281 19.4557C16.7037 20.1277 17.7962 20.135 18.4647 19.4557L21.2678 16.6373V26.3281C21.2678 27.2893 22.0369 28.0625 22.9928 28.0625C23.9487 28.0625 24.7178 27.2893 24.7178 26.3281V16.6373L27.5209 19.4557C28.1966 20.135 29.2891 20.135 29.9575 19.4557C30.6259 18.7764 30.6331 17.6779 29.9575 17.0059L24.2075 11.2246C23.5319 10.5453 22.4394 10.5453 21.7709 11.2246L16.0209 17.0059H16.0281Z"
        fill="white"
      />
    </svg></button
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

  textarea {
    resize: none;
  }
</style>
