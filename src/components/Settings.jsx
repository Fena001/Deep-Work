import React from 'react';
import { Moon, Bell, Trash2 } from 'lucide-react';

const Settings = ({ currentTheme, onSetTheme, settings, onToggleSetting, onReset }) => {
  
  const themes = [
    { id: 'ocean', name: 'Night', color: '#22C55E' },
    { id: 'crimson', name: 'Crimson', color: '#e11d48' },
    { id: 'gold', name: 'Gold', color: '#fbbf24' }
  ];

  return (
    <div className="bg-forest-panel rounded-xl border border-white/5 shadow-lg overflow-hidden animate-fade-in">
      
      <div className="p-6 border-b border-white/5">
        <h3 className="text-xl font-bold text-white">Preferences</h3>
        <p className="text-sm text-forest-muted">Customize your focus environment</p>
      </div>

      <div className="p-6 space-y-8">
        
        <div>
          <h4 className="text-xs font-bold text-forest-accent uppercase tracking-wider mb-4 flex items-center gap-2">
            <Moon size={14} /> Appearance
          </h4>
          <div className="flex gap-4">
            {themes.map(theme => (
              <button 
                key={theme.id} 
                onClick={() => onSetTheme(theme.id)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition border flex items-center gap-2 ${
                  currentTheme === theme.id 
                    ? 'bg-forest-accent text-forest-dark border-forest-accent' 
                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="w-3 h-3 rounded-full" style={{backgroundColor: theme.color}}></span>
                {theme.name} Mode
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-forest-accent uppercase tracking-wider mb-4 flex items-center gap-2">
            <Bell size={14} /> Notifications
          </h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer group bg-forest-dark/30 p-3 rounded-lg border border-white/5">
              <span className="text-white group-hover:text-forest-accent transition">Play sound on completion</span>
              <input 
                type="checkbox" 
                className="w-5 h-5 accent-forest-accent" 
                checked={settings.soundEnabled}
                onChange={() => onToggleSetting('soundEnabled')}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer group bg-forest-dark/30 p-3 rounded-lg border border-white/5">
              <span className="text-white group-hover:text-forest-accent transition">Show desktop notification</span>
              <input 
                type="checkbox" 
                className="w-5 h-5 accent-forest-accent"
                checked={settings.notifyEnabled}
                onChange={() => {
                  if (!settings.notifyEnabled && Notification.permission !== "granted") {
                    Notification.requestPermission();
                  }
                  onToggleSetting('notifyEnabled');
                }} 
              />
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5">
          <button 
            onClick={onReset}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-bold transition hover:bg-red-400/10 p-2 rounded"
          >
            <Trash2 size={16} /> RESET ALL DATA
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;