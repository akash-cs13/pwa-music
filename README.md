# SVELTEIFY - A PWA Music App 🎵
![Readme_Banner](https://user-images.githubusercontent.com/84382172/223688923-d94a605e-fe05-46d2-964d-3d1780509fad.png)

Check it out [here](https://mymusicapp-three.vercel.app/)


## About
A Personal Project to mess around with Sveltekit, created a Progressive Web Application with Firebase Storage and Firestore Database which is cross-platform compatible and has offline access.

## Installation
### Basics
```bash
# clone this repo and cd into directory
# install dependencies
npm i

#run development server
npm run dev

#build and deploy
npm run build
npm run deploy
```
### FireBase Setup
1. Create a new Firebase Project and paste the firebaseconfig in `src/routes/FirebaseConfig.ts`
2. Set both Firebase Storage and Firestore Database rules to allow read, write: `if true;`
3. Enable [CORS](https://firebase.google.com/docs/storage/web/download-files#cors_configuration) for to enable offline downloading.

## Bugs 🪲
1. You need to add the first audio file manually. 
> upload music file and album_image to a folder in Firevase Storage
> ![pacman_save](https://user-images.githubusercontent.com/84382172/223703595-6a8a0d2a-ac69-4a5c-8176-ce9f0fa0d5ec.png)
> 
> add the dummy data to Firestore Database 
> ![pacman_db](https://user-images.githubusercontent.com/84382172/223704565-90483491-b6a9-42aa-8b32-ecac006f212e.png)\
> You dont need to add lyrics, leave it blank or set it as `{}`

2. Extract does not work at first go back and try again.
3. If no album image is add during upload, the image uploaded to Storage is broken. (Quick Fix: Either upload a default image or Change image in Storage directly) 







