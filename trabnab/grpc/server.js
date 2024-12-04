// grpc/server.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const userService = require('../services/UserService');
const songService = require('../services/SongService');
const playlistService = require('../services/PlaylistService');

// Carregar o arquivo proto
const packageDefinition = protoLoader.loadSync('protos/music_service.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = grpc.loadPackageDefinition(packageDefinition).music;

// Implementações para UserService
function listUsers(call, callback) {
  const users = userService.listUsers();
  callback(null, { users });
}

function getUserById(call, callback) {
  const user = userService.getUserById(call.request.id);
  if (user) {
    callback(null, user);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Usuário não encontrado',
    });
  }
}

function createUser(call, callback) {
  const user = userService.createUser(call.request);
  callback(null, user);
}

function updateUser(call, callback) {
  const user = userService.updateUser(call.request.id, call.request);
  if (user) {
    callback(null, user);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Usuário não encontrado',
    });
  }
}

function deleteUser(call, callback) {
  userService.deleteUser(call.request.id);
  callback(null, {});
}

// Implementações para SongService
function listSongs(call, callback) {
  const songs = songService.listSongs();
  callback(null, { songs });
}

function getSongById(call, callback) {
  const song = songService.getSongById(call.request.id);
  if (song) {
    callback(null, song);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Música não encontrada',
    });
  }
}

function createSong(call, callback) {
  const song = songService.createSong(call.request);
  callback(null, song);
}

function updateSong(call, callback) {
  const song = songService.updateSong(call.request.id, call.request);
  if (song) {
    callback(null, song);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Música não encontrada',
    });
  }
}

function deleteSong(call, callback) {
  songService.deleteSong(call.request.id);
  callback(null, {});
}

// Implementações para PlaylistService
function listPlaylists(call, callback) {
  const playlists = playlistService.listPlaylists();
  callback(null, { playlists });
}

function getPlaylistById(call, callback) {
  const playlist = playlistService.getPlaylistById(call.request.id);
  if (playlist) {
    callback(null, playlist);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Playlist não encontrada',
    });
  }
}

function createPlaylist(call, callback) {
  const playlist = playlistService.createPlaylist(call.request);
  callback(null, playlist);
}

function updatePlaylist(call, callback) {
  const playlist = playlistService.updatePlaylist(call.request.id, call.request);
  if (playlist) {
    callback(null, playlist);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Playlist não encontrada',
    });
  }
}

function deletePlaylist(call, callback) {
  playlistService.deletePlaylist(call.request.id);
  callback(null, {});
}

function addSongToPlaylist(call, callback) {
  const playlist = playlistService.addSongToPlaylist(call.request.playlistId, call.request.songId);
  if (playlist) {
    callback(null, playlist);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Playlist ou Música não encontrada',
    });
  }
}

function removeSongFromPlaylist(call, callback) {
  const playlist = playlistService.removeSongFromPlaylist(call.request.playlistId, call.request.songId);
  if (playlist) {
    callback(null, playlist);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Playlist ou Música não encontrada',
    });
  }
}

function listSongsInPlaylist(call, callback) {
  const playlist = playlistService.getPlaylistById(call.request.id);
  if (playlist) {
    const songs = songService.listSongsByIds(playlist.songs);
    callback(null, { songs });
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Playlist não encontrada',
    });
  }
}

// Iniciar o servidor gRPC
function main() {
  const server = new grpc.Server();

  server.addService(proto.UserService.service, {
    ListUsers: listUsers,
    GetUserById: getUserById,
    CreateUser: createUser,
    UpdateUser: updateUser,
    DeleteUser: deleteUser,
  });

  server.addService(proto.SongService.service, {
    ListSongs: listSongs,
    GetSongById: getSongById,
    CreateSong: createSong,
    UpdateSong: updateSong,
    DeleteSong: deleteSong,
  });

  server.addService(proto.PlaylistService.service, {
    ListPlaylists: listPlaylists,
    GetPlaylistById: getPlaylistById,
    CreatePlaylist: createPlaylist,
    UpdatePlaylist: updatePlaylist,
    DeletePlaylist: deletePlaylist,
    AddSongToPlaylist: addSongToPlaylist,
    RemoveSongFromPlaylist: removeSongFromPlaylist,
    ListSongsInPlaylist: listSongsInPlaylist,
  });

  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    // server.start();
    console.log('gRPC API rodando na porta 50051');
  });
}

main(); 