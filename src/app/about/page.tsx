import Image from "next/image";
import {
  Eye,
  Target,
  HeartHandshake,
  Sparkles,
  UsersRound,
  Layers3,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";

export const metadata = {
  title: "Tentang Kami",
  description: "Sejarah, visi, misi, dan nilai Umado.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us • 私たちについて"
        title="Umado tumbuh dari kecintaan pada budaya Jepang dan semangat membuat karya bersama."
        description="Kami percaya komunitas yang baik bukan hanya tempat berkumpul, tetapi tempat setiap anggota mendapat ruang untuk mencoba, belajar, dan berkembang."
      />
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:gap-10 sm:px-5 lg:grid-cols-2 lg:gap-12 lg:px-8">
          <Reveal>
            <div className="relative min-h-[360px] sm:min-h-[460px] lg:min-h-[560px] overflow-hidden rounded-[36px] bg-gradient-to-br from-sky-50 to-orange-50">
              <Image
                src="/assets/umado2019.jpeg"
                alt="Umado creative mascot"
                fill
                className="object-fill p-5 sm:p-8 lg:p-10"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl sm:bottom-6 sm:left-6 sm:right-auto bg-white/90 p-5 shadow-soft backdrop-blur">
                <div className="text-xs font-bold uppercase tracking-widest text-umado-blue">
                  Our Spirit
                </div>
                <div className="mt-1 font-black text-umado-navy">
                  Create • Connect • Celebrate
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <SectionTitle
              eyebrow="Sejarah Singkat"
              title="Berawal dari komunitas, berkembang menjadi ekosistem kreatif."
            />
            <div className="mt-6 space-y-5 leading-8 text-slate-600">
              <p>
                Umado hadir sebagai wadah bagi penggemar Culture Jepang, manga, musik,
                voice acting, dan dance cover untuk saling bertemu serta
                menciptakan karya yang bisa dinikmati bersama.
              </p>
              <p>
                Seiring berkembangnya anggota, aktivitas Umado dibentuk ke dalam
                tiga divisi utama:{" "}
                <strong className="text-umado-navy">Kasei</strong>,{" "}
                <strong className="text-umado-navy">Manga</strong>, dan{" "}
                <strong className="text-umado-navy">Dance Cover</strong>.
                Ketiganya menjadi fondasi untuk project kolaborasi, workshop,
                performance, dan kegiatan komunitas.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="bg-umado-paper py-16 wave-pattern sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-[26px] bg-white p-5 sm:rounded-[30px] sm:p-8 shadow-sm">
                <Eye className="h-12 w-12 rounded-2xl bg-sky-100 p-3 text-umado-blue" />
                <h2 className="mt-5 text-2xl font-black sm:mt-6 sm:text-3xl text-umado-navy">
                  Visi
                </h2>
                <p className="mt-4 leading-8 text-slate-600">
                  Meningkatkan keaktifan, kreativitas, dan solidaritas dalam
                  membuat suatu karya baik bersama maupun sendiri.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div className="h-full rounded-[26px] bg-white p-5 sm:rounded-[30px] sm:p-8 shadow-sm">
                <Target className="h-12 w-12 rounded-2xl bg-orange-100 p-3 text-umado-orange" />
                <h2 className="mt-5 text-2xl font-black sm:mt-6 sm:text-3xl text-umado-navy">
                  Misi
                </h2>
                <ul className="mt-4 space-y-3 leading-7 text-slate-600">
                  <li>
                    - Sebagai wadah untuk menyalurkan ide-ide yang kreatif agar
                    dapat mengembangkan minat dan bakat mahasiswa.
                  </li>
                  <li>
                    - Mewujudkan pribadi yang aktif, bertanggung jawab dan
                    profesional.
                  </li>
                  <li>
                    - Memperkuat rasa solidaritas dan kekeluargaan sesama anggota.
                  </li>
                  <li>
                    - Mewujudkan kerjasama yang kuat dengan klub baik didalam
                    maupun diluar kampus.
                  </li>
                  <li>- Mewujudkan suasana aman dan nyaman untuk berkarya.</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <SectionTitle
              eyebrow="Nilai Organisasi"
              title="Budaya yang menjaga Umado tetap hidup."
              center
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                i: HeartHandshake,
                t: "Respect",
                d: "Saling menghargai proses, identitas, dan gaya berkarya setiap anggota.",
              },
              {
                i: Sparkles,
                t: "Creativity",
                d: "Berani mencoba ide baru dan terus mengasah kemampuan.",
              },
              {
                i: UsersRound,
                t: "Togetherness",
                d: "Tumbuh melalui kolaborasi, bukan kompetisi yang saling menjatuhkan.",
              },
              {
                i: Layers3,
                t: "Consistency",
                d: "Karya yang baik lahir dari proses yang dilakukan secara rutin.",
              },
              {
                i: Target,
                t: "Growth",
                d: "Setiap program diarahkan untuk meningkatkan kemampuan anggota.",
              },
              {
                i: Eye,
                t: "Open Mind",
                d: "Terbuka pada kritik, perspektif baru, dan perkembangan budaya kreatif.",
              },
            ].map(({ i: Icon, t, d }) => (
              <Reveal key={t}>
                <div className="h-full rounded-3xl border border-slate-100 p-5 sm:p-7 hover:shadow-soft">
                  <Icon className="h-9 w-9 text-umado-blue" />
                  <h3 className="mt-5 text-xl font-black text-umado-navy">
                    {t}
                  </h3>
                  <p className="mt-2 leading-7 text-slate-600">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
