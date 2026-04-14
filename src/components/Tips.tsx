const TIPS = [
  { icon: '📐', color: 'green' as const, title: 'Высота слоя и качество', text: 'Меньше слой — лучше качество, дольше печать. 0.2 мм — золотой стандарт для баланса скорости и детализации.' },
  { icon: '🌡️', color: 'purple' as const, title: 'Пластик и температура', text: 'Каждый пластик требует своего диапазона. Слишком низкая — плохая адгезия слоёв. Высокая — стрининг.' },
  { icon: '⚡', color: 'green' as const, title: 'Скорость и адгезия', text: 'Высокая скорость экономит время, но снижает качество первого слоя. Первый слой — всегда медленнее.' },
  { icon: '⚙️', color: 'purple' as const, title: 'Калибровка экструдера', text: 'Правильный поток критичен для точных размеров. Неправильная калибровка ведёт к лысинам или blob-ам.' },
  { icon: '🛏️', color: 'green' as const, title: 'Температура стола', text: 'Тёплый стол улучшает прилипание. PLA — 60°C, ABS требует 100°C+ и закрытую камеру.' },
];

export function Tips() {
  return (
    <div id="tips" className="border-t border-border">
      <section className="max-w-[1080px] mx-auto px-8 py-[4.5rem] max-md:px-6 max-md:py-12">
        <div className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-green mb-2">// объяснения</div>
        <h2 className="font-mono text-[clamp(1.4rem,2.8vw,2rem)] font-bold text-text tracking-tight mb-1 leading-tight">Почему именно такие параметры?</h2>
        <div className="w-12 h-0.5 bg-gradient-to-r from-green to-purple my-3 mb-8 rounded-sm" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-[18px]">
          {TIPS.map((tip, i) => (
            <div key={i} className="bg-surface2 border border-border rounded-[10px] p-5 transition-all hover:border-green/20 hover:-translate-y-0.5">
              <div className={`w-[34px] h-[34px] rounded-[7px] flex items-center justify-center mb-3 text-[0.95rem] ${
                tip.color === 'green' ? 'bg-green-glow border border-green/20' : 'bg-purple-glow border border-purple/20'
              }`}>
                {tip.icon}
              </div>
              <div className="font-mono text-[0.82rem] font-bold text-text mb-1">{tip.title}</div>
              <div className="text-[0.82rem] text-text3 leading-relaxed">{tip.text}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
