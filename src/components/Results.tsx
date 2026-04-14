import { useState } from 'react';
import { FIXES, PROBLEM_CHIPS } from '@/data/calculator-data';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ParamResult {
  label: string;
  value: number | string;
  unit: string;
  hint: string;
  adjusted: boolean;
}

interface ResultsProps {
  visible: boolean;
  subtitle: string;
  stlNotes: string[];
  params: ParamResult[];
}

export function Results({ visible, subtitle, stlNotes, params }: ResultsProps) {
  const [feedbackState, setFeedbackState] = useState<'ask' | 'yes' | 'no'>('ask');
  const [pickedProblems, setPickedProblems] = useState<Set<string>>(new Set());
  const [recalcResult, setRecalcResult] = useState<typeof FIXES[string][] | null>(null);

  if (!visible) return null;

  const toggleProblem = (key: string) => {
    setPickedProblems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const doRecalc = () => {
    if (pickedProblems.size === 0) return;
    setRecalcResult([...pickedProblems].map(k => FIXES[k]));
  };

  return (
    <div id="results" className="bg-background border-t border-border" ref={sectionRef}>
      <section className="max-w-[1080px] mx-auto px-8 py-16 max-md:px-6">
        <div className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-green mb-2">// результат</div>
        <h2 className="font-mono text-[clamp(1.4rem,2.8vw,2rem)] font-bold text-text tracking-tight mb-1 leading-tight">Рекомендуемые параметры</h2>
        <div className="w-12 h-0.5 bg-gradient-to-r from-green to-purple my-3 mb-8 rounded-sm" />
        <p className="text-text3 text-[0.88rem] mb-8">{subtitle}</p>

        {stlNotes.length > 0 && (
          <div className="font-mono text-[0.72rem] text-purple mb-8 leading-8 bg-purple-glow border border-purple/20 rounded-lg px-4 py-3">
            📐 Коррекция по STL: {stlNotes.join(' · ')}
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(185px,1fr))] gap-3.5 mb-6">
          {params.map((p, i) => (
            <div key={i} className="group bg-surface2 border border-border rounded-[10px] p-5 relative transition-colors hover:border-green/20">
              <div className="text-[0.68rem] text-text3 font-mono tracking-wider uppercase mb-1">
                {p.label}
                {p.adjusted && (
                  <span className="text-[0.6rem] font-mono text-purple bg-purple-glow border border-purple/25 rounded px-1.5 py-px ml-1 align-middle">STL</span>
                )}
              </div>
              <div className={`font-mono text-2xl font-bold leading-none mb-1 ${p.adjusted ? 'text-purple' : 'text-green'}`}>
                {p.value}
              </div>
              <div className="text-[0.72rem] text-text3 font-mono">{p.unit}</div>
              <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full border border-border bg-transparent cursor-pointer text-[0.65rem] text-text3 font-mono flex items-center justify-center transition-colors hover:border-purple hover:text-purple peer">
                ?
              </div>
              <div className="hidden group-hover:block absolute bottom-[calc(100%+8px)] right-0 w-[220px] bg-surface4 border border-purple/35 rounded-lg p-3 text-[0.72rem] text-text2 leading-relaxed z-50">
                {p.hint}
                {p.adjusted && <><br /><br /><em className="text-purple">Скорректировано по геометрии STL</em></>}
              </div>
            </div>
          ))}
        </div>

        {/* Feedback */}
        <div className="bg-surface2 border border-border rounded-xl p-8 mt-8 text-center">
          <div className="font-mono text-base font-bold text-text mb-1">Печать получилась?</div>
          <div className="text-[0.85rem] text-text3 mb-6">Твой отзыв помогает нам улучшать расчёт</div>

          {feedbackState === 'ask' && (
            <div className="flex justify-center gap-3 flex-wrap">
              <button onClick={() => setFeedbackState('yes')} className="inline-flex items-center gap-2 font-mono text-[0.82rem] font-bold tracking-wide px-6 py-3 rounded-[7px] border-none cursor-pointer transition-all bg-green-glow border border-green/40 text-green hover:bg-green/20">
                ✓ Да, всё отлично!
              </button>
              <button onClick={() => setFeedbackState('no')} className="inline-flex items-center gap-2 font-mono text-[0.82rem] font-bold tracking-wide px-6 py-3 rounded-[7px] border-none cursor-pointer transition-all bg-red-glow border border-red/40 text-red hover:bg-red/20">
                ✗ Нет, есть проблемы
              </button>
            </div>
          )}

          {feedbackState === 'yes' && (
            <div className="font-mono text-[0.88rem] text-green p-3">
              🎉 Отлично! Рады за тебя. Первый слой — самый важный!
            </div>
          )}

          {feedbackState === 'no' && (
            <div className="mt-6 text-left bg-surface3 border border-border rounded-[10px] p-6">
              <div className="font-mono text-[0.82rem] text-text font-bold mb-4">Что пошло не так? (выбери одно или несколько)</div>
              <div className="flex flex-wrap gap-2 mb-5">
                {PROBLEM_CHIPS.map(chip => (
                  <div
                    key={chip.key}
                    onClick={() => toggleProblem(chip.key)}
                    className={`font-mono text-[0.72rem] px-3 py-1.5 rounded-[5px] border cursor-pointer transition-all ${
                      pickedProblems.has(chip.key)
                        ? 'border-orange text-orange bg-orange-glow'
                        : 'border-border bg-surface4 text-text3 hover:border-orange hover:text-orange hover:bg-orange-glow'
                    }`}
                  >
                    {chip.label}
                  </div>
                ))}
              </div>
              <button onClick={doRecalc} className="inline-flex items-center gap-2 bg-purple text-text font-mono text-[0.82rem] font-bold tracking-wide px-5 py-2.5 rounded-md border-none cursor-pointer transition-all hover:bg-purple/80 hover:shadow-[0_6px_20px_rgba(155,89,182,0.3)]">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 2A5.5 5.5 0 1 0 12 7" /><path d="M9 1.5h2.5V4" />
                </svg>
                Пересчитать с коррекцией
              </button>

              {recalcResult && (
                <div className="mt-5 bg-background border border-purple/20 rounded-lg p-5 font-mono text-[0.78rem] text-text2 leading-8">
                  <div className="text-purple font-bold mb-2 text-[0.8rem]">Коррекция параметров:</div>
                  {recalcResult.map((fix, i) => (
                    <div key={i} className="mb-1">
                      <span className="text-text3">{fix.l}:</span>{' '}
                      <span className="text-green font-bold">{fix.d}</span>
                      <span className="text-text3 text-[0.68rem] block ml-4">{fix.w}</span>
                    </div>
                  ))}
                  <div className="mt-3 text-[0.68rem] text-text3">Внеси изменения в слайсер и запусти пробную печать. Удачи!</div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
