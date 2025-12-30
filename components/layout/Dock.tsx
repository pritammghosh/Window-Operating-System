import React from 'react';
import { AppID, WindowState } from '../../types';
import { APPS } from '../../constants';

interface DockProps {
  windows: Record<AppID, WindowState>;
  onLaunch: (id: AppID) => void;
  activeId: AppID | null;
}

export const Dock: React.FC<DockProps> = ({ windows, onLaunch, activeId }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-3 p-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-[9999]">
      {Object.values(APPS).map((app) => {
        const isOpen = windows[app.id].isOpen;
        const isActive = activeId === app.id;
        
        return (
          <button
            key={app.id}
            onClick={() => onLaunch(app.id)}
            className="group relative flex flex-col items-center gap-1 transition-all duration-300 ease-out hover:-translate-y-2"
          >
            {/* Tooltip */}
            <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 border border-white/10 text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap">
              {app.name}
            </span>

            {/* Icon Container */}
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
              ${isActive 
                ? 'bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }
            `}>
              <app.icon size={24} strokeWidth={1.5} />
            </div>

            {/* Indicator Dot */}
            <div className={`w-1 h-1 rounded-full bg-white transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 scale-0'}`} />
          </button>
        );
      })}
    </div>
  );
};