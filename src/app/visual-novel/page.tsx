export default function VisualNovelPage() {
  return (
    <section className="bg-slate-950 px-2 pb-4 pt-20 sm:px-5 sm:pb-8 sm:pt-28">
      <div className="mx-auto mb-3 flex max-w-6xl items-center justify-between gap-3 px-1 sm:mb-4 sm:px-0">
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-[.2em] text-sky-300 sm:text-xs sm:tracking-[.24em]">
            Visual Novel
          </div>
          <h1 className="mt-0.5 truncate text-lg font-black text-white sm:mt-1 sm:text-2xl">
            Kurabu 2026
          </h1>
        </div>

        <a
          href="/"
          className="shrink-0 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/20 sm:px-4 sm:text-sm"
        >
          Kembali
          <span className="hidden sm:inline"> ke Beranda</span>
        </a>
      </div>

      <div className="mx-auto max-w-6xl overflow-hidden rounded-[18px] border border-white/10 bg-black shadow-2xl sm:rounded-[28px]">
        <iframe
          title="Kurabu 2026 Visual Novel"
          src="/visual-novel/kurabu.html"
          className="block h-[calc(100svh-8.5rem)] min-h-[520px] max-h-[760px] w-full border-0 sm:h-[720px] sm:max-h-none lg:h-[780px]"
          allow="autoplay"
        />
      </div>

      <p className="mx-auto mt-2 max-w-6xl text-center text-[11px] text-slate-500 sm:hidden">
        Tap area cerita atau tombol Next untuk melanjutkan.
      </p>
    </section>
  );
}
