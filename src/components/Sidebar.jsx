import React from 'react';
import { LayoutDashboard, History, Settings, Shield, Plus, Lock } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange, blocklists, onEdit, onAdd }) => {
  
  const menuItems = [
    { id: 'dashboard', label: 'Focus Zone', icon: LayoutDashboard },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-forest-panel border-r border-white/5 flex flex-col p-6 flex-shrink-0">
      
      <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => onTabChange('dashboard')}>
        <div className="w-8 h-8 bg-forest-accent rounded-lg flex items-center justify-center">
          <Shield className="text-forest-dark" size={20} />
        </div>
        <h1 className="text-xl font-bold text-white tracking-wide">Flow State</h1>
      </div>

      <div className="flex flex-col gap-1 mb-10">
        <h3 className="text-xs font-bold text-forest-muted uppercase tracking-wider mb-2 px-2">Menu</h3>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-left ${
                isActive 
                  ? 'bg-forest-accent text-forest-dark font-bold' 
                  : 'text-forest-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-forest-dark' : 'text-forest-muted group-hover:text-white'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-2 mb-2">
           <h3 className="text-xs font-bold text-forest-muted uppercase tracking-wider">My Blocklists</h3>
           <button onClick={onAdd} className="text-forest-muted hover:text-white transition">
             <Plus size={16} />
           </button>
        </div>
        
        <div className="space-y-1">
          {blocklists.map((list) => (
            <button
              key={list.id}
              onClick={() => onEdit(list.name)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-forest-muted hover:bg-white/5 hover:text-white transition text-left group"
            >
              <Lock size={16} className="text-forest-muted group-hover:text-forest-accent" />
              <span className="truncate">{list.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-forest-muted/20 border border-white/10 flex items-center justify-center text-xs font-bold text-forest-text">
            ME
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white truncate">My Workspace</span>
            <span className="text-xs text-forest-muted">Pro Plan</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;