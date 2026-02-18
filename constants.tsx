
import { Track } from './types';

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'SynthWave Rider',
    price: 0.99,
    coverUrl: 'https://picsum.photos/seed/synth/600/600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'Electronic',
    itemType: 'track'
  },
  {
    id: '2',
    title: 'Midnight Rain',
    artist: 'Lo-Fi Chill',
    price: 1.49,
    coverUrl: 'https://picsum.photos/seed/rain/600/600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Lo-Fi',
    itemType: 'track'
  },
  {
    id: '3',
    title: 'Ethereal Voyage',
    artist: 'Celestial Echoes',
    price: 2.99,
    coverUrl: 'https://picsum.photos/seed/space/600/600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'Ambient',
    itemType: 'track'
  },
  {
    id: '4',
    title: 'Urban Jungle',
    artist: 'Street Rhythm',
    price: 1.25,
    coverUrl: 'https://picsum.photos/seed/city/600/600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'Hip-Hop',
    itemType: 'track'
  },
  {
    id: '5',
    title: 'Golden Horizon',
    artist: 'Acoustic Soul',
    price: 0.99,
    coverUrl: 'https://picsum.photos/seed/soul/600/600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    genre: 'Acoustic',
    itemType: 'track'
  },
  {
    id: '6',
    title: 'Binary Sunset',
    artist: 'Code Glitch',
    price: 1.99,
    coverUrl: 'https://picsum.photos/seed/glitch/600/600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    genre: 'Techno',
    itemType: 'track'
  }
];

export const MOCK_SAMPLE_PACKS: Track[] = [
  {
    id: 'sp1',
    title: 'Vaporwave Vol. 1',
    artist: 'Retro Future',
    price: 19.99,
    coverUrl: 'https://picsum.photos/seed/vapor/800/800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    genre: 'Synth',
    description: '500+ high-quality drum loops, synth stabs, and FX.',
    itemType: 'sample-pack'
  },
  {
    id: 'sp2',
    title: 'Deep House Textures',
    artist: 'Blue Note',
    price: 24.99,
    coverUrl: 'https://picsum.photos/seed/deep/800/800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    genre: 'House',
    description: 'Ambient pads and deep rhythmic sequences for professional house production.',
    itemType: 'sample-pack'
  },
  {
    id: 'sp3',
    title: 'Cinematic Impacts',
    artist: 'Orchestral AI',
    price: 29.99,
    coverUrl: 'https://picsum.photos/seed/cine/800/800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    genre: 'Cinematic',
    description: 'Boutique orchestral hits and industrial textures.',
    itemType: 'sample-pack'
  }
];
