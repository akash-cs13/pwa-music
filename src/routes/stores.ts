import { initializeApp } from "firebase/app";
import { writable } from "svelte/store";
interface currentInfo{
    audio: string,
    artist: string,
    image: string,
    song: string,
    lyrics: string,
    id: number,
}
const temp: currentInfo = {
    audio: "none",
    artist: "none",
    image: "none",
    song: "none",
    lyrics: "none",
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
        }[];
      }

let songslist:songInfo = {
    totalSongs: 0,
    songs: []
};

const firebaseConfig = {
    apiKey: "AIzaSyDLOcgayXHtMcmDfWwS-2YZ0EqDDUWzSy8",
    authDomain: "pwa-music-fced1.firebaseapp.com",
    projectId: "pwa-music-fced1",
    storageBucket: "pwa-music-fced1.appspot.com",
    messagingSenderId: "1008965709525",
    appId: "1:1008965709525:web:417ad9b2e2c70122237c5c",
    measurementId: "G-1R0SFL17XC",
  };

export let songs = writable(songslist);

export const app = writable(initializeApp(firebaseConfig));

export const currentPlaying = writable(temp);
