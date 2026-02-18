
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';
import { GoogleGenAI } from "@google/genai";
import { Track } from '../types';

interface CreativeSuiteProps {
  onPublish: (track: Track) => void;
}

export const CreativeSuite: React.FC<CreativeSuiteProps> = ({ onPublish }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'audio'>('visual');
  
  // Visual Studio State
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/png');
  const [visualPrompt, setVisualPrompt] = useState('');
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [analysis, setAnalysis] = useState<string>('');
  
  // Audio Lab State
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtist, setTrackArtist] = useState('');
  const [trackPrice, setTrackPrice] = useState('10.00');
  const [trackGenre, setTrackGenre] = useState('Electronic');
  const [trackDescription, setTrackDescription] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Visualizer Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioUrl]);

  // Clean up visualizer on unmount or tab switch
  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  const initVisualizer = () => {
    if (!audioRef.current || analyserRef.current) return;

    try {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current);

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      analyser.fftSize = 256;
      analyserRef.current = analyser;
      audioContextRef.current = audioContext;
      sourceRef.current = source;
    } catch (e) {
      console.error("Visualizer initialization failed", e);
    }
  };

  const drawVisualizer = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      animationIdRef.current = requestAnimationFrame(renderFrame);
      analyserRef.current!.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#9333ea'); // purple-600
        gradient.addColorStop(0.5, '#ec4899'); // pink-500
        gradient.addColorStop(1, '#f472b6'); // pink-400

        ctx.fillStyle = gradient;
        // Rounded bar drawing
        const radius = 2;
        ctx.beginPath();
        ctx.roundRect(x, canvas.height - barHeight, barWidth - 1, barHeight, radius);
        ctx.fill();

        x += barWidth;
      }
    };

    renderFrame();
  };

  const handleAudioPlay = () => {
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    initVisualizer();
    if (!animationIdRef.current) {
      drawVisualizer();
    }
  };

  const handleAudioPause = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setAnalysis('');
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
      setError(null);
      // Reset visualizer if active
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleGenerate = async () => {
    if (!generationPrompt) return;
    setIsProcessing(true);
    setError(null);
    try {
      const generated = await GeminiService.generateImage(generationPrompt);
      if (generated) {
        setImage(generated);
        setMimeType('image/png');
        setAnalysis('');
        setGenerationPrompt('');
      }
    } catch (err) {
      setError("Image generation failed. Please try a different prompt.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = async () => {
    if (!image || !visualPrompt) return;
    setIsProcessing(true);
    setError(null);
    try {
      const edited = await GeminiService.editImage(image, mimeType, visualPrompt);
      if (edited) {
        setImage(edited);
        setVisualPrompt('');
      }
    } catch (err) {
      setError("Failed to edit image. Check your prompt or API key.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await GeminiService.analyzeImage(image, mimeType);
      setAnalysis(result);
    } catch (err) {
      setError("Failed to analyze image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAudioMeta = async () => {
    if (!trackTitle) {
      setError("Please enter a title for AI suggestions.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Given a music track titled "${trackTitle}" by artist "${trackArtist || 'Unknown'}", suggest a compelling 2-sentence marketing description and a specific genre tag.`,
      });
      const text = response.text;
      if (text) {
        setTrackDescription(text);
      }
    } catch (err) {
      setError("Failed to generate metadata.");
    } finally {
      setIsProcessing(false);
    }
  };

  const publishToStore = () => {
    if (!trackTitle || !audioUrl) {
      setError("Title and Audio file are required to publish.");
      return;
    }
    const newTrack: Track = {
      id: Date.now().toString(),
      title: trackTitle,
      artist: trackArtist || 'Independent Artist',
      price: parseFloat(trackPrice),
      genre: trackGenre,
      coverUrl: image || 'https://picsum.photos/seed/newtrack/600/600',
      audioUrl: audioUrl,
      description: trackDescription
    };
    onPublish(newTrack);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-12 text-center">
        <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent italic tracking-tighter">CREATIVE SUITE</h2>
        
        <div className="flex items-center justify-center gap-2 mt-8 bg-[#111] p-1 rounded-2xl w-fit mx-auto border border-white/5">
          <button 
            onClick={() => setActiveTab('visual')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'visual' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            Visual Studio
          </button>
          <button 
            onClick={() => setActiveTab('audio')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'audio' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            Audio Lab
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-8 bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {activeTab === 'visual' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-500">
          <div className="space-y-6">
            <div className="relative aspect-square bg-[#111] border-2 border-dashed border-white/10 rounded-2xl overflow-hidden flex items-center justify-center group transition-colors hover:border-purple-500/50">
              {image ? (
                <img src={image} alt="Target" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center p-8">
                  <div className="mb-4 flex justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">Generate or Upload Album Cover</p>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-xl text-xs font-bold border border-white/10 transition-colors hover:bg-purple-500 hover:text-white"
              >
                {image ? 'Change Photo' : 'Upload File'}
              </button>
            </div>

            <button 
              disabled={!image || isProcessing}
              onClick={handleAnalyze}
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin rounded-full" /> : 'Deep Visual Analysis'}
            </button>
          </div>

          <div className="space-y-8">
            <div className="bg-[#111] p-6 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-pink-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                AI Generator
              </h3>
              <p className="text-xs text-gray-400">Create a unique background from a text prompt.</p>
              <div className="relative">
                <input 
                  type="text" 
                  value={generationPrompt}
                  onChange={(e) => setGenerationPrompt(e.target.value)}
                  placeholder="A futuristic synthwave city at sunset..."
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none transition-colors"
                />
                <button 
                  disabled={!generationPrompt || isProcessing}
                  onClick={handleGenerate}
                  className="absolute right-2 top-1.5 bottom-1.5 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-700 text-white px-4 rounded-lg text-xs font-bold transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>

            <div className="bg-[#111] p-6 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                AI Image Manipulation
              </h3>
              <div className="relative">
                <input 
                  type="text" 
                  value={visualPrompt}
                  onChange={(e) => setVisualPrompt(e.target.value)}
                  placeholder="Describe your AI edits (e.g. 'Add vaporwave colors')..."
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none transition-colors"
                />
                <button 
                  disabled={!image || !visualPrompt || isProcessing}
                  onClick={handleEdit}
                  className="absolute right-2 top-1.5 bottom-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white px-4 rounded-lg text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {analysis && (
              <div className="bg-[#111] p-6 rounded-2xl border border-white/5 animate-in slide-in-from-bottom-2 duration-500">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Gemini Insights
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{analysis}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-500">
          <div className="space-y-6">
            <div className="bg-[#111] p-8 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center group transition-colors hover:border-purple-500/50">
              {audioUrl ? (
                <div className="w-full space-y-4">
                  <div className="w-full h-32 bg-black/40 rounded-xl overflow-hidden relative border border-white/5">
                    <canvas ref={canvasRef} width={400} height={128} className="w-full h-full" />
                  </div>
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                  </div>
                  <p className="font-bold text-white truncate max-w-xs mx-auto">{audioFile?.name}</p>
                  
                  <div className="space-y-3">
                    <audio 
                      ref={audioRef} 
                      src={audioUrl} 
                      controls 
                      className="w-full h-10 invert opacity-70"
                      onPlay={handleAudioPlay}
                      onPause={handleAudioPause}
                    />
                    <div className="flex items-center gap-3 bg-black/40 p-4 rounded-xl border border-white/5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                      </svg>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={volume} 
                        onChange={handleVolumeChange}
                        className="flex-1 accent-purple-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-gray-500 w-10 text-right">
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-500 mx-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                  <div>
                    <p className="font-bold text-lg">Drop your master track</p>
                    <p className="text-sm text-gray-500">Supports MP3 and WAV</p>
                  </div>
                </div>
              )}
              <input type="file" accept="audio/*" className="hidden" ref={audioInputRef} onChange={handleAudioChange} />
              <button 
                onClick={() => audioInputRef.current?.click()}
                className="mt-6 bg-white text-black px-6 py-2 rounded-xl text-sm font-black hover:bg-purple-500 hover:text-white transition-all"
              >
                {audioUrl ? 'Choose Another' : 'Select Audio'}
              </button>
            </div>

            <div className="bg-[#111] p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">AI Meta-Data</h3>
                <button 
                  onClick={generateAudioMeta}
                  disabled={isProcessing || !trackTitle}
                  className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30 hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50"
                >
                  {isProcessing ? 'Generating...' : '✨ Suggest Meta'}
                </button>
              </div>
              <textarea 
                value={trackDescription}
                onChange={(e) => setTrackDescription(e.target.value)}
                placeholder="Track description..."
                rows={4}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#111] p-8 rounded-2xl border border-white/5 space-y-6">
              <h3 className="text-xl font-bold">Track Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Title</label>
                  <input 
                    type="text" 
                    value={trackTitle} 
                    onChange={(e) => setTrackTitle(e.target.value)}
                    placeholder="Neon Horizons" 
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Artist Name</label>
                  <input 
                    type="text" 
                    value={trackArtist} 
                    onChange={(e) => setTrackArtist(e.target.value)}
                    placeholder="Your Stage Name" 
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price (BWP)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={trackPrice} 
                      onChange={(e) => setTrackPrice(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Genre</label>
                    <select 
                      value={trackGenre}
                      onChange={(e) => setTrackGenre(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none appearance-none"
                    >
                      <option>Electronic</option>
                      <option>Hip-Hop</option>
                      <option>Lo-Fi</option>
                      <option>Ambient</option>
                      <option>Acoustic</option>
                      <option>Techno</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={publishToStore}
                disabled={!audioUrl || !trackTitle}
                className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-green-500 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Publish to Marketplace
              </button>
            </div>
            <p className="text-[10px] text-gray-600 text-center uppercase tracking-widest">
              By publishing, you agree to SonicArt's creator terms.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
