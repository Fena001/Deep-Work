import React from 'react';
import { Clock, Calendar, Trash2 } from 'lucide-react';

const SessionHistory = ({ history, onClear }) => {
  
  if (!history || history.length === 0) {
    return (
      <div className="bg-forest-panel rounded-xl p-8 border border-white/5 shadow-lg min-h-[300px] flex flex-col items-center justify-center text-forest-muted">
        <p className="text-xl font-medium opacity-60">No sessions in the past week</p>
      </div>
    );
  }

  return (
    <div className="bg-forest-panel rounded-xl border border-white/5 shadow-lg overflow-hidden flex flex-col h-full max-h-[500px]">
      
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-forest-panel">
        <h3 className="text-xl font-bold text-white">Recent Sessions</h3>
        <button 
          onClick={() => {
            if(window.confirm('Clear all history?')) onClear();
          }}
          className="text-xs font-bold text-forest-muted hover:text-red-400 transition flex items-center gap-1"
        >
          <Trash2 size={14} /> CLEAR HISTORY
        </button>
      </div>

      <div className="overflow-y-auto flex-1 p-2">
        <table className="w-full text-left border-collapse">
          <thead className="text-xs text-forest-muted uppercase tracking-wider border-b border-white/5">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {history.map((session) => (
              <tr key={session.id} className="hover:bg-white/5 transition">
                
                <td className="px-4 py-4 text-white flex items-center gap-2">
                  <Calendar size={16} className="text-forest-accent" />
                  {session.date}
                </td>

                <td className="px-4 py-4 text-forest-muted">
                  {session.time}
                </td>

                <td className="px-4 py-4 text-white font-bold flex items-center gap-2">
                  <Clock size={16} className="text-forest-muted" />
                  {session.duration}
                </td>

                <td className="px-4 py-4">
                  <span className="bg-forest-accent/10 text-forest-accent text-xs font-bold px-2 py-1 rounded-full border border-forest-accent/20">
                    {session.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionHistory;