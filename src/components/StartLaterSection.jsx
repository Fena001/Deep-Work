import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, CalendarClock, Trash2, Plus, Check } from 'lucide-react';

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

const StartLaterSection = ({ blocklists }) => { 
  const [localSelected, setLocalSelected] = useState([]);

  const loadSaved = (key, def) => {
    const saved = JSON.parse(localStorage.getItem("flow_start_later_config") || "{}");
    return saved[key] || def;
  };

  const [name, setName] = useState('');
  const [startH, setStartH] = useState(() => loadSaved('startH', '10'));
  const [startM, setStartM] = useState(() => loadSaved('startM', '00'));
  const [startP, setStartP] = useState(() => loadSaved('startP', 'AM'));
  const [endH, setEndH] = useState(() => loadSaved('endH', '11'));
  const [endM, setEndM] = useState(() => loadSaved('endM', '00'));
  const [endP, setEndP] = useState(() => loadSaved('endP', 'AM'));

  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const config = { startH, startM, startP, endH, endM, endP };
    localStorage.setItem("flow_start_later_config", JSON.stringify(config));
  }, [startH, startM, startP, endH, endM, endP]);

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      const fetchSessions = () => {
        chrome.storage.local.get(["scheduledSessions"], (data) => {
          if (data.scheduledSessions) {
            const list = Object.entries(data.scheduledSessions).map(([id, val]) => ({ id, ...val }));
            setUpcomingSessions(list);
          } else {
             setUpcomingSessions([]);
          }
        });
      };
      fetchSessions();
      const interval = setInterval(fetchSessions, 2000);
      return () => clearInterval(interval);
    }
  }, [isSaved]); 

  const toggleList = (listName) => {
    if (localSelected.includes(listName)) {
        setLocalSelected(prev => prev.filter(l => l !== listName));
    } else {
        setLocalSelected(prev => [...prev, listName]);
    }
  };

  const handleSchedule = () => {
    if (!name.trim()) { alert("Please name your session."); return; }
    if (localSelected.length === 0) { alert("Please select a blocklist below."); return; }

    const getNextDate = (h, m, p) => {
        const date = new Date();
        let hours = parseInt(h);
        if (p === 'PM' && hours !== 12) hours += 12;
        if (p === 'AM' && hours === 12) hours = 0;
        date.setHours(hours, parseInt(m), 0, 0);
        if (date < new Date()) date.setDate(date.getDate() + 1);
        return date;
    };

    const now = new Date();
    const startTime = getNextDate(startH, startM, startP);
    const endTime = getNextDate(endH, endM, endP);

    if (endTime < startTime) endTime.setDate(endTime.getDate() + 1);
    const delayMinutes = (startTime - now) / 1000 / 60;
    const durationMinutes = (endTime - startTime) / 1000 / 60;

    if (delayMinutes < 0) { alert("Please select a future time."); return; }

    let sitesToBlock = [];
    if (localSelected.includes("All Websites")) {
      sitesToBlock = ["*"]; 
    } else {
      blocklists.forEach(list => {
        if (localSelected.includes(list.name)) sitesToBlock = [...sitesToBlock, ...list.sites];
      });
    }

    const sessionID = Date.now().toString();
    const timeDisplay = `${startH}:${startM} ${startP} - ${endH}:${endM} ${endP}`;

    if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.sendMessage({ 
            action: "SCHEDULE_SESSION", 
            id: sessionID,
            name: name,             
            timeDisplay: timeDisplay,
            delayMinutes: Math.max(0.1, delayMinutes), 
            durationMinutes: durationMinutes,
            sites: sitesToBlock
        });
    }

    setName('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCancel = (id) => {
    if (confirm("Cancel this session?")) {
        chrome.runtime.sendMessage({ action: "CANCEL_SCHEDULED_SESSION", id });
        setUpcomingSessions(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="bg-forest-dark/30 p-6 rounded-xl border border-white/5 mb-8">
        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <Plus size={18} className="text-forest-accent" /> Schedule New Session
        </h3>

        <div className="flex items-center gap-4 mb-6">
            <input 
              type="text" 
              placeholder="Session Name (e.g. Deep Work)" 
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

        <button onClick={handleSchedule} disabled={isSaved} className={`w-full py-3 rounded-lg font-bold shadow-lg transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-forest-accent hover:bg-forest-hover text-white'}`}>
            {isSaved ? "SCHEDULED!" : "SCHEDULE SESSION"}
        </button>
      </div>

      {upcomingSessions.length > 0 && (
          <div>
            <h3 className="text-white font-bold mb-4 px-2 flex items-center gap-2"><CalendarClock size={16}/> Upcoming Queued Sessions</h3>
            <div className="space-y-3">
                {upcomingSessions.map(session => (
                    <div key={session.id} className="bg-forest-panel border border-white/5 p-4 rounded-lg flex justify-between items-center group">
                        <div>
                            <div className="text-white font-bold text-lg">{session.name}</div>
                            <div className="text-forest-muted text-sm font-medium">{session.timeDisplay || "Scheduled"}</div>
                        </div>
                        <button onClick={() => handleCancel(session.id)} className="text-forest-muted hover:text-red-400 p-2 transition"><Trash2 size={18} /></button>
                    </div>
                ))}
            </div>
          </div>
      )}
    </div>
  );
};

export default StartLaterSection;