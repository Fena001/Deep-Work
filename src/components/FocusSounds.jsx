import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause } from 'lucide-react';

const sounds = [
  { name: 'Rain', file: '/sounds/rain.mp3' },
  { name: 'Forest', file: '/sounds/forest.mp3' },
  { name: 'Lo-Fi', file: '/sounds/lofi.mp3' }, 
  { name: 'White Noise', file: '/sounds/whitenoise.mp3' }
];

const FocusSounds = () => {
  const [isPlaying, setIsPlaying] = useState(() => JSON.parse(localStorage.getItem('sound_playing') || 'false'));
  const [selectedSound, setSelectedSound] = useState(() => localStorage.getItem('sound_track') || sounds[0].file);
  const [volume, setVolume] = useState(() => parseFloat(localStorage.getItem('sound_volume') || '0.5'));

  const toggleSound = () => {
    const newState = !isPlaying;
    setIsPlaying(newState);
    
    localStorage.setItem('sound_playing', JSON.stringify(newState));

    if (newState) {
      if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.sendMessage({ 
            action: "PLAY_SOUND", 
            track: selectedSound,
            volume: volume
        });
      }
    } else {
      if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.sendMessage({ action: "STOP_SOUND" });
      }
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    localStorage.setItem('sound_volume', val);
    
    if (isPlaying && typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.sendMessage({ action: "SET_VOLUME", volume: val });
    }
  };

  const handleSoundSelect = (e) => {
    const newSound = e.target.value;
    setSelectedSound(newSound);
    localStorage.setItem('sound_track', newSound);

    if (isPlaying && typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.sendMessage({ 
          action: "PLAY_SOUND", 
          track: newSound,
          volume: volume
      });
    }
  };

  return (
    <div className="bg-forest-panel border border-white/5 p-6 rounded-xl">
      <h3 className="text-white font-bold mb-4">Focus Sounds</h3>
      
      <div className="bg-forest-dark/50 rounded-lg p-4">
        <select 
          value={selectedSound} 
          onChange={handleSoundSelect}
          className="w-full bg-forest-dark text-white p-3 rounded mb-4 border border-white/10 focus:outline-none focus:border-forest-accent"
        >
          {sounds.map((sound, index) => (
            <option key={index} value={sound.file}>{sound.name}</option>
          ))}
        </select>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSound}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isPlaying 
                ? 'bg-forest-accent text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>

          <div className="flex-1 flex items-center gap-3">
            <Volume2 size={20} className="text-forest-muted" />
            <input 
              type="range" 
              min="0" max="1" step="0.01" 
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-forest-accent h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusSounds;