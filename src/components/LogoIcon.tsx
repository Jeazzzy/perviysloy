export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 30" fill="none" width={30} height={30}>
      <rect x="3" y="23" width="24" height="4" rx="1" fill="#00e070" opacity="0.95" />
      <rect x="5" y="17" width="20" height="4" rx="1" fill="#00e070" opacity="0.68" />
      <rect x="8" y="11" width="14" height="4" rx="1" fill="#9b59b6" opacity="0.6" />
      <rect x="11" y="5" width="8" height="4" rx="1" fill="#9b59b6" opacity="0.35" />
    </svg>
  );
}
