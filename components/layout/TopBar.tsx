import React, { useState, useEffect } from 'react';
import { Settings, LogOut, Power } from 'lucide-react';

interface TopBarProps {
  onShutdown: () => void;
  onReboot: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onShutdown, onReboot }) => {
  const [time, setTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-black/20 backdrop-blur-md border-b border-white/5 z-[9999] flex items-center justify-between px-4 text-xs font-medium text-white/80 select-none">
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className={`font-bold tracking-widest hover:text-white transition-colors ${menuOpen ? 'text-white' : ''}`}
          >
            TOS
          </button>
          
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute top-8 left-0 w-48 bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-20 py-1 flex flex-col">
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">System</span>
                </div>
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 text-left transition-colors">
                  <Settings size={12} /> About This OS
                </button>
                <div className="h-px bg-white/5 my-1" />
                <button 
                  onClick={onReboot}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 text-left transition-colors"
                >
                  <LogOut size={12} /> Sign Out
                </button>
                <button 
                  onClick={onShutdown}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-red-500/20 text-red-300 text-left transition-colors"
                >
                  <Power size={12} /> Shut Down...
                </button>
              </div>
            </>
          )}
        </div>
        <span className="hover:text-white cursor-default transition-colors">File</span>
        <span className="hover:text-white cursor-default transition-colors">Edit</span>
        <span className="hover:text-white cursor-default transition-colors">View</span>
      </div>

      <div className="flex items-center gap-4 font-mono">
        <span className="opacity-60">MEM 42%</span>
        <span>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};