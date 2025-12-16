import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, ChevronDown } from 'lucide-react';

const FocusSounds = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [selectedSound, setSelectedSound] = useState('Rain');

  // Reference to the <audio> HTML tag
  const audioRef = useRef(null);

  // UPDATED: Reliable MP3 Links (Work on Mac/Windows/iPhone)
  const soundLibrary = {
    'Rain': 'https://assets.mixkit.co/active_storage/sfx/2436/2436-preview.mp3',
    'Forest': 'https://assets.mixkit.co/active_storage/sfx/2443/2443-preview.mp3',
    'Stream': 'https://assets.mixkit.co/active_storage/sfx/2442/2442-preview.mp3',
    'Waves': 'https://assets.mixkit.co/active_storage/sfx/2438/2438-preview.mp3'
  };

  // EFFECT 1: Handle Play/Pause & Source Change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // If the sound source changed, update it
    if (audio.src !== soundLibrary[selectedSound]) {
      audio.src = soundLibrary[selectedSound];
      audio.load(); // Important: Tell browser to load the new file
      if (isPlaying) {
        audio.play().catch(e => console.log("Audio play failed:", e));
      }
    }

    // Handle Play/Pause state
    if (isPlaying) {
      audio.play().catch(e => console.log("Audio play blocked:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, selectedSound]);

  // EFFECT 2: Handle Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return (
    <div className="bg-forest-dark/30 rounded-lg p-6 border border-white/5 h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-6">Focus Sounds</h3>

      {/* HIDDEN HTML5 AUDIO TAG (The engine) */}
      <audio ref={audioRef} loop />

      <div className="flex flex-col gap-6">
        
        {/* Dropdown */}
        <div className="relative">
          <select 
            value={selectedSound}
            onChange={(e) => setSelectedSound(e.target.value)}
            className="w-full bg-white text-forest-dark font-semibold text-lg py-3 px-4 rounded shadow-sm appearance-none cursor-pointer focus:outline-none"
          >
            {Object.keys(soundLibrary).map(sound => (
              <option key={sound} value={sound}>{sound}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-forest-dark">
            <ChevronDown size={20} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
              isPlaying ? 'bg-white' : 'bg-forest-accent hover:bg-forest-hover'
            }`}
          >
            {isPlaying ? (
              <Pause fill="#1a221b" className="text-forest-dark" size={20} />
            ) : (
              <Play fill="white" className="text-white ml-1" size={20} />
            )}
          </button>

          <Volume2 className="text-forest-accent" size={24} />

          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-forest-accent"
          />
        </div>
      </div>
    </div>
  );
};

export default FocusSounds;