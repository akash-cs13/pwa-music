import { initializeApp } from "firebase/app";
import { writable } from "svelte/store";
import firebaseConfig from "./FirebaseConfig";

interface currentInfo{
    audio: string,
    artist: string,
    image: string,
    song: string,
    downloaded: boolean,
    lyrics: any,
    id: number,
}

interface uploadInfo{
  audio: any,
  artist: string,
  image: any,
  song: string,
  lyrics: any,
  downloaded: boolean,
  id: number,
}

const temp: currentInfo = {
    audio: "none",
    artist: "none",
    image: "none",
    song: "none",
    lyrics: "none",
    downloaded: false,
    id: 0
};
interface songInfo{
        totalSongs: number;
        songs: {
          audio: string;
          artist: string;
          image: string;
          song: string;
          lyrics: string;
          id: number;
          downloaded: boolean;
          
        }[];
      }
      
let songUplaod:any = {};
let uploadInfos:uploadInfo;
let songslist:songInfo = {
    totalSongs: 0,
    songs: []
  };

  let downloadUpdate: boolean = false;
  


export let songs = writable(songslist);

export const app = writable(initializeApp(firebaseConfig));

export const currentPlaying = writable(temp);

export let songToUpload = writable(songUplaod);

export let downloadStores = writable(downloadUpdate)

export let uploadSong = writable(uploadInfos)
