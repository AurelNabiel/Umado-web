import PageHero from "@/components/PageHero";
const faqs = [
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
  [
    "Apakah ada biaya keanggotaan?",
    "aturan biaya dapat disesuaikan oleh pengurus Umado.",
  ],
  [
    "Bagaimana proses seleksi anggota?",
    "Pendaftar mengisi form, tim Umado melakukan review, lalu calon anggota dihubungi untuk tahap berikutnya.",
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
      <section className="py-24">
        <div className="mx-auto max-w-4xl space-y-4 px-5">
          {faqs.map(([q, a]) => (
            <details
              key={q}
              className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <summary className="cursor-pointer list-none font-black text-umado-navy">
                {q}
                <span className="float-right text-umado-blue group-open:rotate-45">
                  ＋
                </span>
              </summary>
              <p className="mt-4 leading-7 text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
