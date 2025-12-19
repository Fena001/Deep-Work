import React, { useState, useEffect } from 'react';
import { Shield, Plus, Check, ArrowLeft, HelpCircle, Trash2 } from 'lucide-react';

const BlocklistEditor = ({ listName, initialSites = [], onUpdateSites, onBack }) => {
  const [customSite, setCustomSite] = useState('');
  const [addedSites, setAddedSites] = useState([]);      
  const [selectedFilters, setSelectedFilters] = useState([]); 

  const DOMAIN_MAP = {
    'Amazon': 'amazon.com',
    'Instagram': 'instagram.com',
    'Reddit': 'reddit.com',
    'Tumblr': 'tumblr.com',
    'Apple News': 'apple.news',
    'LinkedIn': 'linkedin.com',
    'Slack': 'slack.com',
    'Twitter': 'twitter.com',
    'Clubhouse': 'clubhouse.com',
    'Mastodon': 'mastodon.social',
    'Snapchat': 'snapchat.com',
    'WhatsApp': 'whatsapp.com',
    'Discord': 'discord.com',
    'Netflix': 'netflix.com',
    'Spotify': 'spotify.com',
    'YouTube': 'youtube.com',
    'eBay': 'ebay.com',
    'NY Times': 'nytimes.com',
    'Telegram': 'telegram.org',
    'Facebook': 'facebook.com',
    'OkCupid': 'okcupid.com',
    'TikTok': 'tiktok.com',
    'Gmail': 'mail.google.com',
    'Pinterest': 'pinterest.com',
    'Tinder': 'tinder.com'
  };

  const commonFilters = Object.keys(DOMAIN_MAP);
  const categoryFilters = [
    'Social', 'News', 'Sports', 'Time Wasters', 'Meta', 'Politics', 'Blogs', 'Dating',
    'Messaging', 'Shopping', 'Food Delivery', 'Gambling', 'Search Engines', 'TV/Video', 'Games', 'Adult'
  ];

  useEffect(() => {
    const initSelected = [];
    const initCustom = [];

    if (initialSites && initialSites.length > 0) {
      initialSites.forEach(site => {
        const key = Object.keys(DOMAIN_MAP).find(k => DOMAIN_MAP[k] === site);
        if (key) {
          initSelected.push(key);
        } else {
          initCustom.push(site);
        }
      });
    }

    setSelectedFilters(initSelected);
    setAddedSites(initCustom);
  }, [listName, initialSites]);


  const saveAndExit = () => {
    const filterDomains = selectedFilters.map(f => DOMAIN_MAP[f]);
    const allSites = [...addedSites, ...filterDomains];
    const uniqueSites = [...new Set(allSites)];
    
    onUpdateSites(uniqueSites);
    
    onBack();
  };

  const toggleFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(prev => prev.filter(f => f !== filter));
    } else {
      setSelectedFilters(prev => [...prev, filter]);
    }
  };

  const handleAddSite = () => {
    if (customSite.trim()) {
      setAddedSites(prev => [...prev, customSite.trim()]);
      setCustomSite('');
    }
  };

  const handleRemoveSite = (siteToRemove) => {
    setAddedSites(prev => prev.filter(site => site !== siteToRemove));
  };

  return (
    <div className="w-full max-w-[1000px] animate-fade-in pb-10">
      <div className="flex justify-between items-center mb-6 bg-forest-panel p-4 rounded-t-xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={saveAndExit} className="text-forest-muted hover:text-white transition">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <Shield className="text-forest-accent" size={28} />
            <h1 className="text-2xl font-bold text-forest-accent">{listName}</h1>
          </div>
        </div>
      </div>

      <div className="bg-forest-panel p-8 rounded-b-xl border border-white/5 shadow-lg">
        
        <div className="mb-10 bg-forest-dark/30 p-6 rounded-xl border border-white/5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Your Custom Websites</h3>
          <div className="flex gap-4 mb-4">
            <input 
              type="text" 
              placeholder="e.g. cnn.com"
              value={customSite}
              onChange={(e) => setCustomSite(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSite()}
              className="flex-1 bg-white text-forest-dark p-3 rounded font-medium focus:outline-none focus:ring-2 focus:ring-forest-accent"
            />
            <button onClick={handleAddSite} className="bg-forest-accent hover:bg-forest-hover text-white font-bold px-6 rounded transition">ADD</button>
          </div>

          <div className="mt-4 space-y-2">
            {addedSites.map((site, index) => (
              <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded hover:bg-white/10 transition">
                <div className="flex items-center gap-3 text-white text-lg">
                   <div className="bg-white rounded-full p-0.5"><Check size={14} className="text-forest-dark" strokeWidth={4} /></div>
                   {site}
                </div>
                <button onClick={() => handleRemoveSite(site)} className="text-forest-muted hover:text-red-400 transition"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
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
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 ${
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

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Category Filters</h3>
            <HelpCircle size={14} className="text-forest-muted" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
            {categoryFilters.map(filter => (
              <button key={filter} className="flex items-center gap-3 group text-left">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 bg-forest-accent group-hover:bg-forest-hover`}>
                   <Plus size={16} className="text-forest-dark" strokeWidth={3} />
                </div>
                <span className="text-lg text-forest-text group-hover:text-white transition">{filter}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex justify-center">
          <button 
            onClick={saveAndExit} 
            className="bg-forest-accent hover:bg-forest-hover text-white text-xl font-bold py-4 px-12 rounded-lg shadow-lg transition transform active:scale-[0.98]"
          >
            DONE
          </button>
        </div>

      </div>
    </div>
  );
};

export default BlocklistEditor;