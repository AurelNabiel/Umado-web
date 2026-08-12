import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { divisions } from "@/lib/data";

export const metadata = {
  title: "Divisi",
  description: "Divisi Kasei, Manga, dan Dance Cover Umado.",
};

export default function DivisionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Divisions • 部門"
        title="Tiga divisi, satu semangat kreatif."
        description="Pilih divisi yang paling sesuai dengan minatmu. Anggota tetap dapat berkolaborasi lintas divisi dalam project bersama."
      />
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-7 px-4 sm:space-y-10 sm:px-5 lg:px-8">
          {divisions.map((d, index) => {
            const Icon = d.icon;
            return (
              <Reveal key={d.slug}>
                <article
                  className={`grid overflow-hidden rounded-[26px] sm:rounded-[36px] border border-slate-100 bg-white shadow-sm lg:grid-cols-2 ${index % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}
                >
                  <div className="relative min-h-[330px] sm:min-h-[400px] lg:min-h-[440px] bg-gradient-to-br from-sky-50 to-orange-50">
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      className="object-contain p-5 pb-16 sm:p-8 sm:pb-20"
                    />
                    <div className="absolute bottom-4 left-1/2 z-10 w-[calc(100%-2rem)] -translate-x-1/2 text-center sm:bottom-6 sm:w-auto">
                      <div className="inline-flex max-w-full flex-wrap items-center justify-center rounded-full border border-white/80 bg-white/90 px-5 py-2.5 shadow-lg backdrop-blur">
                        <span className="text-xs font-black uppercase tracking-[.18em] text-umado-blue">
                          Mascot
                        </span>
                        <span className="mx-2 text-slate-300">•</span>
                        <span className="font-black text-umado-navy">
                          {d.mascotName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-12">
                    <div className="flex items-center gap-3">
                      <Icon className="h-11 w-11 shrink-0 rounded-2xl sm:h-12 sm:w-12 bg-umado-navy p-3 text-white" />
                      <div>
                        <div className="text-sm font-bold uppercase tracking-[.2em] text-umado-blue">
                          {d.japanese}
                        </div>
                        <h2 className="break-words text-2xl font-black text-umado-navy sm:text-3xl">
                          {d.name}
                        </h2>
                      </div>
                    </div>
                    <p className="mt-5 text-base leading-7 sm:mt-6 sm:text-lg sm:leading-8 text-slate-600">
                      {d.description}
                    </p>
                    <div className="mt-6 grid gap-3 sm:mt-7 sm:grid-cols-2">
                      {(index === 0
                        ? [
                            "Song Cover",
                            "Dubbing & Voice Acting",
                            "Vocal Practice",
                            "Performance",
                          ]
                        : index === 1
                          ? [
                              "Manga Creation",
                              "Illustration",
                              "Merchandise Design",
                              "Visual Collaboration",
                            ]
                          : [
                              "Dance Practice",
                              "Choreography",
                              "Stage Performance",
                              "Video Project",
                            ]
                      ).map((x) => (
                        <div
                          key={x}
                          className="rounded-2xl bg-slate-50 px-4 py-3 font-semibold text-slate-700"
                        >
                          ✓ {x}
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50 p-4">
                      <div className="text-xs font-bold uppercase tracking-widest text-umado-blue">
                        Penanggung Jawab
                      </div>
                      <div className="mt-1 font-black text-umado-navy">
                        {d.lead}
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
