"use client";

import Image from "next/image";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

const floatingImages = [
  {
    src: "/assets/tcg/TCG1.jpg",
    alt: "TCG Competition Mola",
    className:
      "left-1 top-1 h-16 w-16 rotate-[-8deg] sm:-left-16 sm:-top-10 sm:h-32 sm:w-32",
    delay: "0s",
  },
  {
    src: "/assets/tcg/TGC2.jpg",
    alt: "UI TCG Invitation",
    className:
      "right-12 top-1 h-16 w-16 rotate-[7deg] sm:-right-16 sm:-top-8 sm:h-32 sm:w-32",
    delay: ".45s",
  },
  {
    src: "/assets/tcg/TGC3.jpg",
    alt: "Share knowledge TCG",
    className:
      "right-2 top-16 h-16 w-16 rotate-[6deg] sm:-bottom-14 sm:right-10 sm:top-auto sm:h-32 sm:w-32",
    delay: ".9s",
  },
];

export default function TcgBubble() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end sm:bottom-7 sm:right-7">
        <div className="mb-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-umado-navy shadow-lg ring-1 ring-sky-100 sm:text-xs">
          Psst... klik aku! 👀
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buka informasi sub divisi Manga TCG"
          className="tcg-bubble group relative h-20 w-20 rounded-full border-4 border-white bg-gradient-to-br from-sky-100 to-orange-100 shadow-[0_14px_35px_rgba(10,36,66,.28)] transition hover:scale-110 focus:outline-none focus:ring-4 focus:ring-sky-300 sm:h-24 sm:w-24"
        >
          <span className="absolute -inset-2 -z-10 rounded-full bg-umado-blue/20 tcg-ring" />
          <Image
            src="/assets/tcg/umarizz.png"
            alt="Maskot Umado untuk TCG"
            fill
            sizes="100px"
            className="rounded-full object-contain p-1.5 transition duration-300 group-hover:rotate-3"
          />
          <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-umado-orange text-white shadow-md">
            <Sparkles className="h-4 w-4" />
          </span>
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/65 px-3 py-5 backdrop-blur-sm sm:px-5 sm:py-16"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tcg-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="relative w-full max-w-2xl pt-16 sm:pt-0">
            {floatingImages.map((image) => (
              <div
                key={image.src}
                className={`tcg-float pointer-events-none absolute z-20 overflow-hidden rounded-2xl border-[3px] border-white bg-white shadow-xl sm:rounded-[22px] sm:border-4 sm:shadow-2xl ${image.className}`}
                style={{ animationDelay: image.delay }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
            ))}

            <div className="relative z-10 max-h-[calc(100dvh-7rem)] overflow-y-auto overflow-x-hidden rounded-[26px] border border-white/60 bg-white shadow-[0_24px_70px_rgba(0,0,0,.3)] sm:max-h-none sm:overflow-hidden sm:rounded-[36px] sm:shadow-[0_28px_90px_rgba(0,0,0,.3)]">
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-umado-blue via-sky-400 to-umado-orange" />

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup pop-up TCG"
                className="absolute right-3 top-3 z-30 rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 hover:text-umado-navy focus:outline-none focus:ring-4 focus:ring-sky-200 sm:right-4 sm:top-4"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="px-5 pb-6 pt-8 sm:px-10 sm:pb-10 sm:pt-11">
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-black uppercase tracking-[.16em] text-umado-blue">
                  <Sparkles className="h-4 w-4" /> Sub Divisi Manga
                </div>

                <h2
                  id="tcg-title"
                  className="mt-4 text-3xl font-black tracking-tight text-umado-navy sm:text-5xl"
                >
                  TCG
                  <span className="mt-1 block text-xl leading-tight text-umado-blue sm:ml-3 sm:mt-0 sm:inline sm:text-5xl">
                    Trading Card Game
                  </span>
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
                  TCG adalah sub divisi di bawah Divisi Manga untuk anggota yang
                  ingin menikmati dunia trading card game dalam suasana santai,
                  seru, dan kompetitif. Di sini kamu bisa belajar permainan,
                  ngobrol soal deck, latihan bareng, sampai saling adu strategi.
                </p>

                <div className="mt-5 grid gap-2.5 sm:mt-7 sm:grid-cols-3 sm:gap-3">
                  {[
                    ["Learn", "Belajar rule & cara bermain"],
                    ["Build", "Diskusi dan racik deck"],
                    ["Play", "Casual match & sparring"],
                  ].map(([title, description]) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-sky-100 bg-sky-50/60 p-3.5 sm:p-4"
                    >
                      <div className="font-black text-umado-navy">{title}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-500">
                        {description}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-umado-navy px-4 py-3.5 text-sm leading-6 text-slate-100 sm:mt-7 sm:px-5 sm:py-4 sm:text-base">
                  IT'S TIME TO DU-DU-DU-DU-DU-DU-DU-DU-DU-DUEL! - Yugi Episode 1  🃏
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .tcg-bubble {
          animation: tcg-bob 2.1s ease-in-out infinite;
        }

        .tcg-ring {
          animation: tcg-pulse 1.8s ease-out infinite;
        }

        .tcg-float {
          animation: tcg-float 3.4s ease-in-out infinite;
        }

        @keyframes tcg-bob {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-9px) rotate(2deg); }
        }

        @keyframes tcg-pulse {
          0% { transform: scale(.88); opacity: .8; }
          75%, 100% { transform: scale(1.3); opacity: 0; }
        }

        @keyframes tcg-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .tcg-bubble,
          .tcg-ring,
          .tcg-float {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
