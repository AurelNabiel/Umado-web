"use client";

import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { useState } from "react";
import { galleryItems } from "@/lib/data";

export default function GalleryGrid() {
  const [selected, setSelected] = useState<(typeof galleryItems)[number] | null>(null);
  return <>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {galleryItems.map((item, i) => (
        <button key={`${item.title}-${i}`} onClick={() => setSelected(item)} className="group relative overflow-hidden rounded-[28px] border border-slate-100 bg-slate-50 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sky-50 to-orange-50">
            <Image src={item.image} alt={item.title} fill className="object-cover p-5 transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-umado-navy/80 via-transparent to-transparent opacity-75" />
            <ZoomIn className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/90 p-2.5 text-umado-navy opacity-0 transition group-hover:opacity-100" />
            <div className="absolute bottom-0 p-5 text-white"><div className="text-xs font-bold uppercase tracking-widest text-sky-200">{item.category}</div><div className="mt-1 text-lg font-bold">{item.title}</div></div>
          </div>
        </button>
      ))}
    </div>
    {selected && <div onClick={() => setSelected(null)} className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/80 p-5 backdrop-blur-sm">
      <button className="absolute right-5 top-5 rounded-full bg-white p-3 text-slate-900"><X /></button>
      <div onClick={e => e.stopPropagation()} className="relative h-[80vh] w-full max-w-4xl overflow-hidden rounded-[30px] bg-white">
        <Image src={selected.image} alt={selected.title} fill className="object-contain p-8" />
      </div>
    </div>}
  </>;
}
