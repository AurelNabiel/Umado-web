import PageHero from "@/components/PageHero";
const faqs = [
  [
    "Tujuan Umado apa sih?",
    "Umado adalah komunitas kreatif yang bertujuan untuk mengembangkan bakat dan minat anggotanya dalam bidang seni,dan budaya. Kami menyediakan wadah bagi anggota untuk belajar, berkolaborasi, dan mengekspresikan kreativitas mereka.",
  ],
  [
    "Apakah harus sudah mahir untuk bergabung?",
    "Tidak. Umado terbuka untuk anggota pemula maupun yang sudah berpengalaman. Yang terpenting adalah komitmen untuk belajar dan berpartisipasi.",
  ],
  [
    "Bolehkah ikut lebih dari satu divisi?",
    "Bisa, bergantung pada kebijakan internal dan kemampuan anggota mengatur jadwal. Kolaborasi lintas divisi justru sangat didorong.",
  ],
  [
    "apakah bisa mendapatkan surat keaktifan?",
    "Ya, anggota yang aktif berpartisipasi dalam kegiatan dan proyek Umado dapat mengajukan surat keaktifan. Prosesnya akan dijelaskan oleh pengurus.",
  ],
  [
    "apakah hanya jurusan sastra Jepang yang bisa bergabung?",
    "Tidak. Umado terbuka untuk semua jurusan dan latar belakang, selama memiliki minat dan bersedia berkontribusi dalam kegiatan komunitas.",
  ],
  [
    "apakah divisi Manga menggunakan digital atau tradisional?",
    "Divisi Manga menerima kedua metode, digital maupun tradisional. Anggota dapat memilih sesuai preferensi dan kemampuan mereka.",
  ],
];
export const metadata = { title: "FAQ" };
export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ • よくある質問"
        title="Pertanyaan yang sering ditanyakan."
        description="Informasi singkat sebelum kamu bergabung atau berkolaborasi dengan Umado."
      />
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl space-y-3 px-4 sm:space-y-4 sm:px-5">
          {faqs.map(([q, a]) => (
            <details
              key={q}
              className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-black text-umado-navy sm:text-base">
                {q}
                <span className="shrink-0 text-lg text-umado-blue transition group-open:rotate-45">
                  ＋
                </span>
              </summary>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
