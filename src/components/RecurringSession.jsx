import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Check, Repeat, Trash2, Plus } from 'lucide-react';

const TimePickerColumn = ({ value, onChange, max }) => {
  const increment = () => {
    let newVal = parseInt(value) + 1;
    if (newVal > max) newVal = 0;
    onChange(newVal.toString().padStart(2, '0'));
  };
  const decrement = () => {
    let newVal = parseInt(value) - 1;
    if (newVal < 0) newVal = max;
    onChange(newVal.toString().padStart(2, '0'));
  };
  return (
    <div className="flex flex-col items-center gap-1">
      <button onClick={increment} className="text-forest-accent hover:text-white transition"><ChevronUp size={16}/></button>
      <div className="bg-forest-dark/40 text-forest-text font-bold text-xl w-12 h-10 flex items-center justify-center rounded border border-white/5">{value}</div>
      <button onClick={decrement} className="text-forest-accent hover:text-white transition"><ChevronDown size={16}/></button>
    </div>
  );
};

const AmPmPicker = ({ value, onChange }) => {
  const toggle = () => onChange(value === 'AM' ? 'PM' : 'AM');
  return (
    <div className="flex flex-col items-center gap-1">
      <button onClick={toggle} className="text-forest-accent hover:text-white transition"><ChevronUp size={16}/></button>
      <div className="bg-forest-dark/40 text-forest-text font-bold text-lg w-12 h-10 flex items-center justify-center rounded border border-white/5 uppercase">{value}</div>
      <button onClick={toggle} className="text-forest-accent hover:text-white transition"><ChevronDown size={16}/></button>
    </div>
  );
};

const RecurringSession = ({ blocklists }) => { 
  const [localSelected, setLocalSelected] = useState([]);

  const [name, setName] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [startH, setStartH] = useState('09');
  const [startM, setStartM] = useState('00');
  const [startP, setStartP] = useState('AM');
  const [endH, setEndH] = useState('05');
  const [endM, setEndM] = useState('00');
  const [endP, setEndP] = useState('PM');

  const [mySessions, setMySessions] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["recurringSessions"], (data) => {
        if (data.recurringSessions) setMySessions(data.recurringSessions);
      });
    }
  }, [isSaved]);

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) setSelectedDays(prev => prev.filter(d => d !== day));
    else setSelectedDays(prev => [...prev, day]);
  };

  const toggleList = (listName) => {
    if (localSelected.includes(listName)) {
        setLocalSelected(prev => prev.filter(l => l !== listName));
    } else {
        setLocalSelected(prev => [...prev, listName]);
    }
  };

  const handleAddSession = () => {
    if (!name.trim()) { alert("Please enter a name."); return; }
    if (selectedDays.length === 0) { alert("Select at least one day."); return; }
    if (localSelected.length === 0) { alert("Select a blocklist below."); return; }

    let sitesToBlock = [];
    if (localSelected.includes("All Websites")) {
      sitesToBlock = ["*"];
    } else {
      blocklists.forEach(list => {
        if (localSelected.includes(list.name)) sitesToBlock = [...sitesToBlock, ...list.sites];
      });
    }

    const newSession = {
        id: Date.now().toString(),
        name,
        days: selectedDays,
        startTime: { h: startH, m: startM, p: startP },
        endTime: { h: endH, m: endM, p: endP },
        sites: sitesToBlock,
        active: true
    };

    if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.sendMessage({ action: "ADD_RECURRING_SESSION", schedule: newSession });
    }

    setMySessions([...mySessions, newSession]);
    setName('');
    setSelectedDays([]);
    setLocalSelected([]); 
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this schedule?")) {
      chrome.runtime.sendMessage({ action: "DELETE_RECURRING_SESSION", id });
      setMySessions(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="bg-forest-dark/30 p-6 rounded-xl border border-white/5 mb-8">
        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <Plus size={18} className="text-forest-accent" /> Create New Schedule
        </h3>
        
        <div className="flex items-center gap-4 mb-6">
            <input 
            type="text" 
            placeholder="e.g. Morning Focus" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 text-white p-3 rounded border border-white/10 focus:outline-none focus:border-forest-accent transition font-medium"
            />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
            <div className="flex items-center gap-2">
            <span className="text-white text-xs uppercase opacity-70">Starts</span>
            <TimePickerColumn value={startH} max={12} onChange={setStartH} />
            <span className="text-white">:</span>
            <TimePickerColumn value={startM} max={59} onChange={setStartM} />
            <AmPmPicker value={startP} onChange={setStartP} />
            </div>
            <div className="flex items-center gap-2">
            <span className="text-white text-xs uppercase opacity-70">Ends</span>
            <TimePickerColumn value={endH} max={12} onChange={setEndH} />
            <span className="text-white">:</span>
            <TimePickerColumn value={endM} max={59} onChange={setEndM} />
            <AmPmPicker value={endP} onChange={setEndP} />
            </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-6">
            {days.map(day => (
                <div key={day} onClick={() => toggleDay(day)} className={`cursor-pointer px-3 py-1 rounded text-sm font-bold transition ${selectedDays.includes(day) ? 'bg-forest-accent text-white' : 'bg-white/5 text-forest-muted hover:text-white'}`}>
                    {day}
                </div>
            ))}
        </div>

        <div className="mb-6">
            <h4 className="text-white text-sm font-bold mb-3">Block these distractions:</h4>
            <div className="space-y-2">
                <div 
                    onClick={() => toggleList("All Websites")}
                    className={`flex items-center gap-3 p-3 rounded cursor-pointer border transition-all ${localSelected.includes("All Websites") ? 'bg-forest-accent/20 border-forest-accent' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${localSelected.includes("All Websites") ? 'bg-forest-accent border-forest-accent' : 'border-forest-muted'}`}>
                        {localSelected.includes("All Websites") && <Check size={14} className="text-forest-dark" strokeWidth={4} />}
                    </div>
                    <span className="text-white font-medium">All Websites</span>
                </div>

                {blocklists.map(list => (
                    <div 
                        key={list.id} 
                        onClick={() => toggleList(list.name)}
                        className={`flex items-center gap-3 p-3 rounded cursor-pointer border transition-all ${localSelected.includes(list.name) ? 'bg-forest-accent/20 border-forest-accent' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                    >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${localSelected.includes(list.name) ? 'bg-forest-accent border-forest-accent' : 'border-forest-muted'}`}>
                            {localSelected.includes(list.name) && <Check size={14} className="text-forest-dark" strokeWidth={4} />}
                        </div>
                        <span className="text-white font-medium">{list.name}</span>
                        <span className="text-forest-muted text-xs">({list.count})</span>
                    </div>
                ))}
            </div>
        </div>

        <button onClick={handleAddSession} disabled={isSaved} className={`w-full py-3 rounded-lg font-bold shadow-lg transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-forest-accent hover:bg-forest-hover text-white'}`}>
            {isSaved ? "ADDED!" : "ADD SCHEDULE"}
        </button>
      </div>

      {mySessions.length > 0 && (
          <div>
            <h3 className="text-white font-bold mb-4 px-2">Your Weekly Schedules</h3>
            <div className="space-y-3">
                {mySessions.map(session => (
                    <div key={session.id} className="bg-forest-panel border border-white/5 p-4 rounded-lg flex justify-between items-center group">
                        <div>
                            <div className="text-white font-bold text-lg">{session.name}</div>
                            <div className="text-forest-muted text-sm">
                                {session.startTime.h}:{session.startTime.m} {session.startTime.p} - {session.endTime.h}:{session.endTime.m} {session.endTime.p}
                            </div>
                            <div className="text-forest-accent text-xs font-bold mt-1">
                                {session.days.join(", ")}
                            </div>
                        </div>
                        <button onClick={() => handleDelete(session.id)} className="text-forest-muted hover:text-red-400 p-2 transition">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
          </div>
      )}
    </div>
  );
};

export default RecurringSession;