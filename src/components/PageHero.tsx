import Reveal from "./Reveal";

export default function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="relative overflow-hidden bg-umado-navy pt-32 text-white torii-ring">
      <div className="absolute inset-0 japanese-grid opacity-30" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <Reveal>
          <p className="mb-4 text-sm font-bold uppercase tracking-[.28em] text-sky-300">{eyebrow}</p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">{description}</p>
        </Reveal>
      </div>
    </section>
  );
}
