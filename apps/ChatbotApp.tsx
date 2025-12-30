import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { chatWithGemini } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const ChatbotApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'model', text: 'Hello! I am your AI assistant. How can I help you navigate the system or answer your questions today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    // Auto-focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input;
    setInput('');
    
    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Prepare history for API (excluding the current new message)
    const apiHistory = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await chatWithGemini(apiHistory, userText);

    const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900/50 text-white relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10" ref={scrollRef}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10
              ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-cyan-500/20 text-cyan-400'}
            `}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`
              max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-white/10 text-white rounded-tr-sm' 
                : 'bg-black/40 border border-white/5 text-white/90 rounded-tl-sm'
              }
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-white/10">
              <Sparkles size={16} className="animate-pulse" />
            </div>
            <div className="bg-black/40 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus-within:bg-white/10 focus-within:border-white/20 transition-all">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder-white/30"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          <Button 
            variant="ghost" 
            className={`!p-2 hover:bg-cyan-500/20 hover:text-cyan-400 ${input.trim() ? 'opacity-100' : 'opacity-50'}`}
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
          >
            <Send size={16} />
          </Button>
        </div>
        <div className="text-[10px] text-white/20 text-center mt-2">
          Powered by Gemini 3 Pro
        </div>
      </div>
    </div>
  );
};

export default ChatbotApp;