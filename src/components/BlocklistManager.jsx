import React, { useState } from 'react';
import { Shield, Plus, Check, X } from 'lucide-react';

const BlocklistManager = ({ lists, onEdit, onAdd, onRename, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState('');

  const startEditing = (e, list) => {
    e.stopPropagation();
    setEditingId(list.id);
    setTempName(list.name);
  };

  const saveName = (e, id) => {
    e.stopPropagation();
    if (tempName.trim()) {
      onRename(id, tempName);
    }
    setEditingId(null);
  };

  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (e, id, name) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      onDelete(id, name);
    }
  };

  return (
    <div className="mt-8">
      {/* Header Row */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">My Blocklists</h2>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 text-forest-accent font-bold hover:text-white transition"
        >
          ADD BLOCKLIST
          <Plus size={20} className="bg-forest-accent text-forest-dark rounded-full p-0.5" />
        </button>
      </div>

      {/* The List Container */}
      <div className="bg-forest-panel rounded-xl border border-white/5 overflow-hidden">
        {lists.map((list, index) => (
          <div 
            key={list.id} 
            onClick={() => onEdit(list.name)}
            className={`p-6 flex items-center justify-between group hover:bg-white/5 transition cursor-pointer 
              ${index !== lists.length - 1 ? 'border-b border-white/5' : ''} 
            `}
          >
            {/* Left Side: Icon & Name */}
            <div className="flex items-center gap-4 flex-1">
              <Shield className="text-forest-muted" size={24} />
              
              {editingId === list.id ? (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <input 
                    autoFocus
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-white text-forest-dark px-2 py-1 rounded font-bold outline-none"
                  />
                  <button onClick={(e) => saveName(e, list.id)} className="bg-forest-accent p-1 rounded hover:bg-white">
                    <Check size={16} className="text-forest-dark" />
                  </button>
                  <button onClick={cancelEdit} className="bg-red-400 p-1 rounded hover:bg-white">
                    <X size={16} className="text-forest-dark" />
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-bold text-forest-accent">{list.name}</h3>
                  <p className="text-sm text-forest-muted">{list.count}</p>
                </div>
              )}
            </div>

            {/* Right Side: Actions */}
            {editingId !== list.id && (
              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => startEditing(e, list)} 
                  className="text-xs font-bold text-forest-accent hover:text-white tracking-wider"
                >
                  EDIT NAME
                </button>
                
                <button 
                  onClick={(e) => handleDelete(e, list.id, list.name)}
                  className="text-xs font-bold text-red-400 hover:text-white tracking-wider"
                >
                  DELETE LIST
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlocklistManager;