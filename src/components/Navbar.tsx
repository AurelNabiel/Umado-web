"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  ["/", "Beranda"],
  ["/about", "Tentang"],
  ["/gallery", "Galeri"],
  ["/divisions", "Divisi"],
  ["/art-hall", "Art Hall"],
  ["/contact", "Kontak"],
  ["/faq", "FAQ"],
  ["/organization", "Struktur Organisasi"],
];

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? "bg-white/95 shadow-md backdrop-blur" : "bg-white/75 backdrop-blur-sm"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-5 sm:py-3 lg:px-8">
        <Link href="/" className="min-w-0 flex items-center gap-2.5 sm:gap-3">
          <Image src="/assets/Umado.png" alt="Umado Club" width={58} height={58} className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12" priority />
          <div className="min-w-0">
            <div className="text-base font-black tracking-[0.13em] text-umado-navy sm:text-lg sm:tracking-[0.16em]">UMADO</div>
            <div className="max-w-[170px] truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-umado-blue sm:max-w-none sm:text-[10px] sm:tracking-[0.22em]">Organisasi kreatif Unsada</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map(([href, label]) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return <Link key={href} href={href} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-umado-navy text-white" : "text-slate-600 hover:bg-sky-50 hover:text-umado-blue"}`}>{label}</Link>;
          })}
          <Link href="/register" className="ml-2 rounded-full bg-umado-blue px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-600">Gabung Umado</Link>
        </nav>

        <button onClick={() => setOpen(!open)} className="shrink-0 rounded-xl border border-slate-200 p-2 text-umado-navy lg:hidden" aria-label="Buka menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-slate-100 bg-white px-4 pb-5 pt-3 sm:px-5 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map(([href, label]) => <Link key={href} href={href} className="rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-sky-50">{label}</Link>)}
            <Link href="/register" className="mt-2 rounded-xl bg-umado-blue px-4 py-3 text-center font-bold text-white">Gabung Umado</Link>
          </div>
        </div>
      )}
    </header>
  );
}
