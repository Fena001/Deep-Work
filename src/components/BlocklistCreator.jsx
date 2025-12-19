import React, { useState } from 'react';
import { Plus, Check, ArrowLeft, Trash2 } from 'lucide-react';
import { COMMON_APPS, CATEGORY_GROUPS } from '../data/categories';

const BlocklistCreator = ({ onSave, onCancel }) => {
  const [listName, setListName] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customSites, setCustomSites] = useState([]);
  
  const [selectedApps, setSelectedApps] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleApp = (id) => {
    if (selectedApps.includes(id)) {
      setSelectedApps(prev => prev.filter(item => item !== id));
    } else {
      setSelectedApps(prev => [...prev, id]);
    }
  };

  const toggleCategory = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(prev => prev.filter(item => item !== id));
    } else {
      setSelectedCategories(prev => [...prev, id]);
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    const clean = customUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
    if (!customSites.includes(clean)) setCustomSites([...customSites, clean]);
    setCustomUrl('');
  };

  const handleSave = () => {
    if (!listName.trim()) { alert("Please enter a list name."); return; }

    let finalSites = [...customSites];

    selectedApps.forEach(id => {
      const app = COMMON_APPS.find(a => a.id === id);
      if (app) finalSites.push(app.url);
    });

    selectedCategories.forEach(id => {
      const cat = CATEGORY_GROUPS.find(c => c.id === id);
      if (cat) finalSites = [...finalSites, ...cat.sites];
    });

    finalSites = [...new Set(finalSites)];

    if (finalSites.length === 0) { alert("Select at least one distraction to block."); return; }

    onSave(listName, `${finalSites.length} sites`, finalSites);
  };

  return (
    <div className="w-full max-w-4xl bg-[#0B1221] rounded-xl p-8 shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh] text-white">
      
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-4">
            <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition">
              <ArrowLeft size={24} className="text-gray-400" />
            </button>
            <h2 className="text-2xl font-bold">New Blocklist</h2>
         </div>
         <button 
           onClick={handleSave}
           className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded font-bold transition shadow-lg hover:scale-105"
         >
           DONE
         </button>
      </div>

      <div className="mb-8">
         <label className="block text-gray-400 text-xs font-bold uppercase mb-2">List Name</label>
         <input 
           type="text" 
           value={listName}
           onChange={(e) => setListName(e.target.value)}
           placeholder="e.g. Work Mode"
           className="w-full bg-[#161F32] text-white p-4 rounded border border-white/5 focus:outline-none focus:border-green-500 transition-colors"
         />
      </div>

      <div className="mb-8">
        <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Your Custom Websites</label>
        <form onSubmit={handleAddCustom} className="flex gap-2">
          <input 
            type="text" 
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="e.g. specific-site.com"
            className="flex-1 bg-[#161F32] text-white p-3 rounded border border-white/5 focus:outline-none focus:border-green-500"
          />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 rounded font-bold transition-colors">ADD</button>
        </form>
        {customSites.length > 0 && (
          <div className="flex flex-col gap-2 mt-3">
             {customSites.map(s => (
                <div key={s} className="bg-[#161F32] p-3 rounded flex justify-between items-center border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white text-[#0B1221] flex items-center justify-center">
                            <Check size={14} strokeWidth={4}/>
                        </div>
                        <span className="font-medium text-white">{s}</span>
                    </div>
                    <button onClick={() => setCustomSites(prev => prev.filter(x => x !== s))} className="text-gray-500 hover:text-red-400">
                        <Trash2 size={18} />
                    </button>
                </div>
             ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-400 text-xs font-bold uppercase">Common Filters</span>
            <span className="text-gray-600 text-xs cursor-help" title="Popular apps">?</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COMMON_APPS.map(app => {
                const isSelected = selectedApps.includes(app.id);
                return (
                    <div 
                        key={app.id}
                        onClick={() => toggleApp(app.id)}
                        className="flex items-center gap-3 cursor-pointer group select-none"
                    >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-white text-[#0B1221]' : 'bg-green-500 text-white group-hover:scale-110'}`}>
                            {isSelected ? <Check size={14} strokeWidth={4}/> : <Plus size={14} strokeWidth={4}/>}
                        </div>
                        <span className={`font-medium transition-colors ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                            {app.name}
                        </span>
                    </div>
                );
            })}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-400 text-xs font-bold uppercase">Category Filters</span>
            <span className="text-gray-600 text-xs cursor-help" title="Broad groups of sites">?</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORY_GROUPS.map(cat => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                    <div 
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className="flex items-center gap-3 cursor-pointer group select-none"
                    >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-white text-[#0B1221]' : 'bg-green-500 text-white group-hover:scale-110'}`}>
                            {isSelected ? <Check size={14} strokeWidth={4}/> : <Plus size={14} strokeWidth={4}/>}
                        </div>
                        <span className={`font-medium transition-colors ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                            {cat.name}
                        </span>
                    </div>
                );
            })}
        </div>
      </div>

      <div className="flex justify-center mt-8 pt-6 border-t border-white/10">
         <button 
           onClick={handleSave} 
           className="bg-green-500 hover:bg-green-600 text-white px-20 py-3 rounded font-bold text-lg shadow-lg hover:scale-105 transition-all"
         >
            DONE
         </button>
      </div>

    </div>
  );
};

export default BlocklistCreator;