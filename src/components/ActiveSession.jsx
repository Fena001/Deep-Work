import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ActiveSession = ({ duration, onStop }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onStop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onStop]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 bg-[#8bc38d] flex flex-col items-center justify-center text-white z-50 animate-fade-in">
      
      <div className="text-8xl mb-6 opacity-80">🦋</div>
      
      <h1 className="text-4xl font-light mb-4 tracking-wide">Take a deep breath. You are Free.</h1>
      
      <div className="text-2xl font-bold opacity-90 mt-4">
        Time Remaining: {formatTime(timeLeft)}
      </div>

      <button 
        onClick={onStop}
        className="mt-12 text-white/60 hover:text-white border border-white/40 px-6 py-2 rounded-full text-sm transition hover:bg-white/10"
      >
        End Session
      </button>
    </div>
  );
};

export default ActiveSession;