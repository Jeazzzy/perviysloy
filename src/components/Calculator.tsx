import { ChoiceCard } from './ChoiceCard';
import { StlUpload } from './StlUpload';
import { PRINTER_OPTIONS, SLICER_OPTIONS, FILAMENT_OPTIONS, type StlInfo } from '@/data/calculator-data';

interface CalculatorProps {
  printer: string | null;
  slicer: string | null;
  filament: string | null;
  stlInfo: StlInfo | null;
  onSelectPrinter: (v: string) => void;
  onSelectSlicer: (v: string) => void;
  onSelectFilament: (v: string) => void;
  onStlLoaded: (info: StlInfo) => void;
  onCalculate: () => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-green mb-2">{children}</div>;
}

function Divider() {
  return <div className="w-12 h-0.5 bg-gradient-to-r from-green to-purple my-3 mb-8 rounded-sm" />;
}

export function Calculator({ printer, slicer, filament, stlInfo, onSelectPrinter, onSelectSlicer, onSelectFilament, onStlLoaded, onCalculate }: CalculatorProps) {
  const ready = !!(printer && slicer && filament);

  return (
    <div id="calculator" className="bg-surface2 border-t border-b border-border">
      <section className="max-w-[1080px] mx-auto px-8 py-20 max-md:px-6 max-md:py-12">
        {/* Step 1 */}
        <SectionLabel>// шаг 1</SectionLabel>
        <h2 className="font-mono text-[clamp(1.4rem,2.8vw,2rem)] font-bold text-text tracking-tight mb-1 leading-tight">Выбери принтер</h2>
        <Divider />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5 mb-6">
          {PRINTER_OPTIONS.map((p) => (
            <ChoiceCard key={p.value} selected={printer === p.value} onClick={() => onSelectPrinter(p.value)} icon={p.icon} name={p.name} sub={p.sub} />
          ))}
        </div>

        {/* Step 2 */}
        <div className="mt-12">
          <SectionLabel>// шаг 2</SectionLabel>
          <h2 className="font-mono text-[clamp(1.4rem,2.8vw,2rem)] font-bold text-text tracking-tight mb-1 leading-tight">Выбери слайсер</h2>
          <Divider />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5 mb-6">
            {SLICER_OPTIONS.map((s) => (
              <ChoiceCard key={s.value} selected={slicer === s.value} onClick={() => onSelectSlicer(s.value)} icon={s.icon} name={s.name} sub={s.sub} />
            ))}
          </div>
        </div>

        {/* Step 3 */}
        <div className="mt-12">
          <SectionLabel>// шаг 3</SectionLabel>
          <h2 className="font-mono text-[clamp(1.4rem,2.8vw,2rem)] font-bold text-text tracking-tight mb-1 leading-tight">Выбери пластик</h2>
          <Divider />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5 mb-6">
            {FILAMENT_OPTIONS.map((f) => (
              <ChoiceCard
                key={f.value}
                selected={filament === f.value}
                onClick={() => onSelectFilament(f.value)}
                icon={<><span className="inline-block w-2.5 h-2.5 rounded-full mr-1 align-middle" style={{ background: f.color }} />{f.name}</>}
                name=""
                sub={f.sub}
              />
            ))}
          </div>
        </div>

        {/* Step 4 */}
        <div className="mt-12">
          <SectionLabel>// шаг 4 — необязательно</SectionLabel>
          <h2 className="font-mono text-[clamp(1.4rem,2.8vw,2rem)] font-bold text-text tracking-tight mb-1 leading-tight">Загрузи 3D-модель</h2>
          <Divider />
          <p className="text-text3 text-[0.88rem] mb-8">Загрузи STL-файл — анализируем геометрию и корректируем параметры под твою деталь.</p>
          <StlUpload onStlLoaded={onStlLoaded} stlInfo={stlInfo} />
        </div>

        {/* Calculate */}
        <div className="flex justify-center mt-12">
          <button
            disabled={!ready}
            onClick={onCalculate}
            className="inline-flex items-center gap-2.5 bg-green text-background font-mono text-[0.88rem] font-bold tracking-wide px-10 py-4 rounded-lg border-none cursor-pointer transition-all hover:bg-[#00ff90] hover:shadow-[0_8px_32px_rgba(0,224,112,0.32)] hover:-translate-y-0.5 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="8" r="6" />
              <path d="M8 5v3l2 2" />
            </svg>
            Рассчитать параметры
          </button>
        </div>
      </section>
    </div>
  );
}
