// soap/server.js
const soap = require('soap');
const express = require('express');
const fs = require('fs');
const path = require('path');

const userService = require('../services/UserService');
const songService = require('../services/SongService');
const playlistService = require('../services/PlaylistService');

const app = express();

// Carregar os arquivos WSDL
const userWsdl = fs.readFileSync(path.join(__dirname, 'user.wsdl'), 'utf8');
const songWsdl = fs.readFileSync(path.join(__dirname, 'song.wsdl'), 'utf8');
const playlistWsdl = fs.readFileSync(path.join(__dirname, 'playlist.wsdl'), 'utf8');

// Definir os serviços SOAP

const userSoapService = {
  UserService: {
    UserServicePort: {
      ListUsers(args, callback) {
        console.log('ListUsers chamado com args:', args);
        const users = userService.listUsers();
        callback(null, { userList: { users } });
      },
      GetUserById(args, callback) {
        console.log('GetUserById chamado com args:', args);
        const user = userService.getUserById(args.id);
        if (user) {
          callback(null, { user });
        } else {
          callback({
            Fault: {
              faultcode: 'Client',
              faultstring: 'Usuário não encontrado',
            },
          });
        }
      },
      CreateUser(args, callback) {
        console.log('CreateUser chamado com args:', args);
        const user = userService.createUser(args.user);
        callback(null, { user });
      },
      UpdateUser(args, callback) {
        console.log('UpdateUser chamado com args:', args);
        const user = userService.updateUser(args.user.id, args.user);
        if (user) {
          callback(null, { user });
        } else {
          callback({
            Fault: {
              faultcode: 'Client',
              faultstring: 'Usuário não encontrado',
            },
          });
        }
      },
      DeleteUser(args, callback) {
        console.log('DeleteUser chamado com args:', args);
        const success = userService.deleteUser(args.id);
        if (success) {
          callback(null, {});
        } else {
          callback({
            Fault: {
              faultcode: 'Client',
              faultstring: 'Usuário não encontrado',
            },
          });
        }
      },
      ListUserPlaylists(args, callback) {
        console.log('ListUserPlaylists chamado com args:', args);
        const user = userService.getUserById(args.id);
        if (user) {
          const playlists = playlistService.listPlaylistsByIds(user.playlists);
          callback(null, { playlistList: { playlists } });
        } else {
          callback({
            Fault: {
              faultcode: 'Client',
              faultstring: 'Usuário não encontrado',
            },
          });
        }
      },
      AddPlaylistToUser(args, callback) {
        console.log('AddPlaylistToUser chamado com args:', args);
        const playlistExists = playlistService.getPlaylistById(args.playlistId);
        if (!playlistExists) {
          return callback({
            Fault: {
              faultcode: 'Client',
              faultstring: 'Playlist não encontrada',
            },
          });
        }
        const user = userService.addPlaylistToUser(args.userId, args.playlistId);
        if (user) {
          callback(null, { user });
        } else {
          callback({
            Fault: {
              faultcode: 'Client',
              faultstring: 'Usuário não encontrado',
            },
          });
        }
      },
    },
  },
};

const songSoapService = {
  SongService: {
    SongServicePort: {
      ListSongs(args, callback) {
        console.log('ListSongs chamado com args:', args);
        const songs = songService.listSongs();
        callback(null, { songList: { songs } });
      },
      GetSongById(args, callback) {
        console.log('GetSongById chamado com args:', args);
        const song = songService.getSongById(args.id);
        if (song) {
          callback(null, { song });
        } else {
          callback({
            Fault: {
              faultcode: 'Client',
              faultstring: 'Música não encontrada',
            },
          });
        }
      },
      CreateSong(args, callback) {
        console.log('CreateSong chamado com args:', args);
        const song = songService.createSong(args.song);
        callback(null, { song });
      },
      UpdateSong(args, callback) {
        console.log('UpdateSong chamado com args:', args);
        const song = songService.updateSong(args.song.id, args.song);
        if (song) {
          callback(null, { song });
        } else {
          callback({
            Fault: {
              faultcode: 'Client',
              faultstring: 'Música não encontrada',
            },
          });
        }
      },
      DeleteSong(args, callback) {
        console.log('DeleteSong chamado com args:', args);
        const success = songService.deleteSong(args.id);
        if (success) {
          callback(null, {});
        } else {
          callback({
            Fault: {
              faultcode: 'Client',
              faultstring: 'Música não encontrada',
            },
          });
        }
      },
      ListPlaylistsBySong(args, callback) {
        console.log('ListPlaylistsBySong chamado com args:', args);
        const playlists = playlistService.listPlaylistsBySong(args.id);
        callback(null, { playlistList: { playlists } });
      },
    },
  },
};

const playlistSoapService = {
  PlaylistService: {
    PlaylistServicePort: {
      ListPlaylists(args, callback) {
        console.log('ListPlaylists chamado com args:', args);
        const playlists = playlistService.listPlaylists();
        callback(null, { playlistList: { playlists } });
      },
      GetPlaylistById(args, callback) {
        console.log('GetPlaylistById chamado com args:', args);
        const playlist = playlistService.getPlaylistById(args.id);
        if (playlist) {
          callback(null, { playlist });
        } else {
          callback({
            Fault: {
              faultcode: 'Client',
              faultstring: 'Playlist não encontrada',
            },
          });
        }
      },
      CreatePlaylist(args, callback) {
        console.log('CreatePlaylist chamado com args:', args);
        const playlist = playlistService.createPlaylist(args.playlist);
        callback(null, { playlist });
      },
      UpdatePlaylist(args, callback) {
        console.log('UpdatePlaylist chamado com args:', args);
        const playlist = playlistService.updatePlaylist(args.playlist.id, args.playlist);
        if (playlist) {
          callback(null, { playlist });
        } else {
          callback({
            Fault: {
              faultcode: 'Client',
              faultstring: 'Playlist não encontrada',
            },
          });
        }
      },
      DeletePlaylist(args, callback) {
        console.log('DeletePlaylist chamado com args:', args);
        const success = playlistService.deletePlaylist(args.id);
        if (success) {
          callback(null, {});
        } else {
          callback({
            Fault: {
              faultcode: 'Client',
              faultstring: 'Playlist não encontrada',
            },
          });
        }
      },
      AddSongToPlaylist(args, callback) {
        console.log('AddSongToPlaylist chamado com args:', args);
        const songExists = songService.getSongById(args.songId);
        if (!songExists) {
          return callback({
            Fault: {
              faultcode: 'Client',
              faultstring: 'Música não encontrada',
            },
          });
        }
        const playlist = playlistService.addSongToPlaylist(args.playlistId, args.songId);
        if (playlist) {
          callback(null, { playlist });
        } else {
          callback({
            Fault: {
              faultcode: 'Client',
              faultstring: 'Playlist não encontrada',
            },
          });
        }
      },
      RemoveSongFromPlaylist(args, callback) {
        console.log('RemoveSongFromPlaylist chamado com args:', args);
        const playlist = playlistService.removeSongFromPlaylist(args.playlistId, args.songId);
        if (playlist) {
          callback(null, { playlist });
        } else {
          callback({
            Fault: {
              faultcode: 'Client',
              faultstring: 'Playlist não encontrada',
            },
          });
        }
      },
      ListSongsInPlaylist(args, callback) {
        console.log('ListSongsInPlaylist chamado com args:', args);
        const playlist = playlistService.getPlaylistById(args.id);
        if (playlist) {
          const songs = songService.listSongsByIds(playlist.songs);
          callback(null, { songList: { songs } });
        } else {
          callback({
            Fault: {
              faultcode: 'Client',
              faultstring: 'Playlist não encontrada',
            },
          });
        }
      },
    },
  },
};

// Iniciar o servidor e configurar os serviços SOAP

app.listen(8000, function() {
  soap.listen(app, '/userwsdl', userSoapService, userWsdl);
  soap.listen(app, '/songwsdl', songSoapService, songWsdl);
  soap.listen(app, '/playlistwsdl', playlistSoapService, playlistWsdl);
  console.log('SOAP API rodando na porta 8000');
});
