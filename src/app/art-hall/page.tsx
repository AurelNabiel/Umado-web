import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

const artworks = [
  {
    title: "Character Illustration",
    artist: "Umado Creative Team",
    category: "Illustration",
    image: "/assets/umachan.png",
  },
  {
    title: "Umado Visual Project",
    artist: "Umado Creative Team",
    category: "Character Design",
    image: "/assets/umachan2.png",
  },
  {
    title: "Stage & Performance Concept",
    artist: "Umado Performance Team",
    category: "Performance",
    image: "/assets/umachan3.png",
  },
  {
    title: "Creative Collaboration",
    artist: "Umado Members",
    category: "Collaboration",
    image: "/assets/home-hero-trio.png",
  },
  {
    title: "Manga Study",
    artist: "Manga Division",
    category: "Manga",
    image: "/assets/umachan.png",
  },
  {
    title: "Kasei Creative Session",
    artist: "Kasei Division",
    category: "Audio & Voice",
    image: "/assets/umachan2.png",
  },
];

export const metadata = {
  title: "Art Hall — Umado",
  description: "Kumpulan karya kreatif anggota Umado.",
};

export default function ArtHallPage() {
  return (
    <>
      <PageHero
        eyebrow="Art Hall • アートホール"
        title="Karya dari anggota Umado."
        description="Kumpulan ilustrasi, manga, visual, performance, dan karya kreatif yang pernah dibuat oleh anggota Umado."
      />

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.map((work) => (
              <Reveal key={`${work.title}-${work.artist}`}>
                <article className="group overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      className="object-contain p-5 transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="p-5">
                    <span className="text-xs font-bold uppercase tracking-[.16em] text-umado-blue">
                      {work.category}
                    </span>
                    <h2 className="mt-2 text-xl font-black text-umado-navy">
                      {work.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">{work.artist}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
