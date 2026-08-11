export default function SectionTitle({ eyebrow, title, description, center = false }: { eyebrow?: string; title: string; description?: string; center?: boolean }) {
  return <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
    {eyebrow && <div className="mb-3 text-xs font-black uppercase tracking-[.28em] text-umado-blue">{eyebrow}</div>}
    <h2 className="text-3xl font-black leading-tight text-umado-navy md:text-5xl">{title}</h2>
    {description && <p className="mt-4 leading-7 text-slate-600">{description}</p>}
  </div>;
}
