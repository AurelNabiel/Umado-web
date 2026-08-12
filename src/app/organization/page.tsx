import Image from "next/image";
import { Crown, Sparkles, Users } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Struktur Organisasi" };

type Member = {
  name: string;
  role: string;
  division?: string;
  photo: string;
};

const chairman: Member = {
  name: "Nama Ketua Umado",
  role: "Ketua Umado",
  photo: "/assets/umachan.png",
};

const executiveBoard: Member[] = [
  {
    name: "Nama Wakil Ketua",
    role: "Wakil Ketua",
    photo: "/assets/umachan2.png",
  },
  {
    name: "Nama Sekretaris",
    role: "Sekretaris",
    photo: "/assets/umachan3.png",
  },
  {
    name: "Nama Bendahara",
    role: "Bendahara",
    photo: "/assets/umachan.png",
  },
];

const divisionCoordinators: Member[] = [
  {
    name: "Nama Koordinator Kasei",
    role: "Koordinator",
    division: "Kasei",
    photo: "/assets/umachan2.png",
  },
  {
    name: "Nama Koordinator Manga",
    role: "Koordinator",
    division: "Manga",
    photo: "/assets/umachan3.png",
  },
  {
    name: "Nama Koordinator Dance Cover",
    role: "Koordinator",
    division: "Dance Cover",
    photo: "/assets/umachan.png",
  },
];

function Portrait({ member, priority = false }: { member: Member; priority?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-50 via-white to-orange-50">
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={member.photo}
          alt={`Foto ${member.name}`}
          fill
          priority={priority}
          className="object-cover object-top transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 90vw, 320px"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#071c36]/90 to-transparent" />
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white p-2 shadow-[0_18px_50px_rgba(15,35,65,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(10,131,200,0.16)]">
      <Portrait member={member} />
      <div className="px-4 pb-5 pt-5 text-center">
        {member.division && (
          <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-umado-blue">
            Divisi {member.division}
          </div>
        )}
        <h3 className="text-lg font-black text-umado-navy">{member.name}</h3>
        <p className="mt-1 text-sm font-semibold text-slate-500">{member.role}</p>
      </div>
    </article>
  );
}

export default function OrganizationPage() {
  return (
    <>
      <PageHero
        eyebrow="Organization • 組織"
        title="Wajah di balik gerak dan kreativitas Umado."
        description="Kenali para pengurus yang menjaga organisasi tetap aktif, hangat, dan terus berkembang bersama komunitas kreatif Unsada."
      />

      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-16 h-80 w-80 rounded-full bg-orange-100/70 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="mb-10 flex flex-col gap-3 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-umado-blue">
                  <Users size={15} />
                  Leadership Team
                </div>
                <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-umado-navy sm:text-4xl">
                  Pengurus Inti Umado
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-slate-500 sm:text-right">
                Struktur yang sederhana, terbuka, dan kolaboratif untuk mendukung setiap divisi berkembang maksimal.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="mx-auto max-w-4xl overflow-hidden rounded-[2.4rem] border border-white/50 bg-gradient-to-br from-[#081d39] via-[#0A315A] to-[#0A83C8] p-3 shadow-[0_30px_90px_rgba(8,29,57,0.22)] sm:p-4">
              <div className="grid items-center gap-7 rounded-[2rem] bg-white/[0.06] p-4 backdrop-blur md:grid-cols-[290px_1fr] md:p-7">
                <div className="group relative">
                  <Portrait member={chairman} priority />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-black text-umado-navy shadow-lg">
                    <Crown size={15} className="text-orange-500" />
                    Ketua Umado
                  </div>
                </div>

                <div className="px-2 pb-3 text-white md:px-4 md:pb-0">
                  <div className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-sky-200">
                    <Sparkles size={15} />
                    Ketua Organisasi
                  </div>
                  <h3 className="text-3xl font-black tracking-tight sm:text-4xl">{chairman.name}</h3>
                  <p className="mt-3 text-base font-bold text-sky-100">{chairman.role}</p>
                  <div className="mt-6 h-px w-full bg-white/15" />
                  <p className="mt-6 max-w-xl text-sm leading-7 text-slate-200">
                    Mengarahkan visi organisasi, menjaga kolaborasi antar divisi, dan memastikan setiap program Umado berjalan dengan semangat kreatif serta kebersamaan.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mx-auto my-7 h-14 w-px bg-gradient-to-b from-umado-blue to-slate-200" />

          <Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              {executiveBoard.map((member) => (
                <MemberCard key={member.role} member={member} />
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-8 mt-20 text-center">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-umado-blue">Creative Divisions</div>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-umado-navy">Koordinator Divisi</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                Penggerak utama kegiatan kreatif di masing-masing divisi Umado.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              {divisionCoordinators.map((member) => (
                <MemberCard key={member.division} member={member} />
              ))}
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}
