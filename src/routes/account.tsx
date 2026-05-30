import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({
    meta: [
      { title: "Личный кабинет — ПервыйСлой" },
      { name: "description", content: "Личный кабинет ПервыйСлой находится в разработке." },
    ],
  }),
});

function AccountPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-[560px] w-full bg-surface2 border border-border rounded-[14px] p-10 text-center">
        <div className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-green mb-3">// личный кабинет</div>
        <h1 className="font-mono text-[clamp(1.6rem,3vw,2.2rem)] font-bold text-text leading-tight mb-4">
          Скоро здесь будет твой кабинет
        </h1>
        <p className="text-text3 text-[0.95rem] leading-relaxed mb-8">
          Личный кабинет находится в разработке.<br />
          С любовью, команда <span className="text-green">ПервыйСлой</span> 💚
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-green text-background font-mono text-[0.82rem] font-bold tracking-wide px-6 py-3 rounded-lg no-underline transition-all hover:bg-[#00ff90] hover:-translate-y-0.5"
        >
          ← На главную
        </Link>
      </div>
    </main>
  );
}