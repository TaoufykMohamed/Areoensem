export default function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="bg-[#04101f] px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        {eyebrow && (
          <div className="mb-4 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
            — {eyebrow}
          </div>
        )}
        <h1 className="font-serif text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-xl text-white/60">{subtitle}</p>}
      </div>
    </section>
  );
}
