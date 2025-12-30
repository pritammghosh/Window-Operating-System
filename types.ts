import React, { ReactNode } from 'react';

export enum AppID {
  WRITER = 'writer',
  CONVERTER = 'converter',
  MONITOR = 'monitor',
  MEMORY = 'memory',
  FILE_EXPLORER = 'file_explorer',
  RECYCLE_BIN = 'recycle_bin',
  CALCULATOR = 'calculator',
  BROWSER = 'browser',
  SETTINGS = 'settings',
  CREATOR = 'creator',
  CHATBOT = 'chatbot'
}

export type SystemStatus = 'booting' | 'active' | 'shutdown';

export type Theme = 'dark' | 'glass' | 'frost' | 'void';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WindowState {
  id: AppID;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: Position;
  size: Size;
}

export interface AppConfig {
  id: AppID;
  name: string;
  icon: React.ElementType;
  component: React.FC;
  defaultSize: Size;
  description: string;
}

// File System Types
export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  parentId: string | null; // null is root
  size: string;
  createdAt: Date;
  isTrash: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  visible: boolean; // For the toast popup
  read: boolean;    // For the history list badge
}

// Desktop & Widget Types
export type WidgetType = 'time' | 'notes' | 'status';

export interface WidgetState {
  id: string;
  type: WidgetType;
  position: Position;
  snapZone?: string;
  data?: any; // For persisted data like note content
}

export interface DesktopSettings {
  wallpaper: string | null;
  widgets: WidgetState[];
  setWallpaper: (url: string | null) => void;
  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
  updateWidgetPosition: (id: string, pos: Position, snapZone?: string) => void;
  updateWidgetData: (id: string, data: any) => void;
}

export interface OSContextType {
  systemStatus: SystemStatus;
  windows: Record<AppID, WindowState>;
  activeWindowId: AppID | null;
  launchApp: (id: AppID) => void;
  closeApp: (id: AppID) => void;
  minimizeApp: (id: AppID) => void;
  focusApp: (id: AppID) => void;
  updateWindowPosition: (id: AppID, pos: Position) => void;
  shutdownSystem: () => void;
  rebootSystem: () => void;
  
  // Capabilities
  fileSystem: {
    files: Record<string, FileNode>;
    createFile: (name: string, content: string, parentId: string | null) => void;
    createFolder: (name: string, parentId: string | null) => void;
    deleteFile: (id: string) => void;
    restoreFile: (id: string) => void;
    permanentDeleteFile: (id: string) => void;
    renameFile: (id: string, newName: string) => void;
    emptyRecycleBin: () => void;
  };
  systemSettings: {
    brightness: number;
    volume: number;
    theme: Theme;
    setBrightness: (val: number) => void;
    setVolume: (val: number) => void;
    setTheme: (theme: Theme) => void;
    notifications: Notification[];
    addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'visible' | 'read'>) => void;
    dismissNotification: (id: string) => void;
    clearAllNotifications: () => void;
  };
  desktop: DesktopSettings;
}