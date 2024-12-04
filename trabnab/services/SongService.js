const Song = require('../models/Song');

const NUMBER_OF_SONGS = 500; 

let songs = [];

function generateSong(index) {
  return new Song(
    `${index}`,
    `Song ${index}`,
    `Artist ${index}`
  );
}


for (let i = 1; i <= NUMBER_OF_SONGS; i++) {
  songs.push(generateSong(i));
}

module.exports = {
  createSong(data) {
    const song = new Song(data.id, data.name, data.artist);
    songs.push(song);
    return song;
  },
  getSongById(id) {
    return songs.find(song => song.id === id);
  },
  updateSong(id, newData) {
    let song = this.getSongById(id);
    if (song) {
      song.name = newData.name || song.name;
      song.artist = newData.artist || song.artist;
    }
    return song;
  },
  deleteSong(id) {
    songs = songs.filter(song => song.id !== id);
  },
  listSongs() {
    return songs;
  },
  listSongsByIds(ids) {
    return songs.filter(song => ids.includes(song.id));
  },
};
