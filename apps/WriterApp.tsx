import React, { useState } from 'react';
import { enhanceText } from '../services/geminiService';
import { Button } from '../components/ui/Button';
import { Wand2, RefreshCw, Copy, Check } from 'lucide-react';

const WriterApp: React.FC = () => {
  const [text, setText] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [view, setView] = useState<'input' | 'compare'>('input');
  const [copied, setCopied] = useState(false);

  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
  };

  const handleEnhance = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    const result = await enhanceText(text);
    setEnhancedText(result);
    setIsProcessing(false);
    setView('compare');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(enhancedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900/50 text-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4 text-xs font-mono text-white/40">
          <span>{stats.words} WORDS</span>
          <span>{stats.chars} CHARACTERS</span>
        </div>
        {view === 'compare' && (
          <button 
            onClick={() => setView('input')} 
            className="text-xs text-white/60 hover:text-white underline"
          >
            Back to Editor
          </button>
        )}
      </div>

      <div className="flex-1 relative overflow-hidden">
        {view === 'input' ? (
          <textarea
            className="w-full h-full bg-transparent resize-none outline-none text-lg font-light leading-relaxed placeholder-white/20"
            placeholder="Start writing..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="flex flex-col gap-2 opacity-50">
              <span className="text-xs uppercase tracking-wider text-white/40">Original</span>
              <div className="flex-1 p-4 rounded-lg border border-white/5 bg-white/5 overflow-auto text-sm leading-relaxed">
                {text}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wider text-cyan-400">Enhanced</span>
              <div className="flex-1 p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 overflow-auto text-sm leading-relaxed shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                {enhancedText}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
        {view === 'input' ? (
          <Button onClick={handleEnhance} isLoading={isProcessing} disabled={!text.trim()}>
            <Wand2 size={16} />
            Enhance with Gemini
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleEnhance} isLoading={isProcessing}>
              <RefreshCw size={16} />
              Regenerate
            </Button>
            <Button onClick={handleCopy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy Enhanced'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriterApp;