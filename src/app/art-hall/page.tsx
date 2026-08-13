import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

const artworks = [
  {
    title: "Merchandise Design",
    artist: "@len",
    category: "Merch",
    image: "/assets/art-hall/Irohasketch.jpeg",
  },
  {
    title: "Deskmat Project",
    artist: "Deasy Kartika",
    category: "Merch",
    image: "/assets/art-hall/Deskmat.png",
  },
  {
    title: "Haloween Monthly Art",
    artist: "Selenophine",
    category: "Artwork",
    image: "/assets/art-hall/haloween.png",
  },
  {
    title: "Best Horor Artwork",
    artist: "Ayesha Listiani",
    category: "Artwork",
    image: "/assets/art-hall/horor.png",
  },
  {
    title: "Valentine Day Artwork",
    artist: "Najwa Meizahra",
    category: "Artwork",
    image: "/assets/art-hall/Valentine.png",
  },
  {
    title: "Umado Maskot Design",
    artist: "Tama",
    category: "Character Design",
    image: "/assets/art-hall/Maskot.png",
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

      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {artworks.map((work) => (
              <Reveal key={`${work.title}-${work.artist}`}>
                <article className="group overflow-hidden rounded-[20px] sm:rounded-[24px] border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      className="object-contain p-3 sm:p-5 transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="p-4 sm:p-5">
                    <span className="text-xs font-bold uppercase tracking-[.16em] text-umado-blue">
                      {work.category}
                    </span>
                    <h2 className="mt-2 break-words text-lg font-black sm:text-xl text-umado-navy">
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
