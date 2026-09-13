export default function SectionTitle({ eyebrow, title, description, center = false }: { eyebrow?: string; title: string; description?: string; center?: boolean }) {
  return <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
    {eyebrow && <div className="mb-3 break-words text-[11px] font-black uppercase tracking-[.2em] text-umado-blue sm:text-xs sm:tracking-[.28em]">{eyebrow}</div>}
    <h2 className="break-words text-2xl font-black leading-tight text-umado-navy sm:text-3xl md:text-4xl lg:text-5xl">{title}</h2>
    {description && <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{description}</p>}
  </div>;
}
