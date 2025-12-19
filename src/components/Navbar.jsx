import React from 'react';

const Navbar = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-8 mb-8 border-b border-forest-panel pb-1">
      <button 
        onClick={() => onTabChange('dashboard')}
        className={`pb-2 transition-colors font-bold text-xl outline-none ${
          activeTab === 'dashboard' 
            ? 'border-b-2 border-forest-accent text-white' 
            : 'text-forest-muted hover:text-white'
        }`}
      >
        Flow State
      </button>
      
      <button 
        onClick={() => onTabChange('history')}
        className={`pb-2 transition-colors font-bold text-xl outline-none ${
          activeTab === 'history' 
            ? 'border-b-2 border-forest-accent text-white' 
            : 'text-forest-muted hover:text-white'
        }`}
      >
        Session History
      </button>
    </div>
  );
};

export default Navbar;