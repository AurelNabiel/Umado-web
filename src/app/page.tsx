import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles, Users, CalendarDays } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import { divisions } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-sky-50 to-orange-50 pt-24 sm:pt-28 lg:min-h-[94vh] torii-ring">
        <div className="absolute inset-0 japanese-grid opacity-70" />
        <div className="absolute bottom-0 left-0 h-44 w-full wave-pattern opacity-60" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:gap-10 sm:px-5 sm:py-12 lg:min-h-[82vh] lg:grid-cols-[1.05fr_.95fr] lg:gap-12 lg:px-8">
          <Reveal>
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-2 text-[10px] font-black uppercase tracking-[.12em] sm:px-4 sm:text-xs sm:tracking-[.18em] text-umado-blue shadow-sm">
              <Sparkles className="h-4 w-4" /> Organisasi kreatif Unsada 
            </div>
            <h1 className="max-w-3xl break-words text-4xl font-black leading-[1] tracking-tight text-umado-navy sm:text-5xl md:text-6xl lg:text-[78px]">
              Berkarya. <span className="text-umado-blue">Berbudaya.</span>
              <br />
              Bersama Umado.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
              Ruang kreatif untuk pecinta budaya pop Jepang yang ingin
              berkembang melalui suara, ilustrasi, manga, dan dance performance
              dalam satu komunitas yang hangat dan kolaboratif.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-umado-blue px-6 py-3.5 font-bold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-1 hover:bg-sky-600"
              >
                Gabung Sekarang <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="text-center rounded-full border border-slate-300 bg-white px-6 py-3.5 font-bold text-umado-navy transition hover:border-umado-blue hover:text-umado-blue"
              >
                Kenal Umado
              </Link>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-3">
              {[
                ["3", "Divisi Utama"],
                ["Creative", "Community"],
                ["5", "Kolaborasi"],
              ].map(([a, b]) => (
                <div
                  key={b}
                  className="rounded-2xl border border-white bg-white/75 p-3 sm:p-4 shadow-sm backdrop-blur"
                >
                  <div className="text-xl font-black text-umado-navy sm:text-2xl">{a}</div>
                  <div className="text-xs font-semibold text-slate-500">
                    {b}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="relative flex min-h-[360px] items-end justify-center sm:min-h-[460px] lg:h-[720px] lg:min-h-0">
            <div className="absolute left-2 top-8 h-14 w-14 sm:left-6 sm:top-14 sm:h-20 sm:w-20 rounded-full border-[16px] border-umado-orange/20" />
            <div className="absolute left-2 top-8 z-20 rounded-2xl sm:left-6 sm:top-16 lg:-left-24 lg:top-20 lg:rounded-3xl bg-umado-navy px-5 py-4 text-white shadow-soft">
              <div className="text-xs text-sky-200">UMADO CLUB</div>
              <div className="font-bold">カセイ • マンガ • ダンス</div>
            </div>
            <Image
              src="/assets/umagroup.png"
              alt="Mascot Umado"
              width={640}
              height={1300}
              className="relative z-10 max-h-[480px] w-full max-w-[560px] object-contain sm:max-h-[580px] lg:max-h-[720px] lg:w-auto drop-shadow-2xl"
              priority
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <SectionTitle
              eyebrow="Tentang Umado"
              title="Komunitas tempat hobi berubah menjadi karya."
              description="Umado dibangun sebagai wadah bagi para kreator dan penggemar budaya pop Jepang untuk belajar, berkarya, dan tampil bersama melalui proyek lintas divisi."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-3">
            {[
              {
                i: Users,
                t: "Community First",
                d: "Lingkungan yang ramah untuk bertemu, belajar, dan berkembang bersama.",
              },
              {
                i: Heart,
                t: "Create with Passion",
                d: "Mendorong anggota menghasilkan karya dengan identitas dan kualitas yang terus berkembang.",
              },
              {
                i: CalendarDays,
                t: "Active Collaboration",
                d: "Program latihan, project kolaborasi, gathering, showcase, dan aktivitas kreatif rutin.",
              },
            ].map(({ i: Icon, t, d }) => (
              <Reveal key={t}>
                <div className="h-full rounded-[24px] border border-slate-100 bg-slate-50 p-5 sm:rounded-[28px] sm:p-7 transition hover:-translate-y-1 hover:shadow-soft">
                  <Icon className="mb-5 h-11 w-11 rounded-2xl bg-sky-100 p-2.5 text-umado-blue" />
                  <h3 className="text-xl font-black text-umado-navy">{t}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-umado-paper py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 wave-pattern" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <SectionTitle
              eyebrow="3 Divisi Utama"
              title="Pilih ruang kreatifmu."
              description="Setiap divisi punya ritme dan karakter berbeda, namun semuanya terhubung dalam kolaborasi Umado."
              center
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {divisions.map((division, index) => {
              const Icon = division.icon;
              return (
                <Reveal key={division.slug}>
                  <article className="group overflow-hidden rounded-[32px] border border-sky-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-soft">
                    <div className="relative h-60 overflow-hidden sm:h-72 bg-gradient-to-br from-sky-50 to-orange-50">
                      <Image
                        src={division.image}
                        alt={division.name}
                        fill
                        className="object-contain p-6 transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-black text-umado-navy shadow">
                        0{index + 1} • {division.japanese}
                      </div>
                    </div>
                    <div className="p-5 sm:p-7">
                      <Icon className="mb-4 h-10 w-10 rounded-xl bg-umado-navy p-2 text-white" />
                      <h3 className="text-xl font-black text-umado-navy sm:text-2xl">
                        {division.name}
                      </h3>
                      <p className="mt-3 leading-7 text-slate-600">
                        {division.description}
                      </p>
                      <Link
                        href="/divisions"
                        className="mt-5 inline-flex items-center gap-2 font-bold text-umado-blue"
                      >
                        Lihat divisi <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[28px] bg-umado-navy px-5 py-9 sm:rounded-[36px] sm:px-6 sm:py-12 text-white md:px-12 lg:px-16 lg:py-16 torii-ring">
              <div className="absolute inset-0 japanese-grid opacity-20" />
              <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                <div>
                  <div className="text-xs font-black uppercase tracking-[.28em] text-sky-300">
                    Start your story
                  </div>
                  <h2 className="mt-3 max-w-3xl text-2xl font-black sm:text-3xl md:text-4xl lg:text-5xl">
                    Punya suara, cerita, atau energi untuk tampil? Ada tempat
                    untukmu di Umado.
                  </h2>
                </div>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-black text-umado-navy transition hover:-translate-y-1"
                >
                  Daftar Anggota <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
