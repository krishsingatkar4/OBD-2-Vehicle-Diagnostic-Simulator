import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Trash2, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { ConsoleMessage } from '../types';

interface ConsoleProps {
  messages: ConsoleMessage[];
  onClear: () => void;
  onSendCustomCmd: (cmd: string) => void;
}

export const DiagnosticConsoleDrawer: React.FC<ConsoleProps> = ({ messages, onClear, onSendCustomCmd }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [inputCmd, setInputCmd] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCmd.trim()) return;
    onSendCustomCmd(inputCmd.trim());
    setInputCmd('');
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 glass-panel border-t border-slate-700 shadow-2xl ${
      isOpen ? 'h-64' : 'h-11'
    }`}>
      
      {/* Console Bar Header */}
      <div 
        className="h-11 px-4 bg-slate-950/90 flex items-center justify-between cursor-pointer border-b border-slate-800 select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold font-mono tracking-wider text-slate-200 flex items-center gap-2">
            OBD-II CAN-BUS SIMULATOR TERMINAL
            <span className="px-1.5 py-0.5 rounded text-[10px] font-normal bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {messages.length} pkts
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={onClear}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors"
            title="Clear Terminal Logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors"
            title={isOpen ? 'Minimize Terminal' : 'Maximize Terminal'}
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Terminal Content Body */}
      {isOpen && (
        <div className="flex flex-col h-[calc(100%-2.75rem)] bg-slate-950/95 font-mono text-xs overflow-hidden scanline">
          
          {/* Scrollable messages area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 selection:bg-cyan-500 selection:text-black">
            {messages.length === 0 ? (
              <div className="text-slate-600 italic text-center py-6">
                Ready to intercept OBD-II diagnostic Hex traffic...
              </div>
            ) : (
              messages.map((msg) => {
                let colorClass = 'text-slate-300';
                let tagClass = 'bg-slate-800 text-slate-300 border-slate-700';

                if (msg.type === 'can') {
                  colorClass = 'text-cyan-300';
                  tagClass = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
                } else if (msg.type === 'warn') {
                  colorClass = 'text-amber-300';
                  tagClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                } else if (msg.type === 'error') {
                  colorClass = 'text-rose-400';
                  tagClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
                } else if (msg.type === 'success') {
                  colorClass = 'text-emerald-300';
                  tagClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                }

                return (
                  <div key={msg.id} className="flex items-start gap-2 leading-relaxed group hover:bg-slate-900/60 p-1 rounded transition-colors">
                    <span className="text-[10px] text-slate-500 select-none whitespace-nowrap">[{msg.timestamp}]</span>
                    <span className={`text-[10px] px-1 py-0.2 rounded font-bold border uppercase tracking-wider select-none ${tagClass}`}>
                      {msg.source}
                    </span>
                    <span className={`flex-1 break-all ${colorClass}`}>
                      {msg.text}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Command Input line */}
          <form onSubmit={handleCustomSubmit} className="p-2 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2">
            <span className="text-cyan-400 font-bold pl-1">&gt;</span>
            <input
              type="text"
              value={inputCmd}
              onChange={(e) => setInputCmd(e.target.value)}
              placeholder="Type custom AT/OBD-II command (e.g. 010C for RPM, 0105 for Coolant)..."
              className="flex-1 bg-transparent text-slate-200 focus:outline-none placeholder:text-slate-600 text-xs font-mono"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded text-xs transition-colors flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3 h-3" /> Transmit
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
