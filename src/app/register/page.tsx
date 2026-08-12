"use client";

import { FormEvent, useState } from "react";
import PageHero from "@/components/PageHero";
import { AlertCircle, CheckCircle2, Loader2, Upload } from "lucide-react";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  division: string;
  motivation: string;
  consent: boolean;
};

const initialForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  division: "",
  motivation: "",
  consent: false,
};

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [portfolioName, setPortfolioName] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          portfolioName,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Pendaftaran gagal dikirim.");
      }

      setDone(true);
      setForm(initialForm);
      setPortfolioName("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengirim pendaftaran."
      );
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <>
        <PageHero
          eyebrow="Registration"
          title="Terima kasih sudah mendaftar!"
          description="Data pendaftaran kamu sudah berhasil dikirim dan tercatat. Tim Umado akan menghubungi kamu melalui kontak yang diberikan."
        />
        <section className="py-24">
          <div className="mx-auto max-w-xl px-5 text-center">
            <CheckCircle2 className="mx-auto h-20 w-20 text-umado-blue" />
            <h2 className="mt-6 text-3xl font-black text-umado-navy">
              Welcome to the next step.
            </h2>
            <button
              onClick={() => setDone(false)}
              className="mt-7 rounded-full bg-umado-navy px-6 py-3 font-bold text-white"
            >
              Isi Form Lagi
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Join Umado • 入会"
        title="Mulai perjalanan kreatifmu bersama Umado."
        description=""
      />
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-5">
          <form
            onSubmit={handleSubmit}
            className="rounded-[32px] bg-white p-6 shadow-soft md:p-10"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nama Lengkap">
                <input
                  required
                  className="input"
                  placeholder="Nama kamu"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                />
              </Field>

              <Field label="Email">
                <input
                  required
                  type="email"
                  className="input"
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </Field>

              <Field label="No. HP / WhatsApp">
                <input
                  required
                  className="input"
                  placeholder="08xxxxxxxxxx"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </Field>

              <Field label="Divisi yang diminati">
                <select
                  required
                  className="input"
                  value={form.division}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, division: e.target.value }))
                  }
                >
                  <option value="">Pilih divisi</option>
                  <option value="Kasei — Song Cover & Dubbing">
                    Kasei — Song Cover & Dubbing
                  </option>
                  <option value="Manga">Manga</option>
                  <option value="Dance Cover">Dance Cover</option>
                </select>
              </Field>
            </div>

            <Field label="Motivasi Bergabung">
              <textarea
                required
                rows={5}
                className="input mt-0"
                placeholder="Ceritakan alasan kamu ingin bergabung dengan Umado..."
                value={form.motivation}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, motivation: e.target.value }))
                }
              />
            </Field>

            <Field label="Portfolio / Dokumen (opsional)">
              <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 p-7 text-slate-500 hover:border-umado-blue hover:bg-sky-50">
                <Upload />
                <span>{portfolioName || "Pilih file portfolio / dokumen"}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    setPortfolioName(e.target.files?.[0]?.name || "")
                  }
                />
              </label>
              {portfolioName && (
                <p className="mt-2 text-xs text-slate-500">
                  Saat ini Google Sheet menyimpan nama file. Upload file ke Google
                  Drive dapat ditambahkan sebagai tahap berikutnya.
                </p>
              )}
            </Field>

            <label className="mt-5 flex items-start gap-3 text-sm text-slate-600">
              <input
                required
                type="checkbox"
                className="mt-1"
                checked={form.consent}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, consent: e.target.checked }))
                }
              />
              Saya menyetujui data digunakan untuk proses pendaftaran anggota
              Umado.
            </label>

            {error && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-umado-blue px-6 py-4 font-black text-white shadow-lg shadow-sky-200 hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Mengirim...
                </>
              ) : (
                "Kirim Pendaftaran"
              )}
            </button>
          </form>
        </div>
      </section>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid #dbe3eb;
          border-radius: 16px;
          padding: 13px 14px;
          outline: none;
          background: white;
        }
        .input:focus {
          border-color: #159dda;
          box-shadow: 0 0 0 3px rgba(21, 157, 218, 0.12);
        }
      `}</style>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-5 block">
      <span className="mb-2 block text-sm font-bold text-umado-navy">
        {label}
      </span>
      {children}
    </label>
  );
}
