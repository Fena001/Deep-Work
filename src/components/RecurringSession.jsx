import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Repeat } from 'lucide-react';

// --- Reusable Time Picker Helper Components ---
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
      <button onClick={increment} className="text-forest-accent hover:text-white"><ChevronUp size={16}/></button>
      <div className="bg-forest-dark/40 text-forest-text font-bold text-xl w-12 h-10 flex items-center justify-center rounded border border-white/5">
        {value}
      </div>
      <button onClick={decrement} className="text-forest-accent hover:text-white"><ChevronDown size={16}/></button>
    </div>
  );
};

const AmPmPicker = ({ value, onChange }) => {
  const toggle = () => onChange(value === 'am' ? 'pm' : 'am');
  return (
    <div className="flex flex-col items-center gap-1">
      <button onClick={toggle} className="text-forest-accent hover:text-white"><ChevronUp size={16}/></button>
      <div className="bg-forest-dark/40 text-forest-text font-bold text-lg w-12 h-10 flex items-center justify-center rounded border border-white/5 uppercase">
        {value}
      </div>
      <button onClick={toggle} className="text-forest-accent hover:text-white"><ChevronDown size={16}/></button>
    </div>
  );
};

// --- Main Component ---
const RecurringSession = () => {
  const [name, setName] = useState('');
  const [start, setStart] = useState({ h: '01', m: '00', p: 'am' });
  const [end, setEnd] = useState({ h: '02', m: '00', p: 'am' });
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-forest-panel/50 rounded-lg p-6 mb-6 border border-white/5 animate-fade-in">
      
      {/* Name Input */}
      <div className="flex items-center gap-4 mb-8">
        <label className="text-white font-medium w-16 text-right">Name</label>
        <input 
          type="text" 
          placeholder="My schedule" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-white/10 text-white p-3 rounded border border-white/10 focus:outline-none focus:border-forest-accent transition"
        />
      </div>

      {/* Time Pickers */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
        {/* Start Group */}
        <div className="flex items-center gap-2">
          <span className="text-white font-medium mr-2">Starts</span>
          <TimePickerColumn value={start.h} max={12} onChange={(v)=>setStart({...start, h:v})} />
          <span className="text-white text-xl pb-4">:</span>
          <TimePickerColumn value={start.m} max={59} onChange={(v)=>setStart({...start, m:v})} />
          <span className="text-white text-xl pb-4">:</span>
          <AmPmPicker value={start.p} onChange={(v)=>setStart({...start, p:v})} />
        </div>

        {/* End Group */}
        <div className="flex items-center gap-2">
          <span className="text-white font-medium mr-2">Ends</span>
          <TimePickerColumn value={end.h} max={12} onChange={(v)=>setEnd({...end, h:v})} />
          <span className="text-white text-xl pb-4">:</span>
          <TimePickerColumn value={end.m} max={59} onChange={(v)=>setEnd({...end, m:v})} />
          <span className="text-white text-xl pb-4">:</span>
          <AmPmPicker value={end.p} onChange={(v)=>setEnd({...end, p:v})} />
        </div>
      </div>

      {/* Info Row */}
      <div className="flex justify-between items-center text-xs text-forest-muted border-b border-white/10 pb-6 mb-6">
        <a href="#" className="hover:text-forest-accent underline decoration-forest-accent/50">Timezone: Asia/Kolkata</a>
        <div className="flex items-center gap-2 font-bold text-white">
          <Repeat size={14} />
          <span>Recurring session will run for 1 hour a day</span>
        </div>
      </div>

      {/* Days Selector */}
      <div className="mb-8">
        <span className="text-white font-medium block mb-3">Repeats</span>
        <div className="flex justify-between items-center bg-forest-dark/30 p-1 rounded-lg">
          {days.map(day => (
            <label key={day} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white/5 rounded transition">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                selectedDays.includes(day) ? 'bg-forest-muted border-forest-muted' : 'border-gray-600'
              }`}>
                {selectedDays.includes(day) && <div className="w-2 h-2 bg-forest-dark"></div>}
              </div>
              <span className="text-lg text-white">{day}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center mb-2">
        <button className="bg-forest-accent hover:bg-forest-hover text-white font-bold py-3 px-10 rounded shadow-lg transition tracking-wide">
          SAVE SESSION
        </button>
      </div>

    </div>
  );
};

export default RecurringSession;