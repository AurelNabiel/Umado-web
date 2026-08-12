import Image from "next/image";
import Link from "next/link";
import { Instagram, Mail, MapPin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-umado-navy text-white">
      <div className="absolute inset-0 wave-pattern opacity-20" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-5 sm:py-14 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <Image
              src="/assets/Umado.png"
              alt="Umado"
              width={64}
              height={64}
              className="h-14 w-14 object-contain"
            />
            <div>
              <div className="text-xl font-black tracking-[.14em]">UMADO</div>
              <div className="text-xs text-sky-200">
                Organisasi kreatif Unsada
              </div>
            </div>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-300">
            Komunitas kreatif untuk berkarya bersama melalui
            suara, manga, dan dance performance.
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-bold">Jelajahi</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <Link className="block hover:text-white" href="/about">
              Tentang Kami
            </Link>
            <Link className="block hover:text-white" href="/divisions">
              Divisi
            </Link>
            <Link className="block hover:text-white" href="/gallery">
              Galeri
            </Link>
            <Link className="block hover:text-white" href="/organization">
              Struktur Organisasi
            </Link>
            <Link className="block hover:text-white" href="/faq">
              FAQ
            </Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold">Kontak</h3>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex min-w-0 gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Jl. Taman Malaka
              Selatan No.8, RT.8/RW.6, Pd. Klp., Kec. Duren Sawit, Kota Jakarta
              Timur, Daerah Khusus Ibukota Jakarta 13450
            </div>
            <div className="flex min-w-0 gap-2">
              <Mail className="h-4 w-4 shrink-0" /> -{" "}
            </div>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold">Ikuti Umado</h3>
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/umado_/"
              aria-label="Instagram"
              className="rounded-full bg-white/10 p-3 hover:bg-umado-blue"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.youtube.com/@umadotv904"
              aria-label="Youtube"
              className="rounded-full bg-white/10 p-3 hover:bg-umado-blue"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10 px-5 py-5 text-center text-xs text-slate-400">
        © 2026 Umado Club. All rights reserved.
      </div>
    </footer>
  );
}
