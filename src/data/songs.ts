// @sos-edit: false
import gepSongBlocks from './gep_song_blocks.json';

export interface Song {
  id: string;
  title: string;
  artist: string;
  key: string;
  content: string; // Formato ChordPro: [Chord]letra...
}

export interface SongBlock {
  id: string;
  name: string;
  songs: Song[];
}

export const SONG_BLOCKS: SongBlock[] = gepSongBlocks as SongBlock[];
