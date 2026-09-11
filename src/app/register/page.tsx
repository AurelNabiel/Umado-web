"use client";

import { FormEvent, useState } from "react";
import PageHero from "@/components/PageHero";
import { AlertCircle, CheckCircle2, Loader2, Upload } from "lucide-react";
import { track } from "@vercel/analytics";

// Vercel Function punya hard-limit payload 4.5MB (request body), dan base64
// menambah ukuran ~33%. Jadi batas file ASLI kita jaga aman di bawah itu.
const MAX_FILE_SIZE_MB = 8; // batas file yang dipilih user (sebelum dikompres)
const MAX_UPLOAD_MB = 3; // batas ukuran akhir yang benar-benar dikirim ke server
const IMAGE_MAX_DIMENSION = 1600; // px, sisi terpanjang setelah resize
const IMAGE_QUALITY = 0.75;

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

// Baca file jadi string base64 murni (tanpa prefix "data:...;base64,").
function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Kompres & resize gambar lewat <canvas> supaya foto dari kamera HP (yang
// biasanya 3-10MB) menyusut jadi beberapa ratus KB sebelum dikirim — jadi
// tidak kena limit payload 4.5MB milik Vercel.
function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > height && width > IMAGE_MAX_DIMENSION) {
        height = Math.round((height * IMAGE_MAX_DIMENSION) / width);
        width = IMAGE_MAX_DIMENSION;
      } else if (height > IMAGE_MAX_DIMENSION) {
        width = Math.round((width * IMAGE_MAX_DIMENSION) / height);
        height = IMAGE_MAX_DIMENSION;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas tidak didukung browser ini."));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Gagal memproses gambar."))),
        "image/jpeg",
        IMAGE_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Gagal membaca gambar."));
    };

    img.src = objectUrl;
  });
}

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(file: File | null) {
    setError("");
    if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Ukuran file maksimal ${MAX_FILE_SIZE_MB}MB.`);
      setPortfolioFile(null);
      return;
    }
    setPortfolioFile(file);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let portfolioFileBase64 = "";
      let portfolioFileName = "";
      let portfolioMimeType = "";

      if (portfolioFile) {
        const isImage = portfolioFile.type.startsWith("image/");
        let uploadBlob: Blob = portfolioFile;
        let uploadName = portfolioFile.name;
        let uploadType = portfolioFile.type || "application/octet-stream";

        if (isImage) {
          try {
            uploadBlob = await compressImage(portfolioFile);
            uploadType = "image/jpeg";
            uploadName = uploadName.replace(/\.[^.]+$/, "") + ".jpg";
          } catch {
            // kalau kompresi gagal, coba kirim file aslinya apa adanya
            uploadBlob = portfolioFile;
          }
        }

        if (uploadBlob.size > MAX_UPLOAD_MB * 1024 * 1024) {
          throw new Error(
            `File portfolio masih terlalu besar (${(uploadBlob.size / 1024 / 1024).toFixed(
              1
            )}MB) setelah dikompres. Maks. ${MAX_UPLOAD_MB}MB — coba file yang lebih kecil atau format PDF.`
          );
        }

        portfolioFileBase64 = await fileToBase64(uploadBlob);
        portfolioFileName = uploadName;
        portfolioMimeType = uploadType;
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          portfolioFileName,
          portfolioMimeType,
          portfolioFileBase64,
        }),
      });

      if (response.status === 413) {
        throw new Error(
          `File portfolio terlalu besar untuk dikirim server. Maks. ${MAX_UPLOAD_MB}MB.`
        );
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error(
          "Server tidak merespons dengan benar. Coba lagi atau kirim tanpa file portfolio."
        );
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Pendaftaran gagal dikirim.");
      }

      setDone(true);
      setForm(initialForm);
      setPortfolioFile(null);
      track("register_success", { division: form.division });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengirim pendaftaran."
      );
      track("register_error");
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
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-xl px-4 text-center sm:px-5">
            <CheckCircle2 className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-umado-blue" />
            <h2 className="mt-6 text-2xl font-black sm:text-3xl text-umado-navy">
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
      <section className="bg-slate-50 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-5">
          <form
            onSubmit={handleSubmit}
            className="rounded-[24px] bg-white p-4 shadow-soft sm:rounded-[32px] sm:p-6 md:p-10"
          >
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
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
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl text-center sm:flex-row sm:gap-3 border-2 border-dashed border-slate-200 p-7 text-slate-500 hover:border-umado-blue hover:bg-sky-50">
                <Upload />
                <span>{portfolioFile?.name || "Pilih file portfolio / dokumen"}</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                />
              </label>
              {portfolioFile && (
                <p className="mt-2 text-xs text-slate-500">
                  {(portfolioFile.size / 1024 / 1024).toFixed(2)}MB — gambar akan
                  dikompres otomatis, lalu diunggah ke Google Drive dan link-nya
                  tercatat di Google Sheet.
                </p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                Maks. {MAX_FILE_SIZE_MB}MB dipilih (gambar dikompres otomatis ke
                bawah {MAX_UPLOAD_MB}MB). Format: PDF, DOC/DOCX, PNG, JPG.
              </p>
            </Field>

            <label className="mt-5 flex items-start gap-3 text-xs sm:text-sm text-slate-600">
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
