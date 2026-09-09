"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X, ZoomIn } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { galleryItems } from "@/lib/data";

type GalleryItem = (typeof galleryItems)[number];

const SORT_OPTIONS = [
  { value: "default", label: "Terbaru" },
  { value: "az", label: "Nama A-Z" },
  { value: "za", label: "Nama Z-A" },
  { value: "category", label: "Kategori" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

// Jarak swipe minimum (px) supaya gesture dianggap "geser", bukan tap.
const SWIPE_THRESHOLD = 45;
const PAGE_SIZE = 12;

export default function GalleryGrid() {
  const categories = useMemo(
    () => Array.from(new Set(galleryItems.map((item) => item.category))),
    []
  );

  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [sortBy, setSortBy] = useState<SortValue>("default");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const touchStartX = useRef<number | null>(null);

  const visibleItems = useMemo(() => {
    const filtered =
      activeCategory === "Semua"
        ? [...galleryItems]
        : galleryItems.filter((item) => item.category === activeCategory);

    switch (sortBy) {
      case "az":
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case "za":
        return filtered.sort((a, b) => b.title.localeCompare(a.title));
      case "category":
        return filtered.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return filtered;
    }
  }, [activeCategory, sortBy]);

  const totalPages = Math.max(1, Math.ceil(visibleItems.length / PAGE_SIZE));

  // Balik ke halaman 1 tiap kali filter/sort berubah.
  useEffect(() => {
    setPage(1);
  }, [activeCategory, sortBy]);

  // Jaga-jaga kalau halaman aktif jadi tidak valid (mis. filter berkurang banyak).
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return visibleItems.slice(start, start + PAGE_SIZE);
  }, [visibleItems, page]);

  const selected: GalleryItem | null =
    selectedIndex !== null ? visibleItems[selectedIndex] ?? null : null;

  const goTo = (direction: 1 | -1) => {
    setSelectedIndex((current) => {
      if (current === null) return current;
      const next = (current + direction + visibleItems.length) % visibleItems.length;
      // ikut pindahkan halaman grid supaya tetap sinkron dengan foto yang dilihat
      setPage(Math.floor(next / PAGE_SIZE) + 1);
      return next;
    });
  };

  // Navigasi pakai tombol panah keyboard & Escape saat lightbox terbuka.
  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowRight") goTo(1);
      if (event.key === "ArrowLeft") goTo(-1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, visibleItems.length]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    // Geser ke kanan (deltaX positif) -> foto sebelumnya, sebaliknya -> berikutnya.
    goTo(deltaX > 0 ? -1 : 1);
  };

  return (
    <>
      {/* Filter kategori + sort */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {["Semua", ...categories].map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
                  active
                    ? "bg-umado-navy text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-umado-blue"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <label className="flex items-center gap-2 self-start text-xs font-bold text-slate-500 sm:self-auto sm:text-sm">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-umado-blue" />
          <span className="hidden sm:inline">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortValue)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 font-bold text-umado-navy outline-none focus:border-umado-blue"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visibleItems.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-200 p-10 text-center text-slate-500">
          Belum ada foto untuk kategori ini.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {pagedItems.map((item, i) => {
              const globalIndex = (page - 1) * PAGE_SIZE + i;
              return (
                <button
                  key={`${item.title}-${item.image}`}
                  onClick={() => setSelectedIndex(globalIndex)}
                  className="group relative w-full overflow-hidden rounded-[22px] sm:rounded-[28px] border border-slate-100 bg-slate-50 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sky-50 to-orange-50">
                    <Image src={item.image} alt={item.title} fill className="object-cover p-3 transition duration-500 sm:p-5 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                    <ZoomIn className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/90 p-2.5 text-umado-navy opacity-0 transition group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/35 p-4 backdrop-blur-sm sm:p-5">
                      <div className="text-xs font-black uppercase tracking-widest text-sky-300 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">{item.category}</div>
                      <div className="mt-1 text-lg font-bold leading-snug text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]">{item.title}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {totalPages > 1 && (
            <p className="mt-8 text-center text-xs font-semibold text-slate-400 sm:mt-10">
              Menampilkan {(page - 1) * PAGE_SIZE + 1}
              {"–"}
              {Math.min(page * PAGE_SIZE, visibleItems.length)} dari {visibleItems.length} foto
            </p>
          )}

          {totalPages > 1 && (
            <nav
              aria-label="Navigasi halaman galeri"
              className="mt-3 flex flex-wrap items-center justify-center gap-2"
            >
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-sky-50 hover:text-umado-blue disabled:pointer-events-none disabled:opacity-40 sm:text-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  aria-current={p === page ? "page" : undefined}
                  className={`h-9 min-w-9 rounded-full px-3 text-xs font-bold transition sm:text-sm ${
                    p === page
                      ? "bg-umado-navy text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-umado-blue"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-sky-50 hover:text-umado-blue disabled:pointer-events-none disabled:opacity-40 sm:text-sm"
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          )}
        </>
      )}

      {selected && (
        <div
          onClick={() => setSelectedIndex(null)}
          className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/80 p-3 sm:p-5 backdrop-blur-sm"
        >
          <button
            onClick={() => setSelectedIndex(null)}
            aria-label="Tutup"
            className="absolute right-3 top-3 z-10 rounded-full bg-white p-2.5 text-slate-900 sm:right-5 sm:top-5 sm:p-3"
          >
            <X />
          </button>

          {visibleItems.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(-1);
                }}
                aria-label="Foto sebelumnya"
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-slate-900 transition hover:bg-white sm:left-5 sm:p-3"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(1);
                }}
                aria-label="Foto berikutnya"
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-slate-900 transition hover:bg-white sm:right-5 sm:p-3"
              >
                <ChevronRight />
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="relative h-[72vh] w-full max-w-4xl touch-pan-y select-none overflow-hidden rounded-[22px] bg-white sm:h-[80vh] sm:rounded-[30px]"
          >
            <Image
              key={selected.image}
              src={selected.image}
              alt={selected.title}
              fill
              draggable={false}
              className="animate-[gallery-fade_.25s_ease] object-contain p-3 sm:p-8"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-white/10 bg-black/55 p-4 backdrop-blur-sm sm:p-6">
              <div className="min-w-0">
                <div className="text-xs font-black uppercase tracking-widest text-sky-300 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
                  {selected.category}
                </div>
                <div className="truncate text-base font-bold text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.7)] sm:text-lg">
                  {selected.title}
                </div>
              </div>
              {visibleItems.length > 1 && selectedIndex !== null && (
                <div className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white">
                  {selectedIndex + 1} / {visibleItems.length}
                </div>
              )}
            </div>
          </div>

          {visibleItems.length > 1 && (
            <p className="mt-3 text-center text-xs text-slate-400 sm:hidden">
              Geser foto ke kiri / kanan untuk melihat lainnya
            </p>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes gallery-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
