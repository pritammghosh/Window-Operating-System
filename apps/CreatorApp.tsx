import React from 'react';
import { Button } from '../components/ui/Button';
import { ExternalLink, Layers, Code, Cpu, PenTool, Layout, Box, ArrowUpRight } from 'lucide-react';

const CreatorApp: React.FC = () => {
  const handleExternalLink = () => {
    window.open('https://devarthastudio.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-full flex flex-col bg-neutral-900/95 text-white overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      {/* Hero Section */}
      <div className="p-12 border-b border-white/5 bg-gradient-to-br from-neutral-900 via-neutral-900 to-black relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/60 mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Devartha Studio
          </div>
          <h1 className="text-5xl font-light tracking-tight mb-6 leading-tight">
            Designing systems,<br />
            <span className="text-white/50">not just screens.</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-lg mb-8">
            An independent design and product studio focused on building calm, functional, system-level digital experiences.
          </p>
          <Button onClick={handleExternalLink}>
            Visit Studio <ArrowUpRight size={16} />
          </Button>
        </div>
      </div>

      <div className="p-8 space-y-16 pb-40">
        {/* What We Build */}
        <section>
          <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-8 border-b border-white/5 pb-2">What We Build</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { 
                icon: Layout, 
                title: 'Product Interfaces', 
                desc: 'High-end frontend systems with strong interaction logic and visual restraint.' 
              },
              { 
                icon: Box, 
                title: 'Operational Tools', 
                desc: 'Internal dashboards, CRMs, POS systems, and business tools for real-world usage.' 
              },
              { 
                icon: Layers, 
                title: 'Design Systems', 
                desc: 'Scalable UI foundations with clear rules, tokens, and long-term maintainability.' 
              },
              { 
                icon: Cpu, 
                title: 'Experimental Interfaces', 
                desc: 'Concept-driven experiences that challenge traditional website metaphors.' 
              }
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center mb-4 text-white/80 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-300">
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                <h4 className="text-lg font-medium mb-2">{item.title}</h4>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Philosophy & Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* How We Think */}
          <section>
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-6 border-b border-white/5 pb-2">How We Think</h3>
            <div className="space-y-4">
              {[
                "Systems over pages",
                "Clarity over decoration",
                "Restraint over excess",
                "Function before form"
              ].map((principle, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-8 h-px bg-white/20 group-hover:w-12 group-hover:bg-cyan-500 transition-all duration-300" />
                  <span className="text-lg font-light text-white/80 group-hover:text-white transition-colors">{principle}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Capabilities */}
          <section>
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-6 border-b border-white/5 pb-2">Selected Capabilities</h3>
            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              <div>
                <h4 className="text-sm font-medium text-white/90 mb-3 flex items-center gap-2">
                  <PenTool size={14} className="text-cyan-400" /> Design
                </h4>
                <ul className="space-y-2 text-sm text-white/50">
                  <li>UI / UX Design</li>
                  <li>Interaction Design</li>
                  <li>Design Systems</li>
                  <li>Motion Design</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white/90 mb-3 flex items-center gap-2">
                  <Code size={14} className="text-cyan-400" /> Engineering
                </h4>
                <ul className="space-y-2 text-sm text-white/50">
                  <li>Frontend Architecture</li>
                  <li>Component Systems</li>
                  <li>State Management</li>
                  <li>Performance Optimization</li>
                </ul>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-white/90 mb-3 flex items-center gap-2">
                   <Box size={14} className="text-cyan-400" /> Product
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['MVP Development', 'Internal Tools', 'Local Business Software', 'AI-assisted Utilities'].map((tag, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-white/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <section className="p-8 rounded-2xl bg-white text-black flex items-center justify-between shadow-[0_0_50px_rgba(255,255,255,0.1)]">
          <div>
            <h4 className="text-xl font-medium mb-1 tracking-tight">Ready to build something real?</h4>
            <p className="text-sm text-black/60">Let's discuss your next project.</p>
          </div>
          <button 
            onClick={handleExternalLink}
            className="px-6 py-3 bg-black text-white hover:bg-neutral-800 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
          >
            devarthastudio.com <ExternalLink size={16} />
          </button>
        </section>
        
        <div className="text-center text-[10px] text-white/20 uppercase tracking-widest pt-8 pb-8">
          © {new Date().getFullYear()} Devartha Studio. All Systems Operational.
        </div>
      </div>
    </div>
  );
};

export default CreatorApp;