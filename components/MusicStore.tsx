
import React from 'react';
import { Track } from '../types';

interface MusicStoreProps {
  tracks: Track[];
  samplePacks: Track[];
  onAddToCart: (track: Track) => void;
}

export const MusicStore: React.FC<MusicStoreProps> = ({ tracks, samplePacks, onAddToCart }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-24">
      {/* Sample Packs Section */}
      <section>
        <header className="mb-12 flex items-end justify-between">
          <div>
            <span className="text-purple-500 font-black text-xs uppercase tracking-widest mb-2 block">Boutique Sound Design</span>
            <h2 className="text-4xl font-extrabold mb-2 tracking-tight">Curated Sample Packs</h2>
            <p className="text-gray-400">Professional-grade bundles for your next masterpiece.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {samplePacks.map((pack) => (
            <div key={pack.id} className="group bg-gradient-to-b from-[#1a1a1a] to-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-pink-500/30 transition-all hover:shadow-2xl hover:shadow-pink-500/5">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={pack.coverUrl} 
                  alt={pack.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-black font-black text-xs px-4 py-2 rounded-full uppercase tracking-tighter shadow-xl">Preview Bundle</span>
                </div>
                <div className="absolute top-4 left-4 bg-pink-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  Bundle Pack
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-2xl tracking-tighter">{pack.title}</h3>
                    <p className="text-sm text-gray-500">{pack.artist}</p>
                  </div>
                  <span className="text-2xl font-mono text-white">BWP {pack.price.toFixed(0)}</span>
                </div>
                <p className="text-gray-400 text-sm mb-8 line-clamp-2 leading-relaxed italic">
                  {pack.description}
                </p>
                <button 
                  onClick={() => onAddToCart(pack)}
                  className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-pink-500 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                >
                  Purchase Pack
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Tracks Section */}
      <section>
        <header className="mb-12">
          <h2 className="text-4xl font-extrabold mb-2 tracking-tight">Trending Individual Tracks</h2>
          <p className="text-gray-400">Single license high-fidelity recordings.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {tracks.map((track) => (
            <div key={track.id} className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={track.coverUrl} 
                  alt={track.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-white/10">
                  {track.genre}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg truncate tracking-tight">{track.title}</h3>
                <p className="text-xs text-gray-500 mb-4">{track.artist}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xl font-mono text-purple-400">BWP {track.price.toFixed(2)}</span>
                  <button 
                    onClick={() => onAddToCart(track)}
                    className="bg-white text-black text-xs font-black px-4 py-2 rounded-lg hover:bg-purple-500 hover:text-white transition-all active:scale-95"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
