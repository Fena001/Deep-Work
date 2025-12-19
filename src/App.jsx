import React, { useState, useEffect } from 'react'; 
import Sidebar from './components/Sidebar';
import TimerSection from './components/TimerSection';
import StartLaterSection from './components/StartLaterSection'; 
import BlocklistSelection from './components/BlocklistSelection';
import FocusSounds from './components/FocusSounds';
import ActiveSession from './components/ActiveSession';
import BlocklistEditor from './components/BlocklistEditor';
import BlocklistCreator from './components/BlocklistCreator';
import RecurringSession from './components/RecurringSession';
import SessionHistory from './components/SessionHistory'; 
import Settings from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('now'); 
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [mainView, setMainView] = useState('dashboard'); 

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const totalMinutes = (parseInt(hours) * 60) + parseInt(minutes);

  const [selectedBlocklists, setSelectedBlocklists] = useState([]);
  
  const [userSettings, setUserSettings] = useState(() => {
    const saved = localStorage.getItem("flow_settings");
    return saved ? JSON.parse(saved) : { soundEnabled: true, notifyEnabled: false, theme: 'ocean' };
  });

  useEffect(() => {
    localStorage.setItem("flow_settings", JSON.stringify(userSettings));
    
    document.body.className = ''; 
    if (userSettings.theme !== 'ocean') {
      document.body.classList.add(`theme-${userSettings.theme}`);
    }
  }, [userSettings]);

  const toggleSetting = (key) => {
    setUserSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setTheme = (themeName) => {
    setUserSettings(prev => ({ ...prev, theme: themeName }));
  };

  const [blocklists, setBlocklists] = useState(() => {
    const saved = localStorage.getItem("flow_blocklists");
    if (saved) return JSON.parse(saved);
    return [{ 
      id: 1, 
      name: 'Distractions', 
      count: '0 sites', 
      sites: [] 
    }];
  });

  useEffect(() => {
    localStorage.setItem("flow_blocklists", JSON.stringify(blocklists));
  }, [blocklists]);

  const [sessionHistory, setSessionHistory] = useState([]);

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(["flow_history"], (result) => {
        if (result.flow_history) {
          setSessionHistory(result.flow_history);
        }
      });
    } else {
      const saved = localStorage.getItem("flow_history");
      if (saved) setSessionHistory(JSON.parse(saved));
    }
  }, []);

  const addToHistory = (minutes) => {
    setSessionHistory(prev => {
      if (prev.length > 0) {
        const lastSession = prev[0];
        if ((Date.now() - lastSession.id) < 2000) return prev;
      }

      const newSession = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: `${minutes} min`,
        status: 'Completed',
        blocklist: selectedBlocklists.join(", ") || "Focus Mode"
      };

      const updatedList = [newSession, ...prev];

      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
         chrome.storage.local.set({ flow_history: updatedList });
      }
      
      localStorage.setItem("flow_history", JSON.stringify(updatedList));

      return updatedList;
    });  };

  const toggleBlocklist = (name) => {
    if (selectedBlocklists.includes(name)) {
      setSelectedBlocklists(prev => prev.filter(item => item !== name));
    } else {
      setSelectedBlocklists(prev => [...prev, name]);
    }
  };

  const handleSaveList = (name, count, initialSites) => {
    const newList = { 
      id: Date.now(), 
      name: name, 
      count: count, 
      sites: initialSites || [] 
    };
    setBlocklists([...blocklists, newList]);
    setIsCreating(false);
  };

  const handleUpdateSites = (listName, newSites) => {
    setBlocklists(prev => prev.map(list => {
      if (list.name === listName) {
        return { ...list, sites: newSites, count: `${newSites.length} sites` };
      }
      return list;
    }));
  };

  const handleRenameList = (id, newName) => {
    const oldName = blocklists.find(list => list.id === id)?.name;
    setBlocklists(blocklists.map(list => list.id === id ? { ...list, name: newName } : list));
    if (selectedBlocklists.includes(oldName)) {
      setSelectedBlocklists(prev => prev.map(name => name === oldName ? newName : name));
    }
    if (editingList === oldName) setEditingList(newName);
  };

  const handleDeleteList = (id, name) => {
    setBlocklists(prev => prev.filter(list => list.id !== id));
    if (selectedBlocklists.includes(name)) {
      setSelectedBlocklists(prev => prev.filter(item => item !== name));
    }
    if (editingList === name) setEditingList(null);
  };

  if (isSessionActive) {
    return <ActiveSession 
      duration={totalMinutes} 
      onStop={() => {
        if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
          chrome.runtime.sendMessage({ action: "STOP_SESSION" });
        }
        
        if (userSettings.notifyEnabled) {
             new Notification("Session Complete!", {
               body: "Great job! You stayed focused.",
               icon: "/icon.png" 
             });
        }

        addToHistory(totalMinutes);
        setIsSessionActive(false);
      }} 
    />;
  }
  
  if (isCreating) return <div className="min-h-screen bg-forest-dark flex justify-center p-8 font-sans"><BlocklistCreator onSave={handleSaveList} onCancel={() => setIsCreating(false)} /></div>;
  
  if (editingList) {
    const activeList = blocklists.find(l => l.name === editingList);
    if (!activeList) { setEditingList(null); return null; }

    return (
      <div className="min-h-screen bg-forest-dark flex justify-center p-8 font-sans">
        <BlocklistEditor 
          key={editingList} 
          listName={editingList} 
          initialSites={activeList.sites} 
          onUpdateSites={(newSites) => handleUpdateSites(editingList, newSites)} 
          onBack={() => setEditingList(null)} 
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-forest-dark font-sans transition-colors duration-300">
      
      <Sidebar 
        activeTab={mainView} 
        onTabChange={setMainView}
        blocklists={blocklists}           
        onEdit={(name) => setEditingList(name)} 
        onAdd={() => setIsCreating(true)}       
      />

      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-[1000px] mx-auto">
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {mainView === 'dashboard' ? 'Flow State' : mainView === 'history' ? 'Session History' : 'Settings'}
            </h2>
          </div>

          {mainView === 'dashboard' && (
            <div className="bg-forest-panel rounded-xl p-8 border border-white/5 shadow-lg mb-8">
                
                <div className="flex gap-6 mb-8 border-b border-white/10">
                  <button onClick={() => setActiveTab('now')} className={`pb-2 font-bold transition ${activeTab === 'now' ? 'border-b-2 border-white text-white' : 'text-forest-muted hover:text-white'}`}>Start now</button>
                  <button onClick={() => setActiveTab('later')} className={`pb-2 font-bold transition ${activeTab === 'later' ? 'border-b-2 border-white text-white' : 'text-forest-muted hover:text-white'}`}>Start later</button>
                  <button onClick={() => setActiveTab('recurring')} className={`pb-2 font-bold transition ${activeTab === 'recurring' ? 'border-b-2 border-white text-white' : 'text-forest-muted hover:text-white'}`}>Recurring session</button>
                </div>

                {activeTab === 'now' ? (
                  <TimerSection 
                    hours={hours} minutes={minutes} 
                    setHours={setHours} setMinutes={setMinutes}
                    onStart={() => {
                      if (selectedBlocklists.length === 0) {
                        alert("Please select at least one blocklist!");
                        return;
                      }

                      let sitesToBlock = [];
                      if (selectedBlocklists.includes("All Websites")) {
                        sitesToBlock = ["*"]; 
                      } else {
                        blocklists.forEach(list => {
                          if (selectedBlocklists.includes(list.name)) {
                            sitesToBlock = [...sitesToBlock, ...list.sites];
                          }
                        });
                      }
                      
                      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
                        chrome.runtime.sendMessage({ action: "START_SESSION", sites: sitesToBlock });
                      }
                      setIsSessionActive(true);
                    }} 
                  />
                ) : activeTab === 'later' ? (
                  <StartLaterSection 
                    blocklists={blocklists} 
                  />
                ) : (
                  <RecurringSession 
                    blocklists={blocklists} 
                  />
                )}

                {activeTab === 'now' && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <BlocklistSelection 
                          lists={blocklists} 
                          selected={selectedBlocklists} 
                          toggle={toggleBlocklist} 
                      />
                      <FocusSounds />
                   </div>
                )}
            </div>
          )}

          {mainView === 'history' && (
            <SessionHistory 
              history={sessionHistory} 
              onClear={() => setSessionHistory([])} 
            />
          )}
          
          {mainView === 'settings' && (
            <Settings 
                currentTheme={userSettings.theme}
                onSetTheme={setTheme}
                settings={userSettings}
                onToggleSetting={toggleSetting}
                onReset={() => {
                    if(window.confirm("Are you sure? This deletes all data.")) {
                        localStorage.clear();
                        window.location.reload();
                    }
                }}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default App;