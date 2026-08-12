import Reveal from "./Reveal";

export default function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="relative overflow-hidden bg-umado-navy pt-24 text-white torii-ring sm:pt-28 lg:pt-32">
      <div className="absolute inset-0 japanese-grid opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-20">
        <Reveal>
          <p className="mb-3 break-words text-xs font-bold uppercase tracking-[.2em] text-sky-300 sm:mb-4 sm:text-sm sm:tracking-[.28em]">{eyebrow}</p>
          <h1 className="max-w-4xl break-words text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:mt-5 sm:text-base md:text-lg">{description}</p>
        </Reveal>
      </div>
    </section>
  );
}
