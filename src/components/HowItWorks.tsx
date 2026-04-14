import { useScrollReveal } from '@/hooks/useScrollReveal';

const STEPS = [
  { icon: '🖨️', label: 'Принтер', sub: 'Знаем настройки каждой модели' },
  { icon: '✂️', label: 'Слайсер', sub: 'Адаптируем под его термины' },
  { icon: '📦', label: 'STL + пластик', sub: 'Корректируем по геометрии' },
  { icon: '✅', label: 'Результат', sub: 'Параметры + обратная связь' },
];

export function HowItWorks() {
  const ref = useScrollReveal();
  return (
    <div id="how" className="bg-surface2 border-t border-b border-border" ref={ref}>
      <section className="max-w-[1080px] mx-auto px-8 py-[4.5rem] max-md:px-6 max-md:py-12">
        <div className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-green mb-2">// принцип работы</div>
        <h2 className="font-mono text-[clamp(1.4rem,2.8vw,2rem)] font-bold text-text tracking-tight mb-1 leading-tight">Как работает «ПервыйСлой»</h2>
        <div className="w-12 h-0.5 bg-gradient-to-r from-green to-purple my-3 mb-8 rounded-sm" />
        <div className="relative grid grid-cols-4 gap-0 mt-8 max-md:grid-cols-2 max-md:gap-6">
          <div className="absolute top-[19px] left-[12%] right-[12%] h-px bg-gradient-to-r from-green to-purple opacity-20 max-md:hidden" />
          {STEPS.map((step, i) => (
            <div key={i} className="text-center px-3 relative z-[2]">
              <div className={`w-[38px] h-[38px] rounded-full flex items-center justify-center mx-auto mb-3 text-[0.9rem] ${
                i === 0 ? 'border-green bg-green-glow border' : i === 3 ? 'border-purple bg-purple-glow border' : 'bg-surface3 border border-border'
              }`}>
                {step.icon}
              </div>
              <div className="font-mono text-[0.72rem] text-text font-medium mb-0.5">{step.label}</div>
              <div className="text-[0.68rem] text-text3">{step.sub}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
