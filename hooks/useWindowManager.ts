import { useState } from 'react';
import { AppID, WindowState, Position } from '../types';
import { APPS } from '../constants';

export const useWindowManager = () => {
  const [activeWindowId, setActiveWindowId] = useState<AppID | null>(null);
  const [windows, setWindows] = useState<Record<AppID, WindowState>>(() => {
    const initial: Partial<Record<AppID, WindowState>> = {};
    Object.values(APPS).forEach(app => {
      initial[app.id] = {
        id: app.id,
        title: app.name,
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        zIndex: 0,
        position: { x: 100, y: 100 },
        size: app.defaultSize
      };
    });
    return initial as Record<AppID, WindowState>;
  });

  const bringToFront = (id: AppID) => {
    setWindows(prev => {
      const maxZ = Math.max(...Object.values(prev).map((w: WindowState) => w.zIndex), 0);
      return {
        ...prev,
        [id]: { ...prev[id], zIndex: maxZ + 1 }
      };
    });
    setActiveWindowId(id);
  };

  const launchApp = (id: AppID) => {
    setWindows(prev => {
      const app = prev[id];
      let newPos = app.position;

      // Only set initial position if opening
      if (!app.isOpen) {
        if (id === AppID.CHATBOT) {
          // Position Chatbot in bottom right corner
          // Taskbar is h-12 (48px)
          const taskbarHeight = 48;
          const margin = 16; 
          
          // Safety check for window existence
          const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
          const vh = typeof window !== 'undefined' ? window.innerHeight : 768;

          newPos = {
            x: Math.max(0, vw - app.size.width - margin),
            y: Math.max(0, vh - app.size.height - taskbarHeight - margin)
          };
        } else {
          // Random cascade for other apps to prevent perfect stacking
          newPos = { 
            x: 100 + Math.random() * 40, 
            y: 80 + Math.random() * 40 
          };
        }
      }
      
      return {
        ...prev,
        [id]: { 
          ...app, 
          isOpen: true, 
          isMinimized: false,
          position: newPos
        }
      };
    });
    bringToFront(id);
  };

  const closeApp = (id: AppID) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false }
    }));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const minimizeApp = (id: AppID) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true }
    }));
    setActiveWindowId(null);
  };

  const updateWindowPosition = (id: AppID, pos: Position) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], position: pos }
    }));
  };

  return {
    windows,
    activeWindowId,
    launchApp,
    closeApp,
    minimizeApp,
    focusApp: bringToFront,
    updateWindowPosition
  };
};