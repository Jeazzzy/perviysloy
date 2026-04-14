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
