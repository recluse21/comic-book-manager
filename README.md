# Comic Book Manager
This is a Node.js comic book manager CRUD application. Users can register and login to the app where they can add comics to their collection. Comics can be added manually or through a comic search feature.

## Features
* Local authentication using email and password
* Add, delete, and edit comics in your collection
* Search for Marvel comic books by title and issue number
* Add comics with info manually
* View and edit details of individual comics in your collection

## Prerequisites
* [Node.js](https://nodejs.org/en/)
* [Firebase](https://firebase.google.com/) account and SDK
* [Marvel API](https://developer.marvel.com) key

## Setup
Once you have created an account on Firebase you will need to create a project for use with the comic book manager app. You will need to get your [Firebase SDK json file](https://firebase.google.com/docs/admin/setup#add_firebase_to_your_app), put it in your root folder, and name it __serviceAccountKey.json__. Create a file in the root folder called __configData.json__. This file will hold the configuration info for Firebase as well as the Marvel API keys. See format below.
```json
{
    "apiKey": "(FIREBASE API_KEY)",
    "authDomain": "(PROJECT_ID).firebaseapp.com",
    "databaseURL": "https://(DATABASE_NAME).firebaseio.com",
    "storageBucket": "(BUCKET).appspot.com",
    "serviceAccountKey": "(PATH TO YOUR FIREBASE ADMIN SDK).json",
    "marvelApiKey": "(MARVEL PUBLIC API KEY)",
    "privateApi": "(MARVEL PRIVATE API KEY)"
}
```
## Install
```
$ git clone git://github.com/recluse21/comic-book-manager.git
$ npm install
```
then

```
$ node app.js
```
Then visit [http://localhost:3000/](http://localhost:3000/)
