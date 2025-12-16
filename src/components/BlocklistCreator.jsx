import React, { useState } from 'react';
import { Shield, Plus, Check, HelpCircle } from 'lucide-react';

const BlocklistCreator = ({ onSave, onCancel }) => {
  const [listName, setListName] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  
  // Custom sites state
  const [customSite, setCustomSite] = useState('');
  const [addedSites, setAddedSites] = useState([]); 

  // --- FULL DATA SETS (Restored) ---
  const commonFilters = [
    'Amazon', 'Instagram', 'Reddit', 'Tumblr', 
    'Apple News', 'LinkedIn', 'Slack', 'Twitter',
    'Clubhouse', 'Mastodon', 'Snapchat', 'WhatsApp',
    'Discord', 'Netflix', 'Spotify', 'YouTube',
    'eBay', 'NY Times', 'Telegram', 'Facebook', 
    'OkCupid', 'TikTok', 'Gmail', 'Pinterest', 'Tinder'
  ];

  const categoryFilters = [
    'Social', 'News', 'Sports', 'Time Wasters',
    'Meta', 'Politics', 'Blogs', 'Dating',
    'Messaging', 'Shopping', 'Food Delivery', 'Gambling',
    'Search Engines', 'TV/Video', 'Games', 'Adult'
  ];

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

  const handleCreate = () => {
    if (!listName.trim()) {
      alert("Please name your blocklist");
      return;
    }
    const totalFilters = selectedFilters.length + addedSites.length;
    const countText = `${totalFilters} filters selected`;
    onSave(listName, countText);
  };

  return (
    <div className="w-full max-w-[1000px] animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-forest-panel p-4 rounded-t-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <Shield className="text-forest-muted" size={24} />
          <h1 className="text-xl font-bold text-white">New Blocklist</h1>
        </div>
        <button onClick={onCancel} className="text-xs font-bold text-red-400 hover:text-white tracking-wider">
          CANCEL
        </button>
      </div>

      <div className="bg-forest-panel p-8 rounded-b-xl border border-white/5 shadow-lg">
        
        {/* Name Input */}
        <input 
          type="text" 
          placeholder="Name your blocklist"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          className="w-full bg-white text-forest-dark p-4 rounded text-lg font-medium mb-8 focus:outline-none focus:ring-4 focus:ring-forest-accent"
        />

        {/* Custom Sites Section */}
        <div className="mb-10 bg-forest-dark/30 p-6 rounded-xl border border-white/5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Your Custom Websites</h3>
          <div className="flex gap-4 mb-4">
            <input 
              type="text" 
              placeholder="e.g. cnn.com" 
              value={customSite}
              onChange={(e) => setCustomSite(e.target.value)}
              className="flex-1 bg-white text-forest-dark p-3 rounded font-medium" 
            />
            <button 
              onClick={handleAddSite}
              className="bg-forest-accent hover:bg-forest-hover text-white font-bold px-6 rounded transition"
            >
              ADD SITE
            </button>
          </div>

          <div className="space-y-2">
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

        {/* SECTION 1: Common Filters */}
        <div className="mb-10">
           <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Common Filters</h3>
            <HelpCircle size={14} className="text-forest-muted" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4">
            {commonFilters.map(filter => (
              <button key={filter} onClick={() => toggleFilter(filter)} className="flex items-center gap-3 group text-left">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                  selectedFilters.includes(filter) ? 'bg-white' : 'bg-forest-accent'
                }`}>
                  {selectedFilters.includes(filter) ? <Check size={14} className="text-forest-dark" strokeWidth={4}/> : <Plus size={16} className="text-forest-dark"/>}
                </div>
                <span className="text-lg text-forest-text">{filter}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 2: Category Filters (Added Back) */}
        <div className="mb-8">
           <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Category Filters</h3>
            <HelpCircle size={14} className="text-forest-muted" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4">
            {categoryFilters.map(filter => (
              <button key={filter} onClick={() => toggleFilter(filter)} className="flex items-center gap-3 group text-left">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                  selectedFilters.includes(filter) ? 'bg-white' : 'bg-forest-accent'
                }`}>
                  {selectedFilters.includes(filter) ? <Check size={14} className="text-forest-dark" strokeWidth={4}/> : <Plus size={16} className="text-forest-dark"/>}
                </div>
                <span className="text-lg text-forest-text">{filter}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Create Button */}
        <button 
          onClick={handleCreate}
          className="w-full bg-forest-accent hover:bg-forest-hover text-white text-xl font-bold py-4 rounded-lg mt-8 shadow-lg transition transform active:scale-[0.99]"
        >
          CREATE BLOCKLIST
        </button>

      </div>
    </div>
  );
};

export default BlocklistCreator;