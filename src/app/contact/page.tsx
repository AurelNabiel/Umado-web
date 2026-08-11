"use client";
import PageHero from "@/components/PageHero";
import { Instagram, Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact • お問い合わせ"
        title="Ayo terhubung dengan Umado."
        description="Untuk kolaborasi, event, partnership, atau pertanyaan mengenai keanggotaan, hubungi kami melalui kanal berikut."
      />
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div className="space-y-4">
            {[
              { i: MapPin, t: "Lokasi", d: "Taman Malaka Selatan" },
              { i: Mail, t: "Email", d: "-" },
              { i: Phone, t: "WhatsApp", d: "-" },
              { i: Instagram, t: "Instagram", d: "@umado_" },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="flex gap-4 rounded-3xl bg-slate-50 p-5">
                <Icon className="h-11 w-11 rounded-2xl bg-white p-3 text-umado-blue shadow-sm" />
                <div>
                  <div className="text-sm font-bold text-slate-400">{t}</div>
                  <div className="mt-1 font-black text-umado-navy">{d}</div>
                </div>
              </div>
            ))}
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-sky-50">
              <div className="grid h-64 place-items-center text-center text-slate-500">
                <div>
                  <MapPin className="mx-auto mb-3 h-10 w-10 text-umado-blue" />
                  <div className="font-black text-umado-navy">
                    Map Placeholder
                  </div>
                  <div className="mt-1 text-sm">
                    Embed Google Maps / OpenStreetMap di sini
                  </div>
                </div>
              </div>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Pesan demo terkirim. Hubungkan ke API untuk production.");
            }}
            className="rounded-[32px] border border-slate-100 p-7 shadow-soft md:p-10"
          >
            <h2 className="text-3xl font-black text-umado-navy">Kirim Pesan</h2>
            <p className="mt-2 text-slate-600">
              Kami akan membalas melalui email atau WhatsApp.
            </p>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <input
                required
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-umado-blue"
                placeholder="Nama"
              />
              <input
                required
                type="email"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-umado-blue"
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
            <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-umado-blue px-6 py-3.5 font-bold text-white">
              <Send className="h-4 w-4" />
              Kirim Pesan
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
