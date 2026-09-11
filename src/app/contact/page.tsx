"use client";
import PageHero from "@/components/PageHero";
import { Instagram, Mail, MapPin, Phone, Send, Youtube } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact • お問い合わせ"
        title="Ayo terhubung dengan Umado."
        description="Untuk kolaborasi, event, partnership, atau pertanyaan mengenai keanggotaan, hubungi kami melalui kanal berikut."
      />
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:gap-8 sm:px-5 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div className="space-y-4">
            {[
              { i: MapPin, t: "Lokasi", d: "Universitas Darma Persada, Gedung Fakultas FBB, Ruang Tatami" },
              { i: Mail, t: "Email", d: "umadoteimai@gmail.com" },
              { i: Phone, t: "WhatsApp", d: "+62 858 1928 6560" },
              { i: Youtube, t: "Youtube", d: "Umado TV" },
              { i: Instagram, t: "Instagram", d: "@umado_" },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="flex min-w-0 gap-3 rounded-3xl bg-slate-50 p-4 sm:gap-4 sm:p-5">
                <Icon className="h-10 w-10 shrink-0 rounded-2xl sm:h-11 sm:w-11 bg-white p-3 text-umado-blue shadow-sm" />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-400">{t}</div>
                  <div className="mt-1 break-words font-black text-umado-navy">{d}</div>
                </div>
              </div>
            ))}
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-sky-50">
              <div className="relative h-64 w-full overflow-hidden text-slate-500 sm:h-72">
                <div className="h-full w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.255117877737!2d106.92155437486164!3d-6.230059561012098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698cb9fdf4455d%3A0x25ba1bc88e8121ea!2sUniversitas%20Darma%20Persada!5e0!3m2!1sid!2sid!4v1786522961835!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    className="h-full w-full border-0"
                    title="Lokasi Universitas Darma Persada"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Pesan demo terkirim. Hubungkan ke API untuk production.");
            }}
            className="min-w-0 rounded-[26px] border border-slate-100 p-5 shadow-soft sm:rounded-[32px] sm:p-7 md:p-10"
          >
            <h2 className="text-2xl font-black sm:text-3xl text-umado-navy">Kirim Pesan</h2>
            <p className="mt-2 text-slate-600">
              Kami akan membalas melalui email atau WhatsApp.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 sm:gap-5">
              <input
                required
                className="min-w-0 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-umado-blue"
                placeholder="Nama"
              />
              <input
                required
                type="email"
                className="min-w-0 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-umado-blue"
                placeholder="Email"
              />
            </div>
            <input
              className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-umado-blue"
              placeholder="Subjek"
            />
            <textarea
              required
              rows={7}
              className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-umado-blue"
              placeholder="Pesan kamu..."
            />
            <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full sm:w-auto bg-umado-blue px-6 py-3.5 font-bold text-white">
              <Send className="h-4 w-4" />
              Kirim Pesan
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
