import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const TimePickerColumn = ({ value, onChange, max }) => {
  const increment = () => {
    let newVal = parseInt(value) + 1;
    if (newVal > max) newVal = 0; // Wrap around
    onChange(newVal.toString().padStart(2, '0'));
  };

  const decrement = () => {
    let newVal = parseInt(value) - 1;
    if (newVal < 0) newVal = max; // Wrap around
    onChange(newVal.toString().padStart(2, '0'));
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button onClick={increment} className="text-forest-accent hover:text-white transition">
        <ChevronUp size={20} />
      </button>
      <div className="bg-white/10 text-white font-bold text-2xl w-16 h-14 flex items-center justify-center rounded">
        {value}
      </div>
      <button onClick={decrement} className="text-forest-accent hover:text-white transition">
        <ChevronDown size={20} />
      </button>
    </div>
  );
};

const AmPmPicker = ({ value, onChange }) => {
  const toggle = () => onChange(value === 'am' ? 'pm' : 'am');
  return (
    <div className="flex flex-col items-center gap-1">
      <button onClick={toggle} className="text-forest-accent hover:text-white transition"><ChevronUp size={20}/></button>
      <div className="bg-white/10 text-white font-bold text-xl w-16 h-14 flex items-center justify-center rounded uppercase">
        {value}
      </div>
      <button onClick={toggle} className="text-forest-accent hover:text-white transition"><ChevronDown size={20}/></button>
    </div>
  );
};

const StartLaterSection = () => {
  // Simple state for UI demo
  const [start, setStart] = useState({ h: '01', m: '00', p: 'am' });
  const [end, setEnd] = useState({ h: '02', m: '00', p: 'am' });

  return (
    <div className="bg-forest-panel/50 rounded-lg p-6 mb-6 border border-white/5">
      
      {/* Time Pickers Container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
        
        {/* Start Time Group */}
        <div className="flex items-center gap-4">
          <span className="text-white font-medium mr-2">Starts</span>
          <TimePickerColumn value={start.h} max={12} onChange={(v)=>setStart({...start, h:v})} />
          <span className="text-white text-2xl pb-4">:</span>
          <TimePickerColumn value={start.m} max={59} onChange={(v)=>setStart({...start, m:v})} />
          <span className="text-white text-2xl pb-4">:</span>
          <AmPmPicker value={start.p} onChange={(v)=>setStart({...start, p:v})} />
        </div>

        {/* End Time Group */}
        <div className="flex items-center gap-4">
          <span className="text-white font-medium mr-2">Ends</span>
          <TimePickerColumn value={end.h} max={12} onChange={(v)=>setEnd({...end, h:v})} />
          <span className="text-white text-2xl pb-4">:</span>
          <TimePickerColumn value={end.m} max={59} onChange={(v)=>setEnd({...end, m:v})} />
          <span className="text-white text-2xl pb-4">:</span>
          <AmPmPicker value={end.p} onChange={(v)=>setEnd({...end, p:v})} />
        </div>

        {/* Save Button */}
        <button className="bg-forest-accent hover:bg-forest-hover text-white font-bold py-4 px-8 rounded shadow-lg transition mt-4 md:mt-0">
          SAVE
        </button>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center text-sm border-t border-white/10 pt-4">
        <a href="#" className="text-forest-accent hover:underline decoration-forest-accent">
          Timezone: Asia/Kolkata
        </a>
        <span className="text-white font-medium">The session will last for 1 hour</span>
      </div>

    </div>
  );
};

export default StartLaterSection;