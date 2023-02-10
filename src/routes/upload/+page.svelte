<script lang="ts">
  import back_arrow from "$lib/svg/back-arrow.svg";
  import folder_img from "$lib/svg/folder.svg";
  import next_button from "$lib/svg/next-button.svg";
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

<div class="addSongClass2">
  <form action="/addsong" class="addSongClass">
    <label class="ytlinkLable" for="ytlink">Youtube Link</label>
    <input type="text" id="ytlink" name="ytlink" class="ytlink" /><br /><br />
    <div class="lname">
      <label for="lname">
        <div class="lnameclass">
          <p>Internal Storage</p>
          <img src={folder_img} alt="" srcset="" />
        </div>
      </label>
      <input
        type="file"
        id="lname"
        name="lname"
        style="  opacity: 0;
      width: 0.1px;
      height: 0.1px;
      position: absolute;"
      /><br /><br />
    </div>
    <button type="submit" class="nextButton"
      ><div class="nextButtonClass">
        <p>Next</p>
        <img src={next_button} alt="" srcset="" />
      </div></button
    >
  </form>
</div>
