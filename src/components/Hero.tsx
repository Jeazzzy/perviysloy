export function Hero() {
  return (
    <div className="min-h-[88vh] flex items-center px-8 py-24 max-w-[1200px] mx-auto gap-16 max-md:flex-col max-md:px-6 max-md:py-16 max-md:gap-10">
      <div className="flex-1 max-w-[600px]">
        <div className="inline-flex items-center gap-1.5 bg-green-glow border border-green/30 rounded-full px-3 py-1 font-mono text-[0.68rem] text-green tracking-widest uppercase mb-6">
          <span className="w-1.5 h-1.5 bg-green rounded-full animate-[pulse-dot_2s_infinite]" />
          Beta · Калькулятор 3D-печати
        </div>
        <h1 className="font-mono text-[clamp(1.9rem,4vw,3.1rem)] font-bold text-text leading-[1.15] tracking-tight mb-5">
          Твой первый <span className="text-green">успешный</span>
          <br />слой на<br />
          <span className="text-purple">3D-принтере</span>
        </h1>
        <p className="text-base text-text2 leading-7 mb-10 max-w-[480px]">
          Выбери принтер, загрузи STL-модель, выбери пластик — получи точные параметры и объяснения без жаргона.
        </p>
        <a
          href="#calculator"
          className="inline-flex items-center gap-2 bg-green text-background font-mono text-[0.85rem] font-bold tracking-wide px-7 py-3.5 rounded-md no-underline transition-all hover:bg-[#00ff90] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,224,112,0.28)] active:translate-y-0"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 2v10M3 8l4 4 4-4" />
          </svg>
          Начать настройку
        </a>
      </div>
      <div className="flex-1 max-w-[420px] flex justify-center max-md:hidden">
        <div className="bg-surface2 border border-border rounded-xl p-7 w-full max-w-[350px]">
          <div className="bg-background border border-border rounded-lg p-4 font-mono text-[0.72rem]">
            <div className="leading-[1.85] text-green">$ printer: Ender-3 Pro</div>
            <div className="leading-[1.85] text-green">$ slicer: Cura 5.x</div>
            <div className="leading-[1.85] text-green">$ filament: PLA</div>
            <div className="leading-[1.85] text-text3">─────────────────</div>
            <div className="leading-[1.85] text-green">layer_h: <b>0.20 mm</b></div>
            <div className="leading-[1.85] text-green">speed: <b>50 mm/s</b></div>
            <div className="leading-[1.85] text-purple">temp_nozzle: <b>215°C</b></div>
            <div className="leading-[1.85] text-purple">temp_bed: <b>60°C</b></div>
            <div className="leading-[1.85] text-text3">─────────────────</div>
            <div className="leading-[1.85] text-green">status: READY ✓</div>
          </div>
          <div className="flex flex-col gap-[3px] mt-4">
            {[100, 93, 84, 73, 54].map((w, i) => (
              <div
                key={i}
                className="h-[7px] rounded-sm"
                style={{
                  width: `${w}%`,
                  opacity: i === 4 ? 0.22 : 0.9 - i * 0.18,
                  background: i === 4 ? 'var(--purple)' : 'var(--green)',
                  animation: `grow-bar 0.6s ease-out ${0.1 + i * 0.1}s both`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
