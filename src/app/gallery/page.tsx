import PageHero from "@/components/PageHero";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata = {
  title: "Galeri",
  description: "Galeri kegiatan dan karya Umado.",
};
export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery • ギャラリー"
        title="Cerita Umado dalam gambar dan karya."
        description="Dokumentasi kegiatan, latihan, project, gathering, dan kolaborasi anggota Umado."
      />
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
          <GalleryGrid />
        </div>
      </section>
    </>
  );
}
