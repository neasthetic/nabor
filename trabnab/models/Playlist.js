// models/Playlist.js
class Playlist {
    constructor(id, name, songs = []) {
      this.id = id;
      this.name = name;
      this.songs = songs; // Array de IDs de músicas
    }
  }
  
  module.exports = Playlist;
  