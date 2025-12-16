import React, { useState } from 'react';
import { Shield, Plus, Check, ArrowLeft, HelpCircle } from 'lucide-react';

const BlocklistEditor = ({ listName, onBack }) => {
  const [customSite, setCustomSite] = useState('');
  
  // Starts empty
  const [addedSites, setAddedSites] = useState([]); 
  
  const commonFilters = [
    'Amazon', 'Instagram', 'Reddit', 'Tumblr', 
    'Apple News', 'LinkedIn', 'Slack', 'Twitter',
    'Clubhouse', 'Mastodon', 'Snapchat', 'WhatsApp',
    'Discord', 'Netflix', 'Spotify', 'YouTube',
    'Facebook', 'TikTok', 'Gmail', 'Tinder'
  ];

  const categoryFilters = [
    'Social', 'News', 'Sports', 'Time Wasters',
    'Meta', 'Politics', 'Blogs', 'Dating',
    'Messaging', 'Shopping', 'Food Delivery', 'Gambling'
  ];

  const [selectedFilters, setSelectedFilters] = useState([]);

  const toggleFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const handleAddSite = () => {
    if (customSite.trim()) {
      setAddedSites([...addedSites, customSite]);
      setCustomSite('');
    }
  };

  return (
    <div className="w-full max-w-[1000px] animate-fade-in">
      {/* Header - UPDATED: Buttons removed */}
      <div className="flex justify-between items-center mb-6 bg-forest-panel p-4 rounded-t-xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-forest-muted hover:text-white transition">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <Shield className="text-forest-accent" size={28} />
            <h1 className="text-2xl font-bold text-forest-accent">{listName}</h1>
          </div>
        </div>
        
        {/* The Edit/Delete buttons were here. Now they are gone. */}
      </div>

      <div className="bg-forest-panel p-8 rounded-b-xl border border-white/5 shadow-lg">
        
        {/* Section 1: Custom Websites */}
        <div className="mb-10 bg-forest-dark/30 p-6 rounded-xl border border-white/5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Your Custom Websites</h3>
          <div className="flex gap-4 mb-4">
            <input 
              type="text" 
              placeholder="Add custom website (e.g. cnn.com)"
              value={customSite}
              onChange={(e) => setCustomSite(e.target.value)}
              className="flex-1 bg-white text-forest-dark p-3 rounded font-medium focus:outline-none focus:ring-2 focus:ring-forest-accent"
            />
            <button 
              onClick={handleAddSite}
              className="bg-forest-accent hover:bg-forest-hover text-white font-bold px-6 rounded transition"
            >
              ADD SITE
            </button>
          </div>
          <button className="flex items-center gap-2 text-xs font-bold text-forest-accent border border-forest-accent px-4 py-2 rounded hover:bg-forest-accent/10 transition">
            <Plus size={14} /> ADD MULTIPLE SITES
          </button>

          {/* List of Added Custom Sites */}
          <div className="mt-4 space-y-2">
            {addedSites.map((site, index) => (
              <div key={index} className="flex items-center gap-2 text-white text-lg">
                <div className="bg-white rounded-full p-0.5">
                   <Check size={14} className="text-forest-dark" strokeWidth={4} /> 
                </div>
                {site}
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Common Filters */}
        <div className="mb-10 bg-forest-dark/30 p-6 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Common Filters</h3>
            <HelpCircle size={14} className="text-forest-muted" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
            {commonFilters.map(filter => (
              <button 
                key={filter} 
                onClick={() => toggleFilter(filter)}
                className="flex items-center gap-3 group text-left"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  selectedFilters.includes(filter) ? 'bg-white' : 'bg-forest-accent group-hover:bg-forest-hover'
                }`}>
                  {selectedFilters.includes(filter) ? (
                     <Check size={14} className="text-forest-dark" strokeWidth={4} />
                  ) : (
                     <Plus size={16} className="text-forest-dark" strokeWidth={3} />
                  )}
                </div>
                <span className="text-lg text-forest-text group-hover:text-white transition">{filter}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Category Filters */}
        <div className="bg-forest-dark/30 p-6 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Category Filters</h3>
            <HelpCircle size={14} className="text-forest-muted" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
            {categoryFilters.map(filter => (
              <button 
                key={filter} 
                onClick={() => toggleFilter(filter)}
                className="flex items-center gap-3 group text-left"
              >
                 <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  selectedFilters.includes(filter) ? 'bg-white' : 'bg-forest-accent group-hover:bg-forest-hover'
                }`}>
                  {selectedFilters.includes(filter) ? (
                     <Check size={14} className="text-forest-dark" strokeWidth={4} />
                  ) : (
                     <Plus size={16} className="text-forest-dark" strokeWidth={3} />
                  )}
                </div>
                <span className="text-lg text-forest-text group-hover:text-white transition">{filter}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlocklistEditor;