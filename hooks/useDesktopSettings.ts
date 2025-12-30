import { useState, useEffect } from 'react';
import { WidgetState, WidgetType, Position } from '../types';

const STORAGE_KEY_WALLPAPER = 'tos_wallpaper';
const STORAGE_KEY_WIDGETS = 'tos_widgets';

export const useDesktopSettings = () => {
  const [wallpaper, setWallpaperState] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<WidgetState[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load state on mount
  useEffect(() => {
    const storedWallpaper = localStorage.getItem(STORAGE_KEY_WALLPAPER);
    const storedWidgets = localStorage.getItem(STORAGE_KEY_WIDGETS);

    if (storedWallpaper) setWallpaperState(storedWallpaper);
    if (storedWidgets) {
      try {
        setWidgets(JSON.parse(storedWidgets));
      } catch (e) {
        console.error("Failed to parse widgets", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Persist state changes
  useEffect(() => {
    if (!isInitialized) return;
    if (wallpaper) {
      localStorage.setItem(STORAGE_KEY_WALLPAPER, wallpaper);
    } else {
      localStorage.removeItem(STORAGE_KEY_WALLPAPER);
    }
  }, [wallpaper, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(STORAGE_KEY_WIDGETS, JSON.stringify(widgets));
  }, [widgets, isInitialized]);

  const setWallpaper = (url: string | null) => {
    setWallpaperState(url);
  };

  const addWidget = (type: WidgetType) => {
    const newWidget: WidgetState = {
      id: `widget-${Date.now()}`,
      type,
      position: { x: 100 + widgets.length * 20, y: 100 + widgets.length * 20 },
      data: {}
    };
    setWidgets(prev => [...prev, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  const updateWidgetPosition = (id: string, pos: Position, snapZone?: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, position: pos, snapZone } : w));
  };

  const updateWidgetData = (id: string, data: any) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, data: { ...w.data, ...data } } : w));
  };

  return {
    wallpaper,
    widgets,
    setWallpaper,
    addWidget,
    removeWidget,
    updateWidgetPosition,
    updateWidgetData
  };
};