<script lang="ts">
  export let song: string;
  export let artist: string;
  export let image: any;
</script>

<div class="MusicCard">
  <img
    style="width: 84px;
  height: 84px;  filter: drop-shadow(0px 6px 20px rgba(0, 0, 0, 0.15));
  border-radius: 25px;"
    src={image}
    alt=""
    srcset=""
  />
  <p class="songName">{song}</p>
  <p class="artistName">{artist}</p>
</div>

<style>
  .MusicCard {
    background-color: var(--mainColor2);
    margin-bottom: 10px;
    border-radius: 25px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    min-height: 100px;
    height: 100px;
    align-items: center;
    justify-items: center;
  }

  .songName {
    font-weight: 700;
    font-size: 24px;
  }

  .artistName {
    font-weight: 500;
    font-size: 16px;
  }
</style>
