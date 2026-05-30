const TIPS = [
  {
    icon: '📐', color: 'green' as const, title: 'Высота слоя и качество',
    text: 'Меньше слой — лучше качество, дольше печать. 0.2 мм — золотой стандарт для баланса скорости и детализации.',
    article: `**Как выбрать высоту слоя?**\n\nВысота слоя — это толщина одного горизонтального среза модели. Это ключевой параметр, влияющий на качество поверхности, прочность и время печати.\n\n• **0.1 мм** — максимальная детализация. Слои почти невидимы. Время печати увеличивается в 2 раза по сравнению с 0.2 мм.\n• **0.2 мм** — оптимальный баланс. Хорошее качество за разумное время. Подходит для 90% задач.\n• **0.28–0.32 мм** — быстрая печать для прототипов, где качество поверхности не критично.\n\n**Правило:** высота слоя не должна превышать 75% диаметра сопла. Для стандартного сопла 0.4 мм максимум — 0.3 мм.\n\n**Совет:** для функциональных деталей используй 0.2 мм. Для визуальных моделей (фигурки, корпуса) — 0.12–0.16 мм.`
  },
  {
    icon: '🌡️', color: 'purple' as const, title: 'Пластик и температура',
    text: 'Каждый пластик требует своего диапазона. Слишком низкая — плохая адгезия слоёв. Высокая — стрининг.',
    article: `**Температурные профили пластиков**\n\n**PLA (190–220°C)**\nСамый простой пластик. Начни с 215°C и снижай на 5°C, если появляется стрининг. Стол: 60°C или без подогрева.\n\n**ABS (230–250°C)**\nТребует закрытой камеры! Без неё углы будут коробиться. Стол 100–110°C. Обязательна вентиляция помещения — пары ABS токсичны.\n\n**PETG (225–240°C)**\nОчень гигроскопичен — просуши перед печатью! Стол 70–85°C. Не прижимай первый слой слишком сильно — PETG прилипает намертво к PEI.\n\n**TPU (210–230°C)**\nГибкий, печатается медленно (20–30 мм/с). Убери или минимизируй ретракцию — иначе застрянет в экструдере.\n\n**Как подобрать температуру?**\n1. Напечатай температурную башню (Temp Tower)\n2. Начни с середины рекомендованного диапазона\n3. Снижай на 5°C при стрининге, повышай при расслоении`
  },
  {
    icon: '⚡', color: 'green' as const, title: 'Скорость и адгезия',
    text: 'Высокая скорость экономит время, но снижает качество первого слоя. Первый слой — всегда медленнее.',
    article: `**Как скорость влияет на печать**\n\nСкорость печати — один из главных параметров, влияющий на качество, прочность и время.\n\n**Рекомендуемые скорости:**\n• Первый слой: 15–25 мм/с (критично для адгезии!)\n• Стенки (внешние): 30–40 мм/с\n• Заполнение: 60–80 мм/с\n• Перемещения: 120–150 мм/с\n\n**Ускорение (Acceleration)** — не менее важно, чем скорость. Высокое ускорение вызывает вибрации и «звон» (ringing/ghosting) на поверхности.\n\n**Jerk** — резкость изменения направления. Снижение Jerk до 5–8 мм/с убирает артефакты на углах.\n\n**Совет:** если деталь высокая (>80 мм), снижай скорость на 10–15% — вибрации накапливаются с высотой.`
  },
  {
    icon: '⚙️', color: 'purple' as const, title: 'Калибровка экструдера',
    text: 'Правильный поток критичен для точных размеров. Неправильная калибровка ведёт к лысинам или blob-ам.',
    article: `**Калибровка E-Steps и Flow**\n\n**E-Steps (шаги экструдера)** — сколько шагов мотор делает для подачи 1 мм филамента. Это калибруется один раз для каждого экструдера.\n\n**Как откалибровать E-Steps:**\n1. Отметь 120 мм от входа в экструдер\n2. Отправь команду: G1 E100 F100\n3. Измерь остаток от отметки до входа\n4. Если осталось не 20 мм, пересчитай:\n   Новые E-Steps = (текущие × 100) / (120 − остаток)\n5. Сохрани: M92 E[значение], затем M500\n\n**Flow (поток)** — тонкая подстройка поверх E-Steps. Калибруется для каждого пластика:\n1. Напечатай кубик 20×20×20 мм с 1 стенкой\n2. Измерь толщину стенки штангенциркулем\n3. Новый Flow = (ожидаемая толщина / фактическая) × 100%\n\n**Типичные значения Flow:** PLA 100%, PETG 93–97%, ABS 97–99%, TPU 90–95%`
  },
  {
    icon: '🛏️', color: 'green' as const, title: 'Температура стола',
    text: 'Тёплый стол улучшает прилипание. PLA — 60°C, ABS требует 100°C+ и закрытую камеру.',
    article: `**Температура стола и покрытия**\n\n**Зачем нужен нагрев стола?**\nНагретый стол помогает первому слою прилипнуть и снижает внутренние напряжения в детали. Без нагрева ABS и PETG коробятся.\n\n**Рекомендуемые температуры:**\n• PLA: 55–65°C (можно без нагрева на PEI)\n• PETG: 70–85°C\n• ABS: 100–110°C\n• TPU: 40–60°C\n\n**Покрытия стола:**\n• **PEI (Spring Steel)** — универсальное. PLA и PETG прилипают отлично. Для ABS лучше текстурированный PEI.\n• **Стекло** — ровная поверхность. Нужен клей или лак для волос.\n• **BuildTak** — хорошая адгезия, но изнашивается.\n\n**Важно:** после каждых 5–10 печатей протирай стол изопропиловым спиртом. Жир с пальцев — главный враг адгезии.\n\n**Brim и Raft:**\n• Brim (5–10 линий) — для деталей с малой площадью контакта\n• Raft — крайняя мера, портит нижнюю поверхность`
  },
];

import { useState } from 'react';
import type { ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

function renderMarkdown(text: string): ReactNode[] {
  const lines = text.split('\n');
  const nodes: ReactNode[] = [];
  lines.forEach((line, i) => {
    const parts: ReactNode[] = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      parts.push(<strong key={`b-${i}-${match.index}`} className="text-text font-bold">{match[1]}</strong>);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }
    nodes.push(<span key={`l-${i}`}>{parts.length ? parts : line}</span>);
    if (i < lines.length - 1) nodes.push(<br key={`br-${i}`} />);
  });
  return nodes;
}

export function Tips() {
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  const sectionRef = useScrollReveal();

  const isExpanded = expandedTip !== null;

  return (
    <div id="tips" className="border-t border-border" ref={sectionRef}>
      <section className="max-w-[1080px] mx-auto px-8 py-[4.5rem] max-md:px-6 max-md:py-12">
        <div className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-green mb-2">// объяснения</div>
        <h2 className="font-mono text-[clamp(1.4rem,2.8vw,2rem)] font-bold text-text tracking-tight mb-1 leading-tight">Почему именно такие параметры?</h2>
        <div className="w-12 h-0.5 bg-gradient-to-r from-green to-purple my-3 mb-8 rounded-sm" />

        {/* Mini-icon row for non-expanded tips (visible only when one is expanded) */}
        {isExpanded && (
          <div className="flex gap-2 mb-4 animate-fade-in">
            {TIPS.map((tip, i) => {
              if (i === expandedTip) return null;
              return (
                <button
                  key={i}
                  onClick={() => setExpandedTip(i)}
                  className={`w-[42px] h-[42px] rounded-[8px] flex items-center justify-center text-[1rem] transition-all hover:scale-110 hover:border-green/30 ${
                    tip.color === 'green' ? 'bg-green-glow border border-green/20' : 'bg-purple-glow border border-purple/20'
                  }`}
                  title={tip.title}
                >
                  {tip.icon}
                </button>
              );
            })}
          </div>
        )}

        {/* Expanded article (full width) */}
        {isExpanded && (
          <div className="animate-fade-in">
            <div
              className="bg-surface2 border border-green/30 rounded-[10px] overflow-hidden"
            >
              <div
                className="p-5 cursor-pointer flex items-center gap-3 hover:bg-surface3/50 transition-colors"
                onClick={() => setExpandedTip(null)}
              >
                <div className={`w-[34px] h-[34px] rounded-[7px] flex items-center justify-center text-[0.95rem] shrink-0 ${
                  TIPS[expandedTip].color === 'green' ? 'bg-green-glow border border-green/20' : 'bg-purple-glow border border-purple/20'
                }`}>
                  {TIPS[expandedTip].icon}
                </div>
                <div className="flex-1">
                  <div className="font-mono text-[0.82rem] font-bold text-text">{TIPS[expandedTip].title}</div>
                  <div className="text-[0.78rem] text-text3">{TIPS[expandedTip].text}</div>
                </div>
                <div className="font-mono text-[0.68rem] text-green shrink-0">▼ Скрыть</div>
              </div>
              <div className="border-t border-green/15 px-5 py-5 bg-surface3">
                <div className="text-[0.8rem] text-text2 leading-relaxed whitespace-pre-line font-sans max-w-none">
                  {TIPS[expandedTip].article}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid of cards (visible when nothing is expanded) */}
        {!isExpanded && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-[18px]">
            {TIPS.map((tip, i) => (
              <div
                key={i}
                className="bg-surface2 border border-border rounded-[10px] p-5 transition-all hover:border-green/20 hover:-translate-y-0.5 cursor-pointer"
                onClick={() => setExpandedTip(i)}
              >
                <div className={`w-[34px] h-[34px] rounded-[7px] flex items-center justify-center mb-3 text-[0.95rem] ${
                  tip.color === 'green' ? 'bg-green-glow border border-green/20' : 'bg-purple-glow border border-purple/20'
                }`}>
                  {tip.icon}
                </div>
                <div className="font-mono text-[0.82rem] font-bold text-text mb-1">{tip.title}</div>
                <div className="text-[0.82rem] text-text3 leading-relaxed">{tip.text}</div>
                <div className="mt-3 font-mono text-[0.68rem] text-green flex items-center gap-1">
                  ▶ Подробная статья
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
