import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { APPS } from '../../constants';
import { LayoutGrid, Battery, Wifi, Bell } from 'lucide-react';
import { StartMenu } from '../system/StartMenu';
import { ControlCenter } from '../system/ControlCenter';
import { NotificationCenter } from '../system/NotificationCenter';
import { NotificationToast } from '../system/NotificationToast';

export const Taskbar: React.FC = () => {
  const { windows, launchApp, activeWindowId, systemSettings } = useOS();
  const { notifications } = systemSettings;
  const [time, setTime] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const [controlOpen, setControlOpen] = useState(false);
  const [notifCenterOpen, setNotifCenterOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pinnedApps = Object.values(APPS).filter(app => app.id !== 'memory');
  const unreadCount = notifications.length;

  return (
    <>
      {/* Floating Layers */}
      <NotificationToast />

      {startOpen && (
          <>
            <div className="fixed inset-0 z-[9999]" onClick={() => setStartOpen(false)} />
            <StartMenu onClose={() => setStartOpen(false)} />
          </>
      )}
      
      {controlOpen && (
          <>
            <div className="fixed inset-0 z-[9999]" onClick={() => setControlOpen(false)} />
            <ControlCenter />
          </>
      )}

      {notifCenterOpen && (
          <>
             <div className="fixed inset-0 z-[9999]" onClick={() => setNotifCenterOpen(false)} />
             <NotificationCenter onClose={() => setNotifCenterOpen(false)} />
          </>
      )}

      <div className="fixed bottom-0 left-0 right-0 h-12 bg-neutral-900/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-2 z-[9999] select-none">
        
        {/* Start Button */}
        <div className="flex items-center">
            <button 
                onClick={() => setStartOpen(!startOpen)}
                className={`p-2 rounded-lg transition-all ${startOpen ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/80'}`}
            >
                <LayoutGrid size={20} />
            </button>
        </div>

        {/* Center Dock */}
        <div className="flex items-center gap-1 h-full px-4">
            {pinnedApps.map(app => {
                const isOpen = windows[app.id].isOpen;
                const isActive = activeWindowId === app.id;
                return (
                    <button
                        key={app.id}
                        onClick={() => launchApp(app.id)}
                        className={`
                            relative group p-2 rounded-lg transition-all duration-200 
                            ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
                        `}
                    >
                        <div className={`transition-transform duration-200 ${isActive ? 'scale-100' : 'scale-90 opacity-80 group-hover:scale-100 group-hover:opacity-100'}`}>
                            <app.icon size={20} />
                        </div>
                        {isOpen && (
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full" />
                        )}
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                            {app.name}
                        </div>
                    </button>
                );
            })}
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-2 h-full">
            {/* Notification Bell */}
            <button
               onClick={() => setNotifCenterOpen(!notifCenterOpen)}
               className={`relative p-2 rounded-lg transition-colors ${notifCenterOpen ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-white/60 hover:text-white'}`}
            >
               <Bell size={18} />
               {unreadCount > 0 && (
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-neutral-900" />
               )}
            </button>

            {/* Status Area */}
            <button 
                onClick={() => setControlOpen(!controlOpen)}
                className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors ${controlOpen ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
                <div className="flex gap-2 text-white/60">
                    <Wifi size={14} />
                    <Battery size={14} />
                </div>
                <div className="text-right">
                    <div className="text-xs font-medium text-white/90 leading-none">
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[10px] text-white/50 leading-none mt-0.5">
                        {time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>
            </button>
        </div>
      </div>
    </>
  );
};