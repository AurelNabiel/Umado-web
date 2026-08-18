import Link from "next/link";
import { EyeOff, Laugh, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Author Rahasia — Umado Art Hall",
  description: "Author karya memilih untuk tidak menampilkan identitasnya.",
};

export default function AnonymousAuthorPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4 py-28 sm:px-6">
      <div className="absolute inset-0 japanese-grid opacity-60" />
      <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-sky-100/70 blur-3xl" />
      <div className="absolute -right-20 bottom-16 h-64 w-64 rounded-full bg-orange-100/70 blur-3xl" />

      <section className="relative w-full max-w-xl rounded-[28px] border border-slate-100 bg-white/90 p-7 text-center shadow-xl backdrop-blur sm:rounded-[36px] sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-umado-navy text-white shadow-lg">
          <EyeOff className="h-9 w-9" />
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-umado-orange">
          <Laugh className="h-4 w-4" /> Author Mode Ninja
        </div>

        <h1 className="mt-5 text-3xl font-black leading-tight text-umado-navy sm:text-4xl">
          Waduh... author-nya memilih jadi misterius. 🥷
        </h1>

        <p className="mx-auto mt-4 max-w-md leading-7 text-slate-600">
          Author tidak ingin diketahui. Jadi identitasnya kami simpan rapat-rapat.
          Karyanya boleh dipandang, orangnya jangan dicari-cari dulu ya. 👀
        </p>

        <p className="mt-3 text-sm font-semibold text-slate-400">
          Tenang, admin juga akan pura-pura tidak tahu.
        </p>

        <Link
          href="/art-hall"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-umado-blue px-6 py-3 font-bold text-white shadow-lg shadow-sky-100 transition hover:-translate-y-0.5 hover:bg-sky-600"
        >
          <ArrowLeft className="h-4 w-4" /> Balik ke Art Hall
        </Link>
      </section>
    </main>
  );
}
