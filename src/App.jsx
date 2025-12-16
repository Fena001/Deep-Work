import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TimerSection from './components/TimerSection';
import StartLaterSection from './components/StartLaterSection'; 
import BlocklistSelection from './components/BlocklistSelection';
import FocusSounds from './components/FocusSounds';
import BlocklistManager from './components/BlocklistManager';
import ActiveSession from './components/ActiveSession';
import BlocklistEditor from './components/BlocklistEditor';
import BlocklistCreator from './components/BlocklistCreator';
import { Plus, X } from 'lucide-react';
import RecurringSession from './components/RecurringSession';
import SessionHistory from './components/SessionHistory'; 

function App() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('now'); 
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [mainView, setMainView] = useState('dashboard'); 

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const totalMinutes = (parseInt(hours) * 60) + parseInt(minutes);

  const [selectedBlocklists, setSelectedBlocklists] = useState([]);
  const [blocklists, setBlocklists] = useState([
    { id: 1, name: 'Distractions', count: '4 category filters, 1 custom filter' },
  ]);

  // --- HANDLERS ---
  const toggleBlocklist = (name) => {
    if (selectedBlocklists.includes(name)) {
      setSelectedBlocklists(prev => prev.filter(item => item !== name));
    } else {
      setSelectedBlocklists(prev => [...prev, name]);
    }
  };

  const handleSaveList = (name, count) => {
    const newList = { id: Date.now(), name: name, count: count };
    setBlocklists([...blocklists, newList]);
    setIsCreating(false);
  };

  const handleRenameList = (id, newName) => {
    const oldName = blocklists.find(list => list.id === id)?.name;
    
    // Update main list
    setBlocklists(blocklists.map(list => list.id === id ? { ...list, name: newName } : list));
    
    // Update selection
    if (selectedBlocklists.includes(oldName)) {
      setSelectedBlocklists(prev => prev.map(name => name === oldName ? newName : name));
    }
    
    // Update editor view if open
    if (editingList === oldName) {
      setEditingList(newName);
    }
  };

  const handleDeleteList = (id, name) => {
    setBlocklists(prev => prev.filter(list => list.id !== id));
    if (selectedBlocklists.includes(name)) {
      setSelectedBlocklists(prev => prev.filter(item => item !== name));
    }
    if (editingList === name) {
      setEditingList(null);
    }
  };

  // --- FULL SCREEN VIEWS ---
  if (isSessionActive) return <ActiveSession duration={totalMinutes} onStop={() => setIsSessionActive(false)} />;
  if (isCreating) return <div className="min-h-screen bg-forest-dark flex justify-center p-8 font-sans"><BlocklistCreator onSave={handleSaveList} onCancel={() => setIsCreating(false)} /></div>;
  
  if (editingList) {
    return (
      <div className="min-h-screen bg-forest-dark flex justify-center p-8 font-sans">
        <BlocklistEditor 
          listName={editingList} 
          onBack={() => setEditingList(null)} 
        />
      </div>
    );
  }

  // --- MAIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-forest-dark flex justify-center p-8 font-sans">
      <div className="w-full max-w-[1000px]">
        
        <Navbar activeTab={mainView} onTabChange={setMainView} />

        {/* VIEW 1: DASHBOARD (Flow State) */}
        {mainView === 'dashboard' && (
          <>
            {/* Main Card */}
            <div className="bg-forest-panel rounded-xl p-8 border border-white/5 shadow-lg mb-8">
               
               {/* Sub-Tabs */}
               <div className="flex gap-6 mb-8 border-b border-white/10">
                  <button onClick={() => setActiveTab('now')} className={`pb-2 font-bold transition ${activeTab === 'now' ? 'border-b-2 border-white text-white' : 'text-forest-muted hover:text-white'}`}>Start now</button>
                  <button onClick={() => setActiveTab('later')} className={`pb-2 font-bold transition ${activeTab === 'later' ? 'border-b-2 border-white text-white' : 'text-forest-muted hover:text-white'}`}>Start later</button>
                  <button onClick={() => setActiveTab('recurring')} className={`pb-2 font-bold transition ${activeTab === 'recurring' ? 'border-b-2 border-white text-white' : 'text-forest-muted hover:text-white'}`}>Recurring session</button>
               </div>

               {/* Conditional Content */}
               {activeTab === 'now' ? (
                 <TimerSection 
                    hours={hours} minutes={minutes} 
                    setHours={setHours} setMinutes={setMinutes}
                    onStart={() => {
                      if (selectedBlocklists.length === 0) {
                        alert("Please select at least one blocklist!");
                        return;
                      }
                      setIsSessionActive(true);
                    }} 
                 />
               ) : activeTab === 'later' ? (
                 <StartLaterSection />
               ) : (
                  <RecurringSession />
               )}

               {/* Middle Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <BlocklistSelection 
                    lists={blocklists} 
                    selected={selectedBlocklists} 
                    toggle={toggleBlocklist} 
                  />
                  <FocusSounds />
               </div>
               
            </div>

            <BlocklistManager 
              lists={blocklists} 
              onEdit={(name) => setEditingList(name)} 
              onAdd={() => setIsCreating(true)} 
              onRename={handleRenameList}
              onDelete={handleDeleteList}
            />
          </>
        )}

        {/* VIEW 2: SESSION HISTORY */}
        {mainView === 'history' && (
          <SessionHistory />
        )}

      </div>
    </div>
  );
}

export default App;