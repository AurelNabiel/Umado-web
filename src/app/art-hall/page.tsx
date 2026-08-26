import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

const artworks = [
  {
    title: "Merchandise Design",
    artist: "len",
    category: "Merch",
    image: "https://99u9yudm6dibhx9t.public.blob.vercel-storage.com/assets/art-hall/Irohasketch.jpeg",
    socialUrl: "https://www.instagram.com/lenkyun02/",
  },
  {
    title: "Deskmat Project",
    artist: "Des",
    category: "Merch",
    image: "https://99u9yudm6dibhx9t.public.blob.vercel-storage.com/assets/art-hall/Deskmat.png",
    socialUrl: "",
  },
  {
    title: "Haloween Monthly Art",
    artist: "Selenophine",
    category: "Artwork",
    image: "https://99u9yudm6dibhx9t.public.blob.vercel-storage.com/assets/art-hall/haloween.png",
    socialUrl: "",
  },
  {
    title: "Best Horor Artwork",
    artist: "Kevin Flygonitus Seminiferus",
    category: "Artwork",
    image: "https://99u9yudm6dibhx9t.public.blob.vercel-storage.com/assets/art-hall/horor.png",
    socialUrl: "",
  },
  {
    title: "Valentine Day Artwork",
    artist: "Najwa",
    category: "Artwork",
    image: "https://99u9yudm6dibhx9t.public.blob.vercel-storage.com/assets/art-hall/Valentine.png",
    socialUrl: "",
  },
  {
    title: "Umado Maskot Design",
    artist: "Tamago",
    category: "Character Design",
    image: "https://99u9yudm6dibhx9t.public.blob.vercel-storage.com/assets/art-hall/Maskot.png",
    socialUrl: "https://www.instagram.com/tama_.x",
  },
  {
    title: "Umado Maskot Design",
    artist: "Kale",
    category: "Character Design",
    image: "https://99u9yudm6dibhx9t.public.blob.vercel-storage.com/assets/art-hall/Kale.jpg",
    socialUrl: "https://www.instagram.com/kaleyptus",
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
            {artworks.map((work) => {
              const href = work.socialUrl || "/art-hall/anonymous-author";
              const hasSocialLink = Boolean(work.socialUrl);

              const card = (
                <article className="group h-full overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-[24px]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      className="object-contain p-3 transition duration-500 group-hover:scale-[1.03] sm:p-5"
                    />
                  </div>

                  <div className="p-4 sm:p-5">
                    <span className="text-xs font-bold uppercase tracking-[.16em] text-umado-blue">
                      {work.category}
                    </span>
                    <h2 className="mt-2 break-words text-lg font-black text-umado-navy sm:text-xl">
                      {work.title}
                    </h2>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="text-sm text-slate-500">{work.artist}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-umado-blue opacity-70 transition group-hover:opacity-100">
                        {hasSocialLink ? "Sosmed" : "Author"}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              );

              return (
                <Reveal key={`${work.title}-${work.artist}`}>
                  {hasSocialLink ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                      aria-label={`Buka sosial media ${work.artist}`}
                    >
                      {card}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="block h-full"
                      aria-label={`Lihat informasi author ${work.artist}`}
                    >
                      {card}
                    </Link>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
