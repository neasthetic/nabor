const User = require('../models/User');
let users = []; 

users.push(new User('1', 'Alice', 25, ['1', '2']));
users.push(new User('2', 'Bob', 30, ['3']));
users.push(new User('3', 'Charlie', 28));

module.exports = {
  createUser(data) {
    const user = new User(data.id, data.name, data.age, data.playlists || []);
    users.push(user);
    return user;
  },
  getUserById(id) {
    return users.find(user => user.id === id);
  },
  updateUser(id, newData) {
    let user = this.getUserById(id);
    if (user) {
      user.name = newData.name || user.name;
      user.age = newData.age || user.age;
      if (newData.playlists) {
        user.playlists = newData.playlists;
      }
    }
    return user;
  },
  deleteUser(id) {
    users = users.filter(user => user.id !== id);
  },
  listUsers() {
    return users;
  },
  addPlaylistToUser(userId, playlistId) {
    let user = this.getUserById(userId);
    if (user && !user.playlists.includes(playlistId)) {
      user.playlists.push(playlistId);
    }
    return user;
  },
  removePlaylistFromUser(userId, playlistId) {
    let user = this.getUserById(userId);
    if (user) {
      user.playlists = user.playlists.filter(id => id !== playlistId);
    }
    return user;
  },
};
