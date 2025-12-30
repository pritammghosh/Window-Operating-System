import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Search } from 'lucide-react';

const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://www.google.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com/webhp?igu=1'); // Google capable of running in iframe for demo

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = url;
    if (!target.startsWith('http')) target = 'https://' + target;
    setCurrentUrl(target);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chrome */}
      <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50 text-gray-600">
        <button className="p-1 hover:bg-gray-200 rounded"><ArrowLeft size={16} /></button>
        <button className="p-1 hover:bg-gray-200 rounded"><ArrowRight size={16} /></button>
        <button className="p-1 hover:bg-gray-200 rounded"><RotateCw size={16} /></button>
        
        <form onSubmit={handleNavigate} className="flex-1 relative">
           <input 
            className="w-full bg-white border border-gray-300 rounded-full py-1.5 px-4 pl-9 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
        </form>
      </div>
      
      {/* Content */}
      <div className="flex-1 bg-gray-100 relative">
        <iframe 
          src={currentUrl} 
          className="w-full h-full border-none" 
          title="Browser"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
};

export default BrowserApp;