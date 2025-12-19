import React from 'react';

const TimerSection = ({ hours, minutes, setHours, setMinutes, onStart }) => {
  return (
    <div className="bg-forest-panel/50 rounded-lg p-6 mb-6 flex flex-col md:flex-row items-center justify-center gap-6 border border-white/5">
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="0"
            min="0"
            value={hours} 
            onChange={(e) => setHours(e.target.value)} 
            className="w-20 h-16 text-4xl font-bold text-center text-forest-dark bg-white rounded-md focus:outline-none focus:ring-4 focus:ring-forest-accent"
            />
          <span className="text-forest-muted font-medium">hours</span>
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="number" 
            min="0"
            value={minutes} 
            onChange={(e) => setMinutes(e.target.value)} 
            className="w-20 h-16 text-4xl font-bold text-center text-forest-dark bg-white rounded-md focus:outline-none focus:ring-4 focus:ring-forest-accent"
            />
          <span className="text-forest-muted font-medium">minutes</span>
        </div>
      </div>

        <button 
        onClick={onStart} 
        className="bg-forest-accent hover:bg-forest-hover text-white text-xl font-bold py-4 px-10 rounded-md shadow-lg transform active:scale-95 transition-all"
        >
        START
        </button>

    </div>
  );
};

export default TimerSection;