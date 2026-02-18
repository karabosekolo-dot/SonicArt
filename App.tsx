
import React, { useState } from 'react';
import { Header } from './components/Header';
import { MusicStore } from './components/MusicStore';
import { CreativeSuite } from './components/CreativeSuite';
import { Cart } from './components/Cart';
import { AppRoute, Track, CartItem } from './types';
import { MOCK_TRACKS, MOCK_SAMPLE_PACKS } from './constants';

const App: React.FC = () => {
  const [currentRoute, setRoute] = useState<AppRoute>(AppRoute.HOME);
  const [tracks, setTracks] = useState<Track[]>(MOCK_TRACKS);
  const [samplePacks, setSamplePacks] = useState<Track[]>(MOCK_SAMPLE_PACKS);
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (track: Track) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === track.id);
      if (existing) {
        return prev.map(item => item.id === track.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...track, quantity: 1 }];
    });
    setRoute(AppRoute.CART);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handlePublishTrack = (newTrack: Track) => {
    if (newTrack.itemType === 'sample-pack') {
      setSamplePacks(prev => [newTrack, ...prev]);
    } else {
      setTracks(prev => [newTrack, ...prev]);
    }
    setRoute(AppRoute.STORE);
  };

  const clearCart = () => setCart([]);

  const renderRoute = () => {
    switch (currentRoute) {
      case AppRoute.HOME:
        return (
          <div className="relative overflow-hidden">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center relative z-10">
              <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent leading-none">
                THE FUTURE OF <br /> SOUND IS HERE.
              </h1>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
                SonicArt is the premium marketplace for independent producers and visual artists. Sell music, design covers with AI, and grow your career.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button 
                  onClick={() => setRoute(AppRoute.STORE)}
                  className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-purple-500 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-2xl"
                >
                  Start Exploring
                </button>
                <button 
                  onClick={() => setRoute(AppRoute.CREATIVE_SUITE)}
                  className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                >
                  Creative Suite
                </button>
              </div>
            </div>

            {/* Decorative Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none">
              <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
              <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-pink-500/10 blur-[100px] rounded-full" />
            </div>

            <MusicStore tracks={tracks} samplePacks={samplePacks} onAddToCart={handleAddToCart} />
          </div>
        );
      case AppRoute.STORE:
        return <MusicStore tracks={tracks} samplePacks={samplePacks} onAddToCart={handleAddToCart} />;
      case AppRoute.CREATIVE_SUITE:
        return <CreativeSuite onPublish={handlePublishTrack} />;
      case AppRoute.CART:
        return <Cart items={cart} onRemove={handleRemoveFromCart} onClear={clearCart} />;
      default:
        return <div>404</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
      <Header 
        currentRoute={currentRoute} 
        setRoute={setRoute} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
      />
      
      <main className="pb-24">
        {renderRoute()}
      </main>

      {/* Floating Audio Bar (Static UI Placeholder) */}
      <div className="fixed bottom-0 inset-x-0 h-24 bg-black/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-4 w-1/3">
          <div className="w-12 h-12 bg-purple-600 rounded-lg animate-pulse" />
          <div className="hidden sm:block">
            <h5 className="text-sm font-bold">Previewing...</h5>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Select a track to play</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="flex items-center gap-6">
            <button className="text-gray-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 15h2v-6h-2v6zm4 0h2v-6h-2v6z"/></svg>
            </button>
            <button className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="text-gray-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 15h2v-6h-2v6zm4 0h2v-6h-2v6z"/></svg>
            </button>
          </div>
          <div className="w-full max-w-xs h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-white rounded-full" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 w-1/3 text-gray-400">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 hover:text-white cursor-pointer transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
          <div className="w-20 h-1 bg-white/10 rounded-full">
            <div className="w-1/2 h-full bg-white rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
