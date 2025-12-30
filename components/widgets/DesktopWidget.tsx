import React, { useRef, useEffect, useState } from 'react';
import { WidgetState, Position, Theme } from '../../types';
import { useOS } from '../../context/OSContext';
import { X } from 'lucide-react';

interface DesktopWidgetProps {
  widget: WidgetState;
  children: React.ReactNode;
}

// Snap Configuration
const GRID_UNIT = 24;
const SNAP_THRESHOLD = 16;
const TASKBAR_HEIGHT = 48;
const WINDOW_PADDING = 12;

export const DesktopWidget: React.FC<DesktopWidgetProps> = ({ widget, children }) => {
  const { desktop, systemSettings } = useOS();
  const { updateWidgetPosition, removeWidget } = desktop;
  const { theme } = systemSettings;
  
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localPos, setLocalPos] = useState(widget.position);
  const [snapGhost, setSnapGhost] = useState<Position | null>(null);
  const [showControls, setShowControls] = useState(false);
  
  const dragStartRef = useRef<Position>({ x: 0, y: 0 });
  const dimensionsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  // Sync local pos if external update happens (unlikely during drag but good practice)
  useEffect(() => {
    if (!isDragging) {
      setLocalPos(widget.position);
    }
  }, [widget.position, isDragging]);

  const calculateSnap = (rawX: number, rawY: number): { pos: Position, zone?: string } => {
    const { width, height } = dimensionsRef.current;
    const maxX = window.innerWidth - width - WINDOW_PADDING;
    const maxY = window.innerHeight - height - TASKBAR_HEIGHT - WINDOW_PADDING;
    const minX = WINDOW_PADDING;
    const minY = WINDOW_PADDING;

    // 1. Constrain to Screen
    let x = Math.max(minX, Math.min(rawX, maxX));
    let y = Math.max(minY, Math.min(rawY, maxY));

    // 2. Define Snap Zones
    const zones = [
      { name: 'Top Left', x: minX, y: minY },
      { name: 'Top Right', x: maxX, y: minY },
      { name: 'Bottom Left', x: minX, y: maxY },
      { name: 'Bottom Right', x: maxX, y: maxY },
      { name: 'Center', x: (window.innerWidth - width) / 2, y: (window.innerHeight - height - TASKBAR_HEIGHT) / 2 }
    ];

    // 3. Check Zones
    for (const zone of zones) {
      if (Math.abs(x - zone.x) < SNAP_THRESHOLD * 2 && Math.abs(y - zone.y) < SNAP_THRESHOLD * 2) {
        return { pos: { x: zone.x, y: zone.y }, zone: zone.name };
      }
    }

    // 4. Grid Snap
    const gridX = Math.round(x / GRID_UNIT) * GRID_UNIT;
    const gridY = Math.round(y / GRID_UNIT) * GRID_UNIT;

    if (Math.abs(x - gridX) < SNAP_THRESHOLD && Math.abs(y - gridY) < SNAP_THRESHOLD) {
      return { pos: { x: gridX, y: gridY } };
    }

    return { pos: { x, y } };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const rawX = e.clientX - dragStartRef.current.x;
      const rawY = e.clientY - dragStartRef.current.y;
      
      // Update local visual position immediately for responsiveness
      setLocalPos({ x: rawX, y: rawY });

      // Calculate Snap Preview
      const { pos: snapPos, zone } = calculateSnap(rawX, rawY);
      
      // Show ghost if snapped position is significantly different from raw
      if (Math.abs(snapPos.x - rawX) > 2 || Math.abs(snapPos.y - rawY) > 2) {
         setSnapGhost(snapPos);
      } else {
         setSnapGhost(null);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const rawX = e.clientX - dragStartRef.current.x;
      const rawY = e.clientY - dragStartRef.current.y;
      
      const { pos: finalPos, zone } = calculateSnap(rawX, rawY);
      
      updateWidgetPosition(widget.id, finalPos, zone);
      setIsDragging(false);
      setSnapGhost(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, widget.id, updateWidgetPosition]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLButtonElement) return;
    
    // Only allow left click
    if (e.button !== 0) return;

    e.preventDefault();
    setIsDragging(true);
    
    const rect = widgetRef.current?.getBoundingClientRect();
    if (rect) {
      dragStartRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      dimensionsRef.current = {
        width: rect.width,
        height: rect.height
      };
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isDragging) return;
    
    const step = e.shiftKey ? 1 : GRID_UNIT;
    let newPos = { ...localPos };
    let changed = false;

    switch (e.key) {
      case 'ArrowUp': newPos.y -= step; changed = true; break;
      case 'ArrowDown': newPos.y += step; changed = true; break;
      case 'ArrowLeft': newPos.x -= step; changed = true; break;
      case 'ArrowRight': newPos.x += step; changed = true; break;
    }

    if (changed) {
      e.preventDefault();
      // Ensure bounds
      if (widgetRef.current) {
         const rect = widgetRef.current.getBoundingClientRect();
         dimensionsRef.current = { width: rect.width, height: rect.height };
         const { pos } = calculateSnap(newPos.x, newPos.y); // Use snap logic to constrain bounds even if not dragging
         updateWidgetPosition(widget.id, pos);
      }
    }
  };

  // Theme-aware styles for the snap ghost
  const getGhostStyles = (theme: Theme): React.CSSProperties => {
    switch (theme) {
      case 'glass':
        return {
          border: '1px solid rgba(255,255,255,0.35)',
          backgroundColor: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 0 12px rgba(180,220,255,0.25)',
        };
      case 'frost':
        return {
          border: '1px solid rgba(230,240,255,0.4)',
          backgroundColor: 'rgba(240,248,255,0.18)',
          backdropFilter: 'blur(18px)',
          boxShadow: '0 0 16px rgba(200,220,255,0.35)',
        };
      case 'void':
        return {
          border: '1px dashed rgba(120,120,120,0.35)',
          backgroundColor: 'rgba(20,20,20,0.45)',
          backdropFilter: 'blur(6px)',
          boxShadow: 'none',
        };
      case 'dark':
      default:
        return {
          border: '1px solid rgba(255,255,255,0.25)',
          backgroundColor: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(8px)',
          boxShadow: 'none',
        };
    }
  };

  return (
    <>
      {/* Snap Ghost Preview */}
      {isDragging && snapGhost && (
        <div 
          style={{ 
            left: snapGhost.x, 
            top: snapGhost.y,
            width: dimensionsRef.current.width,
            height: dimensionsRef.current.height,
            ...getGhostStyles(theme)
          }}
          className="fixed rounded-3xl z-[5] pointer-events-none transition-all duration-200 ease-out"
        />
      )}

      {/* Actual Widget */}
      <div
        ref={widgetRef}
        tabIndex={0} // Make focusable for keyboard events
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        style={{
          left: localPos.x,
          top: localPos.y,
          transform: isDragging ? 'scale(1.02)' : 'scale(1)',
          zIndex: isDragging ? 50 : 10
        }}
        className={`fixed outline-none group transition-transform duration-200 pointer-events-auto
          ${isDragging ? 'cursor-grabbing shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'cursor-grab'}
        `}
      >
        {/* Remove Button */}
        <div className={`absolute -top-3 -right-3 z-[60] transition-opacity duration-200 ${showControls && !isDragging ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={(e) => { e.stopPropagation(); removeWidget(widget.id); }}
            className="bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
        </div>

        <div className={`transition-opacity duration-200 ${isDragging ? 'opacity-90' : 'opacity-100'}`}>
           {children}
        </div>
      </div>
    </>
  );
};