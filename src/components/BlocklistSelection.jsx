import React from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';

// Added 'lists' to props
const BlocklistSelection = ({ lists, selected, toggle }) => {
  
  // Combine "All Websites" with your dynamic lists
  const displayItems = [
    { id: 'all', name: 'All Websites' }, 
    ...lists // This spreads your dynamic blocklists (Distractions, Practice, etc.)
  ];

  return (
    <div className="bg-forest-dark/30 rounded-lg p-6 border border-white/5 h-full">
      <h3 className="text-sm font-semibold text-forest-text mb-4">Block these distractions:</h3>

      {/* Warning Message */}
      {selected.length === 0 && (
        <div className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-400/10 p-2 rounded">
          <AlertCircle size={16} />
          <span>Please select at least one list</span>
        </div>
      )}

      {/* Checkbox List */}
      <div className="space-y-3">
        {displayItems.map((item) => (
          <div key={item.name} className="flex items-center justify-between group">
            <label 
              onClick={() => toggle(item.name)}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                selected.includes(item.name) 
                  ? 'bg-forest-accent border-forest-accent' 
                  : 'border-forest-muted group-hover:border-white'
              }`}>
                {/* Checkmark Icon */}
                {selected.includes(item.name) && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                )}
              </div>
              <span className="text-lg text-forest-text">{item.name}</span>
            </label>
            
            {/* Help Icon only for All Websites */}
            {item.name === 'All Websites' && <HelpCircle size={16} className="text-forest-muted cursor-help" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlocklistSelection;