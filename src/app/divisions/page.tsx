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
      <section className="py-24">
        <div className="mx-auto max-w-7xl space-y-10 px-5 lg:px-8">
          {divisions.map((d, index) => {
            const Icon = d.icon;
            return (
              <Reveal key={d.slug}>
                <article
                  className={`grid overflow-hidden rounded-[36px] border border-slate-100 bg-white shadow-sm lg:grid-cols-2 ${index % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}
                >
                  <div className="relative min-h-[440px] bg-gradient-to-br from-sky-50 to-orange-50">
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      className="object-contain p-8"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8 lg:p-12">
                    <div className="flex items-center gap-3">
                      <Icon className="h-12 w-12 rounded-2xl bg-umado-navy p-3 text-white" />
                      <div>
                        <div className="text-sm font-bold uppercase tracking-[.2em] text-umado-blue">
                          {d.japanese}
                        </div>
                        <h2 className="text-3xl font-black text-umado-navy">
                          {d.name}
                        </h2>
                      </div>
                    </div>
                    <p className="mt-6 text-lg leading-8 text-slate-600">
                      {d.description}
                    </p>
                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
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
