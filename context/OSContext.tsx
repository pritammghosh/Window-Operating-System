import React, { createContext, useContext } from 'react';
import { OSContextType } from '../types';
import { useSystemLifecycle } from '../hooks/useSystemLifecycle';
import { useWindowManager } from '../hooks/useWindowManager';
import { useFileSystem } from '../hooks/useFileSystem';
import { useSystemSettings } from '../hooks/useSystemSettings';
import { useDesktopSettings } from '../hooks/useDesktopSettings';

const OSContext = createContext<OSContextType | null>(null);

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) throw new Error("useOS must be used within OSContext");
  return context;
};

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { systemStatus, shutdownSystem, rebootSystem } = useSystemLifecycle();
  const { 
    windows, 
    activeWindowId, 
    launchApp, 
    closeApp, 
    minimizeApp, 
    focusApp, 
    updateWindowPosition 
  } = useWindowManager();
  
  const fileSystem = useFileSystem();
  const systemSettings = useSystemSettings();
  const desktopSettings = useDesktopSettings();

  const contextValue: OSContextType = {
    systemStatus,
    windows,
    activeWindowId,
    launchApp,
    closeApp,
    minimizeApp,
    focusApp,
    updateWindowPosition,
    shutdownSystem,
    rebootSystem,
    fileSystem,
    systemSettings,
    desktop: desktopSettings
  };

  return (
    <OSContext.Provider value={contextValue}>
      {children}
    </OSContext.Provider>
  );
};