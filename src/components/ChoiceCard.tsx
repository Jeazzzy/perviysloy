interface ChoiceCardProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  name: string;
  sub: string;
}

export function ChoiceCard({ selected, onClick, icon, name, sub }: ChoiceCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface3 border rounded-[10px] p-4 cursor-pointer transition-all select-none hover:border-green/30 hover:bg-surface4 hover:-translate-y-0.5 ${
        selected ? 'border-green bg-green-glow' : 'border-border'
      }`}
    >
      <span className="text-xl mb-2 block leading-none">{icon}</span>
      <span className={`font-mono text-[0.78rem] font-medium block mb-0.5 ${selected ? 'text-green' : 'text-text'}`}>
        {name}
      </span>
      <span className="text-[0.7rem] text-text3">{sub}</span>
    </div>
  );
}
