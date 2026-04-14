import { useState, useEffect } from 'react';
import { PROBLEMS } from '@/data/calculator-data';

interface ProblemsModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProblemsModal({ open, onClose }: ProblemsModalProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const toggleItem = (i: number) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-500 flex items-start justify-center p-8 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface2 border border-orange/30 rounded-[14px] max-w-[680px] w-full p-8 my-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="font-mono text-[0.95rem] font-bold text-text">
            ⚠️ Проблемы при <span className="text-orange">3D-печати</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full border border-border bg-transparent cursor-pointer text-text3 text-base flex items-center justify-center shrink-0 transition-all hover:border-red hover:text-red">
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {PROBLEMS.map((p, i) => {
            const isOpen = openItems.has(i);
            return (
              <div
                key={i}
                className={`bg-surface3 border rounded-[10px] overflow-hidden transition-colors ${isOpen ? 'border-orange/45' : 'border-border hover:border-orange/30 hover:bg-surface4'}`}
              >
                {/* Only this header area toggles */}
                <div
                  onClick={() => toggleItem(i)}
                  className="flex items-center gap-2.5 p-4 cursor-pointer"
                >
                  <div className="text-lg shrink-0 w-[26px] text-center">{p.icon}</div>
                  <div className="font-mono text-[0.82rem] font-bold text-text flex-1">{p.name}</div>
                  <div className="text-[0.62rem] font-mono px-2 py-0.5 rounded bg-orange-glow border border-orange/30 text-orange whitespace-nowrap">{p.tag}</div>
                  <div className={`text-[0.65rem] text-text3 transition-transform shrink-0 ml-1 ${isOpen ? 'rotate-90' : ''}`}>▶</div>
                </div>
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-border pt-4">
                    <div className="text-[0.8rem] text-text3 leading-relaxed mb-3">{p.desc}</div>
                    <div className="font-mono text-[0.7rem] text-green uppercase tracking-wider mb-2">Как исправить:</div>
                    <ul className="flex flex-col gap-1">
                      {p.fixes.map((fix, j) => (
                        <li key={j} className="text-[0.78rem] text-text2 pl-4 relative leading-relaxed">
                          <span className="absolute left-0 text-green font-mono text-[0.7rem] top-0.5">→</span>
                          {fix}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
