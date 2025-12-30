import React from 'react';
import { useOS } from '../../context/OSContext';
import { WidgetState } from '../../types';

export const NotesWidget: React.FC<{ widget: WidgetState }> = ({ widget }) => {
  const { desktop } = useOS();
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    desktop.updateWidgetData(widget.id, { text: e.target.value });
  };

  return (
    <div className="w-64 h-64 p-4 rounded-2xl bg-yellow-100/10 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col">
      <div className="text-[10px] uppercase font-bold text-yellow-200/50 mb-2 tracking-wider">Quick Note</div>
      <textarea 
        className="flex-1 bg-transparent resize-none outline-none text-yellow-50 placeholder-yellow-50/30 text-sm leading-relaxed"
        placeholder="Type something..."
        value={widget.data?.text || ''}
        onChange={handleChange}
        onMouseDown={(e) => e.stopPropagation()} // Allow text selection
      />
    </div>
  );
};