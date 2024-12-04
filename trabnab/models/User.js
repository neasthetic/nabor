// models/User.js
class User {
    constructor(id, name, age, playlists = []) {
      this.id = id;
      this.name = name;
      this.age = age;
      this.playlists = playlists; // Array de IDs de playlists
    }
  }
  
  module.exports = User;
  