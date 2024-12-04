// graphql/schema.js
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql');
const userService = require('../services/UserService');
const songService = require('../services/SongService');
const playlistService = require('../services/PlaylistService');

// Definição do tipo Song
const SongType = new GraphQLObjectType({
  name: 'Song',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    artist: { type: GraphQLString },
  }),
});

// Definição do tipo Playlist
const PlaylistType = new GraphQLObjectType({
  name: 'Playlist',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    songs: {
      type: new GraphQLList(SongType),
      resolve(parent, args) {
        return songService.listSongsByIds(parent.songs);
      },
    },
  }),
});

// Definição do tipo User
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    playlists: {
      type: new GraphQLList(PlaylistType),
      resolve(parent, args) {
        return playlistService.listPlaylistsByIds(parent.playlists);
      },
    },
  }),
});

// Definição das consultas (Queries)
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Consultas para Usuários
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return userService.listUsers();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return userService.getUserById(args.id);
      },
    },
    // Consultas para Músicas
    songs: {
      type: new GraphQLList(SongType),
      resolve() {
        return songService.listSongs();
      },
    },
    song: {
      type: SongType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return songService.getSongById(args.id);
      },
    },
    // Consultas para Playlists
    playlists: {
      type: new GraphQLList(PlaylistType),
      resolve() {
        return playlistService.listPlaylists();
      },
    },
    playlist: {
      type: PlaylistType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return playlistService.getPlaylistById(args.id);
      },
    },
    // Listar playlists de um usuário específico
    playlistsByUser: {
      type: new GraphQLList(PlaylistType),
      args: { userId: { type: GraphQLString } },
      resolve(parent, args) {
        const user = userService.getUserById(args.userId);
        if (user) {
          return playlistService.listPlaylistsByIds(user.playlists);
        } else {
          return [];
        }
      },
    },
    // Listar músicas de uma playlist específica
    songsByPlaylist: {
      type: new GraphQLList(SongType),
      args: { playlistId: { type: GraphQLString } },
      resolve(parent, args) {
        const playlist = playlistService.getPlaylistById(args.playlistId);
        if (playlist) {
          return songService.listSongsByIds(playlist.songs);
        } else {
          return [];
        }
      },
    },
    // Listar playlists que contêm uma música específica
    playlistsBySong: {
      type: new GraphQLList(PlaylistType),
      args: { songId: { type: GraphQLString } },
      resolve(parent, args) {
        return playlistService.listPlaylistsBySong(args.songId);
      },
    },
  },
});

// Definição das mutações (Mutations)
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Mutações para Usuários
    createUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        const userData = { id: args.id, name: args.name, age: args.age };
        return userService.createUser(userData);
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        const userData = { name: args.name, age: args.age };
        return userService.updateUser(args.id, userData);
      },
    },
    deleteUser: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parent, args) {
        userService.deleteUser(args.id);
        return `Usuário com ID ${args.id} deletado`;
      },
    },
    // Associar playlist a usuário
    addPlaylistToUser: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        playlistId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const playlistExists = playlistService.getPlaylistById(args.playlistId);
        if (!playlistExists) {
          throw new Error('Playlist não encontrada');
        }
        const user = userService.addPlaylistToUser(args.userId, args.playlistId);
        if (!user) {
          throw new Error('Usuário não encontrado');
        }
        return user;
      },
    },
    // Mutações para Músicas
    createSong: {
      type: SongType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        artist: { type: GraphQLString },
      },
      resolve(parent, args) {
        const songData = { id: args.id, name: args.name, artist: args.artist };
        return songService.createSong(songData);
      },
    },
    updateSong: {
      type: SongType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        artist: { type: GraphQLString },
      },
      resolve(parent, args) {
        const songData = { name: args.name, artist: args.artist };
        return songService.updateSong(args.id, songData);
      },
    },
    deleteSong: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parent, args) {
        songService.deleteSong(args.id);
        return `Música com ID ${args.id} deletada`;
      },
    },
    // Mutações para Playlists
    createPlaylist: {
      type: PlaylistType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        songs: { type: new GraphQLList(GraphQLString) },
      },
      resolve(parent, args) {
        const playlistData = { id: args.id, name: args.name, songs: args.songs };
        return playlistService.createPlaylist(playlistData);
      },
    },
    updatePlaylist: {
      type: PlaylistType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        songs: { type: new GraphQLList(GraphQLString) },
      },
      resolve(parent, args) {
        const playlistData = { name: args.name, songs: args.songs };
        return playlistService.updatePlaylist(args.id, playlistData);
      },
    },
    deletePlaylist: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parent, args) {
        playlistService.deletePlaylist(args.id);
        return `Playlist com ID ${args.id} deletada`;
      },
    },
    // Adicionar música à playlist
    addSongToPlaylist: {
      type: PlaylistType,
      args: {
        playlistId: { type: new GraphQLNonNull(GraphQLString) },
        songId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const songExists = songService.getSongById(args.songId);
        if (!songExists) {
          throw new Error('Música não encontrada');
        }
        const playlist = playlistService.addSongToPlaylist(args.playlistId, args.songId);
        if (!playlist) {
          throw new Error('Playlist não encontrada');
        }
        return playlist;
      },
    },
    // Remover música da playlist
    removeSongFromPlaylist: {
      type: PlaylistType,
      args: {
        playlistId: { type: new GraphQLNonNull(GraphQLString) },
        songId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const playlist = playlistService.removeSongFromPlaylist(args.playlistId, args.songId);
        if (!playlist) {
          throw new Error('Playlist não encontrada');
        }
        return playlist;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});