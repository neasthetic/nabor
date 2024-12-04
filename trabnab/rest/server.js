// rest/server.js
const express = require('express');
const bodyParser = require('body-parser');

const userService = require('../services/UserService');
const songService = require('../services/SongService');
const playlistService = require('../services/PlaylistService');

const app = express();

app.use(bodyParser.json());

// Rotas para Usuários

// Listar todos os usuários
app.get('/users', (req, res) => {
  res.json(userService.listUsers());
});

// Criar um novo usuário
app.post('/users', (req, res) => {
  const user = userService.createUser(req.body);
  res.status(201).json(user);
});

// Obter um usuário por ID
app.get('/users/:id', (req, res) => {
  const user = userService.getUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('Usuário não encontrado');
  }
});

// Atualizar um usuário
app.put('/users/:id', (req, res) => {
  const user = userService.updateUser(req.params.id, req.body);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('Usuário não encontrado');
  }
});

// Deletar um usuário
app.delete('/users/:id', (req, res) => {
  userService.deleteUser(req.params.id);
  res.status(204).send();
});

// Listar todas as playlists de um determinado usuário
app.get('/users/:id/playlists', (req, res) => {
  const user = userService.getUserById(req.params.id);
  if (user) {
    const playlists = playlistService.listPlaylistsByIds(user.playlists);
    res.json(playlists);
  } else {
    res.status(404).send('Usuário não encontrado');
  }
});

// Associar uma playlist a um usuário
app.post('/users/:userId/playlists/:playlistId', (req, res) => {
  const playlistExists = playlistService.getPlaylistById(req.params.playlistId);
  if (!playlistExists) {
    return res.status(404).send('Playlist não encontrada');
  }
  const user = userService.addPlaylistToUser(req.params.userId, req.params.playlistId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('Usuário não encontrado');
  }
});

// Rotas para Músicas

// Listar todas as músicas
app.get('/songs', (req, res) => {
  res.json(songService.listSongs());
});

// Criar uma nova música
app.post('/songs', (req, res) => {
  const song = songService.createSong(req.body);
  res.status(201).json(song);
});

// Obter uma música por ID
app.get('/songs/:id', (req, res) => {
  const song = songService.getSongById(req.params.id);
  if (song) {
    res.json(song);
  } else {
    res.status(404).send('Música não encontrada');
  }
});

// Atualizar uma música
app.put('/songs/:id', (req, res) => {
  const song = songService.updateSong(req.params.id, req.body);
  if (song) {
    res.json(song);
  } else {
    res.status(404).send('Música não encontrada');
  }
});

// Deletar uma música
app.delete('/songs/:id', (req, res) => {
  songService.deleteSong(req.params.id);
  res.status(204).send();
});

// Listar todas as playlists que contêm uma determinada música
app.get('/songs/:id/playlists', (req, res) => {
  const playlists = playlistService.listPlaylistsBySong(req.params.id);
  res.json(playlists);
});

// Rotas para Playlists

// Listar todas as playlists
app.get('/playlists', (req, res) => {
  res.json(playlistService.listPlaylists());
});

// Criar uma nova playlist
app.post('/playlists', (req, res) => {
  const playlist = playlistService.createPlaylist(req.body);
  res.status(201).json(playlist);
});

// Obter uma playlist por ID
app.get('/playlists/:id', (req, res) => {
  const playlist = playlistService.getPlaylistById(req.params.id);
  if (playlist) {
    res.json(playlist);
  } else {
    res.status(404).send('Playlist não encontrada');
  }
});

// Atualizar uma playlist
app.put('/playlists/:id', (req, res) => {
  const playlist = playlistService.updatePlaylist(req.params.id, req.body);
  if (playlist) {
    res.json(playlist);
  } else {
    res.status(404).send('Playlist não encontrada');
  }
});

// Deletar uma playlist
app.delete('/playlists/:id', (req, res) => {
  playlistService.deletePlaylist(req.params.id);
  res.status(204).send();
});

// Adicionar uma música a uma playlist
app.post('/playlists/:playlistId/songs/:songId', (req, res) => {
  const songExists = songService.getSongById(req.params.songId);
  if (!songExists) {
    return res.status(404).send('Música não encontrada');
  }
  const playlist = playlistService.addSongToPlaylist(req.params.playlistId, req.params.songId);
  if (playlist) {
    res.json(playlist);
  } else {
    res.status(404).send('Playlist não encontrada');
  }
});

// Remover uma música de uma playlist
app.delete('/playlists/:playlistId/songs/:songId', (req, res) => {
  const playlist = playlistService.removeSongFromPlaylist(req.params.playlistId, req.params.songId);
  if (playlist) {
    res.json(playlist);
  } else {
    res.status(404).send('Playlist não encontrada');
  }
});

// Listar todas as músicas de uma determinada playlist
app.get('/playlists/:id/songs', (req, res) => {
  const playlist = playlistService.getPlaylistById(req.params.id);
  if (playlist) {
    const songs = songService.listSongsByIds(playlist.songs);
    res.json(songs);
  } else {
    res.status(404).send('Playlist não encontrada');
  }
});

// Iniciar o servidor REST
app.listen(3000, () => {
  console.log('REST API rodando na porta 3000');
});
