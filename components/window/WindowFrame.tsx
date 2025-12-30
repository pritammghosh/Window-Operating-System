import React, { useRef, useEffect } from 'react';
import { X, Minus } from 'lucide-react';
import { WindowState } from '../../types';

interface WindowFrameProps {
  config: WindowState;
  title: string;
  children: React.ReactNode;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onMove: (pos: { x: number, y: number }) => void;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  config,
  title,
  children,
  isActive,
  onClose,
  onMinimize,
  onFocus,
  onMove
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof Element && e.target.closest('button')) return; 
    
    isDragging.current = true;
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
    onFocus();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      
      onMove({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    if (config.isOpen) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [config.isOpen, onMove]);

  if (!config.isOpen || config.isMinimized) return null;

  return (
    <div
      ref={windowRef}
      onMouseDown={onFocus}
      style={{
        left: config.position.x,
        top: config.position.y,
        width: config.size.width,
        height: config.size.height,
        zIndex: config.zIndex,
      }}
      className={`fixed flex flex-col rounded-xl overflow-hidden transition-all duration-200 ease-out border pointer-events-auto
        ${isActive 
          ? 'bg-neutral-900/60 backdrop-blur-xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
          : 'bg-neutral-900/40 backdrop-blur-md border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] grayscale-[0.5]'
        }
      `}
    >
      {/* Title Bar */}
      <div 
        className="h-10 shrink-0 flex items-center justify-between px-4 select-none cursor-default group"
        onMouseDown={handleMouseDown}
      >
        <span className={`text-sm font-medium tracking-wide ${isActive ? 'text-white' : 'text-white/40'}`}>
          {title}
        </span>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="p-1 hover:bg-white/10 rounded-md text-white/60 hover:text-white transition-colors"
          >
            <Minus size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="p-1 hover:bg-red-500/20 rounded-md text-white/60 hover:text-red-200 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-1 relative">
         <div className="h-full w-full bg-black/20 rounded-lg overflow-hidden border border-white/5">
            {children}
         </div>
      </div>
    </div>
  );
};