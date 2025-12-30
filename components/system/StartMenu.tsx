import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { APPS } from '../../constants';
import { Search, Power, LogOut, User } from 'lucide-react';

interface StartMenuProps {
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onClose }) => {
  const { launchApp, shutdownSystem, rebootSystem } = useOS();
  const [search, setSearch] = useState('');

  const filteredApps = Object.values(APPS).filter(app => 
    app.name.toLowerCase().includes(search.toLowerCase()) && 
    app.id !== 'memory' // Hide utility
  );

  return (
    <div className="absolute bottom-12 left-4 w-96 bg-neutral-900/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200 z-[10000]">
      {/* Search */}
      <div className="p-4 border-b border-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input 
            type="text"
            placeholder="Search applications..."
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
        {filteredApps.map(app => (
          <button
            key={app.id}
            onClick={() => {
              launchApp(app.id);
              onClose();
            }}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-colors group"
          >
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white/80 group-hover:bg-white/10 group-hover:text-white transition-all shadow-lg">
              <app.icon size={20} />
            </div>
            <span className="text-[10px] text-white/70 text-center truncate w-full">{app.name}</span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold">
                JD
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-medium text-white">John Doe</span>
                <span className="text-[10px] text-white/40">Administrator</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={rebootSystem} className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors" title="Sign Out">
                <LogOut size={16} />
            </button>
            <button onClick={shutdownSystem} className="p-2 hover:bg-red-500/20 rounded-lg text-white/50 hover:text-red-300 transition-colors" title="Shut Down">
                <Power size={16} />
            </button>
        </div>
      </div>
    </div>
  );
};