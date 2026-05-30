import { LogoIcon } from './LogoIcon';

interface HeaderProps {
  onOpenProblems: () => void;
}

export function Header({ onOpenProblems }: HeaderProps) {
  return (
    <header className="sticky top-0 z-200 bg-background/93 backdrop-blur-[14px] border-b border-border px-8 h-[62px] flex items-center justify-between">
      <a href="#" className="flex items-center gap-2.5 no-underline">
        <LogoIcon />
        <span className="font-mono text-base font-bold text-text tracking-tight">
          Первый<span className="text-green">Слой</span>
        </span>
      </a>
      <nav className="flex items-center gap-5 flex-nowrap">
        <a
          href="/account"
          className="inline-flex items-center gap-1.5 font-mono text-[0.73rem] tracking-wide px-3 py-1.5 rounded-[5px] cursor-pointer transition-all bg-surface3 border border-border text-text hover:border-green/40 hover:text-green no-underline"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="hidden sm:inline">Личный кабинет</span>
        </a>
        <a
          href="https://t.me/perviy_sloy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[0.73rem] tracking-wide px-3 py-1.5 rounded-[5px] cursor-pointer transition-all border no-underline"
          style={{ background: 'rgba(36,160,232,0.15)', borderColor: 'rgba(36,160,232,0.4)', color: '#24A0E8' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
            <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
          </svg>
          <span className="hidden sm:inline">Следите за нами</span>
        </a>
        <button
          onClick={onOpenProblems}
          className="inline-flex items-center gap-1.5 font-mono text-[0.73rem] tracking-wide px-3 py-1.5 rounded-[5px] cursor-pointer transition-all bg-orange-glow border border-orange/30 text-orange hover:bg-orange/20"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-orange shrink-0" />
          <span className="hidden sm:inline">Проблемы печати</span>
        </button>
        <a href="#how" className="font-mono text-xs text-text3 no-underline tracking-wider transition-colors hover:text-green whitespace-nowrap">
          Как работает
        </a>
        <a href="#contact" className="font-mono text-xs text-text3 no-underline tracking-wider transition-colors hover:text-green whitespace-nowrap">
          Контакты
        </a>
      </nav>
    </header>
  );
}
