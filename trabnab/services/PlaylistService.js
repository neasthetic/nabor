const Playlist = require('../models/Playlist');
let playlists = []; 

playlists.push(new Playlist('1', 'Clássicos do Rock', ['2']));
playlists.push(new Playlist('2', 'Favoritas de Alice', ['1', '3']));
playlists.push(new Playlist('3', 'Mix do Bob', []));

module.exports = {
  createPlaylist(data) {
    const playlist = new Playlist(data.id, data.name, data.songs || []);
    playlists.push(playlist);
    return playlist;
  },
  getPlaylistById(id) {
    return playlists.find(playlist => playlist.id === id);
  },
  updatePlaylist(id, newData) {
    let playlist = this.getPlaylistById(id);
    if (playlist) {
      playlist.name = newData.name || playlist.name;
      if (newData.songs) {
        playlist.songs = newData.songs;
      }
    }
    return playlist;
  },
  deletePlaylist(id) {
    playlists = playlists.filter(playlist => playlist.id !== id);
  },
  listPlaylists() {
    return playlists;
  },
  addSongToPlaylist(playlistId, songId) {
    let playlist = this.getPlaylistById(playlistId);
    if (playlist && !playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
    }
    return playlist;
  },
  removeSongFromPlaylist(playlistId, songId) {
    let playlist = this.getPlaylistById(playlistId);
    if (playlist) {
      playlist.songs = playlist.songs.filter(id => id !== songId);
    }
    return playlist;
  },
  listPlaylistsByIds(ids) {
    return playlists.filter(playlist => ids.includes(playlist.id));
  },
  listPlaylistsBySong(songId) {
    return playlists.filter(playlist => playlist.songs.includes(songId));
  },
};
