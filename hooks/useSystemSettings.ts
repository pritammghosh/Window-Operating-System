import { useState } from 'react';
import { Notification, Theme } from '../types';

export const useSystemSettings = () => {
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(75);
  const [theme, setTheme] = useState<Theme>('dark');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (n: Omit<Notification, 'id' | 'timestamp' | 'visible' | 'read'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotif: Notification = {
      ...n,
      id,
      timestamp: new Date(),
      visible: true,
      read: false
    };
    
    setNotifications(prev => [newNotif, ...prev]);

    // Auto-hide the toast after 5 seconds, but keep in history
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(notif => notif.id === id ? { ...notif, visible: false } : notif)
      );
    }, 5000);
  };

  const dismissNotification = (id: string) => {
    // Completely remove from history
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    brightness,
    setBrightness,
    volume,
    setVolume,
    theme,
    setTheme,
    notifications,
    addNotification,
    dismissNotification,
    clearAllNotifications
  };
};