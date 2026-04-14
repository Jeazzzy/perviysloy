import { useState } from 'react';

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setSending(true);
    // Simulate sending — in production wire to a server function
    await new Promise(r => setTimeout(r, 600));
    setSending(false);
    setEmail('');
    setSubmitted(true);
  };

  return (
    <div id="contact">
      <section className="max-w-[1080px] mx-auto px-8 py-[4.5rem] text-center max-md:px-6 max-md:py-12">
        <div className="inline-block bg-surface2 border border-border rounded-2xl px-14 py-11 max-w-[500px] w-full text-left max-md:px-5 max-md:py-7">
          <div className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-green mb-2">// демо-доступ</div>
          <h2 className="font-mono text-[clamp(1.4rem,2.8vw,2rem)] font-bold text-text tracking-tight mb-1 leading-tight">
            Хочешь попробовать<br />«ПервыйСлой»?
          </h2>
          <p className="text-text3 text-[0.88rem] mb-7">Оставь email или Telegram — пришлём приглашение с профилями и историей настроек.</p>
          {!submitted ? (
            <>
              <div className="flex gap-2 max-md:flex-col">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="твой@email.com или @telegram"
                  className="flex-1 bg-background border border-border rounded-md px-3.5 py-2.5 text-text font-sans text-[0.88rem] outline-none transition-colors focus:border-green placeholder:text-text3"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!email.trim() || sending}
                  className="inline-flex items-center justify-center gap-2 bg-green text-background font-mono text-[0.85rem] font-bold tracking-wide px-7 py-3.5 rounded-md border-none cursor-pointer transition-all hover:bg-[#00ff90] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,224,112,0.28)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? '...' : 'Получить доступ'}
                </button>
              </div>
            </>
          ) : (
            <div className="bg-green-glow border border-green/30 rounded-lg p-4 font-mono text-[0.82rem] text-green text-center">
              ✓ Отлично! Мы свяжемся скоро. Проверь почту или Telegram.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
