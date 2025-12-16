import React from 'react';

const SessionHistory = () => {
  return (
    <div className="bg-forest-panel rounded-xl p-8 border border-white/5 shadow-lg min-h-[300px] flex flex-col">
      {/* Empty State Message */}
      <div className="flex-1 flex flex-col items-center justify-center text-forest-muted">
        <p className="text-xl font-medium opacity-60">No sessions in the past week</p>
      </div>

      {/* Bottom Border Line (Visual detail from screenshot) */}
      <div className="border-b border-white/5 w-full mb-4"></div>
    </div>
  );
};

export default SessionHistory;