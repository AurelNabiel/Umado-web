"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import PageHero from "@/components/PageHero";
import { AlertCircle, CheckCircle2, Clock3, Loader2, ShieldCheck, Upload } from "lucide-react";
import { track } from "@vercel/analytics";
import { REGISTRATION_OPEN } from "@/lib/registration-config";

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

// Penanda di browser ini saja. Pencegahan duplikasi global harus dibuat di Apps Script.
const REGISTRATION_KEY_PREFIX = "umado:registration:v1:";
const REGISTRATION_REQUEST_PREFIX = "umado:registration:request:v1:";
type RegistrationStatus = "confirmed" | "unverified";
function registrationKey(email: string) {
  return REGISTRATION_KEY_PREFIX + email.trim().toLowerCase();
}
function registrationRequestKey(email: string) {
  return REGISTRATION_REQUEST_PREFIX + email.trim().toLowerCase();
}
// ID ini bukan akun. ID tetap sama untuk email yang sama agar pengiriman ulang
// karena gangguan jaringan dapat dikenali oleh Google Apps Script.
function getRegistrationId(email: string) {
  const key = registrationRequestKey(email);
  try {
    const existing = localStorage.getItem(key);
    if (existing && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(existing)) return existing;
  } catch {
    // Mode privasi dapat menolak localStorage; pengunci halaman tetap aktif.
  }
  const newId = crypto.randomUUID();
  try {
    localStorage.setItem(key, newId);
  } catch {
    // Pencegahan lintas browser tetap menjadi tanggung jawab Apps Script.
  }
  return newId;
}
function readRegistration(email: string): RegistrationStatus | null {
  try {
    const raw = localStorage.getItem(registrationKey(email));
    if (!raw) return null;
    const value = JSON.parse(raw) as { status?: string };
    return value.status === "confirmed" || value.status === "unverified" ? value.status : null;
  } catch {
    return null;
  }
}
function rememberRegistration(email: string, status: RegistrationStatus) {
  try {
    localStorage.setItem(registrationKey(email), JSON.stringify({ status, savedAt: new Date().toISOString() }));
  } catch {
    // Browser yang memblokir penyimpanan tetap dilindungi oleh pengunci saat halaman aktif.
  }
}

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState<"preparing" | "sending" | "checking">("preparing");
  const [unverified, setUnverified] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const submittingRef = useRef(false);
  const requestIdRef = useRef<{ email: string; id: string } | null>(null);
  const loadingDialogRef = useRef<HTMLDivElement>(null);

  // Selama modal terbuka, kunci scroll halaman dan arahkan fokus ke dialog.
  // Modal sengaja tidak dapat ditutup: pengiriman mungkin tetap berjalan di server.
  useEffect(() => {
    if (!loading) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    loadingDialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [loading]);

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
    // ref mengunci secara sinkron sebelum React sempat memperbarui tombol.
    if (submittingRef.current || done || unverified || duplicate) return;
    const previous = readRegistration(form.email);
    if (previous) {
      setError("");
      if (previous === "confirmed") setDuplicate(true);
      else setUnverified(true);
      return;
    }
    submittingRef.current = true;
    setError("");
    setStage("preparing");
    setLoading(true);
    let requestStarted = false;
    let definitelyNotSent = false;

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

      const normalizedEmail = form.email.trim().toLowerCase();
      const registrationId =
        requestIdRef.current?.email === normalizedEmail
          ? requestIdRef.current.id
          : getRegistrationId(normalizedEmail);
      requestIdRef.current = { email: normalizedEmail, id: registrationId };

      // Mulai dari sini hasilnya mungkin tersimpan meski koneksi terputus.
      // Catat sebelum request supaya refresh browser tidak memicu kiriman kedua.
      rememberRegistration(form.email, "unverified");
      requestStarted = true;
      setStage("sending");
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          email: normalizedEmail,
          registrationId,
          portfolioFileName,
          portfolioMimeType,
          portfolioFileBase64,
        }),
      });

      setStage("checking");
      const contentType = response.headers.get("content-type") || "";
      const result = contentType.includes("application/json")
        ? await response.json().catch(() => null)
        : null;

      if (response.ok && result?.success === true) {
        rememberRegistration(form.email, "confirmed");
        setDone(true);
        setForm(initialForm);
        setPortfolioFile(null);
        track("register_success", { division: form.division });
      } else if (response.status === 409 && result?.status === "already_registered") {
        rememberRegistration(form.email, "confirmed");
        setDuplicate(true);
      } else if (
        result?.status === "not_sent"
      ) {
        // Server memastikan data belum pernah diteruskan ke Apps Script.
        try { localStorage.removeItem(registrationKey(form.email)); } catch {}
        definitelyNotSent = true;
        throw new Error(result.message || "Data belum dikirim. Periksa kembali formulir.");
      } else {
        // Respons hilang, HTML, error upstream atau 202: bukan bukti data gagal tersimpan.
        setUnverified(true);
        track("register_unverified");
      }
    } catch (err) {
      if (requestStarted) {
        // Kesalahan setelah request dimulai dapat terjadi walau Sheet sudah terisi.
        if (definitelyNotSent) {
          setError(err instanceof Error ? err.message : "Data belum dikirim. Periksa kembali formulir.");
          track("register_error");
        } else {
          setUnverified(true);
          track("register_unverified");
        }
      } else {
        setError(err instanceof Error ? err.message : "Gagal mempersiapkan berkas. Data belum dikirim; silakan perbaiki dan coba lagi.");
        track("register_error");
      }
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }

  if (!REGISTRATION_OPEN) {
    return (
      <>
        <PageHero
          eyebrow="Sumimasen Registrasi Kami Tutup • 申し訳ありません"
          title="Registrasi sedang ditutup."
          description="Saat ini pendaftaran anggota UMADO ditutup ."
        />
        <section className="bg-slate-50 py-14 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-xl px-4 sm:px-5">
            <div
              role="status"
              aria-live="polite"
              className="rounded-[28px] border border-sky-100 bg-white px-6 py-10 text-center shadow-soft sm:rounded-[32px] sm:px-10 sm:py-12"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-50">
                <Clock3 className="h-10 w-10 text-umado-blue" />
              </div>
              <h2 className="mt-6 text-2xl font-black text-umado-navy sm:text-3xl">
                Pendaftaran sedang tidak tersedia
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                Registrasi anggota UMADO sedang ditutup. Silakan hubungi kami untuk mendaftar atau mendapatkan informasi lebih lanjut.
              </p>
              <a
                href="/contact"
                className="mt-7 inline-flex items-center justify-center rounded-full bg-umado-blue px-7 py-3 font-bold text-white transition hover:bg-sky-600"
              >
                Hubungi Kami
              </a>
              <div>
                <a href="/" className="mt-5 inline-block text-sm font-semibold text-slate-500 underline">
                  Kembali ke Beranda
                </a>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (done) {
    return (
      <>
        <PageHero
          eyebrow="Registration"
          title="Terima kasih sudah mendaftar!"
          description="Data pendaftaran kamu sudah berhasil dikirim dan tercatat. Tim UMADO akan menghubungi kamu melalui kontak yang diberikan."
        />
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-xl px-4 text-center sm:px-5">
            <CheckCircle2 className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-umado-blue" />
            <h2 className="mt-6 text-2xl font-black sm:text-3xl text-umado-navy">
              Welcome to the next step.
            </h2>
            <button
              onClick={() => { window.location.href = "/"; }}
              className="mt-7 rounded-full bg-umado-navy px-6 py-3 font-bold text-white"
            >
              Kembali ke Beranda
            </button>
            <p className="mt-4 text-sm text-slate-500">Tidak perlu mengirim formulir lagi.</p>
          </div>
        </section>
      </>
    );
  }

  if (unverified || duplicate) {
    return (
      <>
        <PageHero eyebrow="Registration" title={duplicate ? "Pendaftaran sudah tercatat" : "Status pendaftaran perlu dikonfirmasi"}
          description={duplicate ? "Browser ini atau sistem pendaftaran telah mengenali email kamu sebagai pendaftar." : "Data mungkin sudah masuk, tetapi kami belum menerima konfirmasi akhir dari server."} />
        <section className="bg-slate-50 py-14 sm:py-20">
          <div role="status" aria-live="polite" className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-white px-6 py-10 text-center shadow-soft sm:px-10">
            {duplicate ? <ShieldCheck className="mx-auto h-16 w-16 text-umado-blue" /> : <Clock3 className="mx-auto h-16 w-16 text-amber-500" />}
            <h2 className="mt-5 text-2xl font-black text-umado-navy">{duplicate ? "Tidak perlu mendaftar ulang" : "Jangan kirim formulir lagi dulu"}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {duplicate ? "Pendaftaran dengan email ini sudah pernah dikonfirmasi pada browser ini atau oleh sistem. Jika ragu, hubungi tim UMADO untuk verifikasi." : "Koneksi atau respons server mungkin terputus setelah data tersimpan di Google Sheets. Kami tidak akan menyatakan gagal atau berhasil tanpa kepastian. Hubungi tim UMADO dan minta pengecekan berdasarkan email yang digunakan."}
            </p>
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900">Jangan melakukan pendaftaran berulang sebelum tim memastikan status datamu.</p>
            <a href="/contact" className="mt-7 inline-flex items-center justify-center rounded-full bg-umado-blue px-7 py-3 font-bold text-white hover:bg-sky-600">Hubungi Tim UMADO</a>
            <div><a href="/" className="mt-5 inline-block text-sm font-semibold text-slate-500 underline">Kembali ke Beranda</a></div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Join UMADO • 入会"
        title="Mulai perjalanan kreatifmu bersama UMADO."
        description=""
      />
      <section className="bg-slate-50 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-5">
          <form
            onSubmit={handleSubmit}
            className="rounded-[24px] bg-white p-4 shadow-soft sm:rounded-[32px] sm:p-6 md:p-10"
          >
            <p className="mb-6 rounded-2xl bg-sky-50 p-4 text-sm leading-6 text-umado-navy">
              <ShieldCheck className="mr-2 inline h-5 w-5 align-middle text-umado-blue" />
              Cukup daftar satu kali. Setelah klik Kirim, jangan tutup halaman atau mengirim ulang sampai status muncul.
            </p>
            <fieldset disabled={loading} className="min-w-0">
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
                  <option value="Kasei - Song Cover & Dubbing">
                    Kasei - Song Cover & Dubbing
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
                placeholder="Ceritakan alasan kamu ingin bergabung dengan UMADO..."
                value={form.motivation}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, motivation: e.target.value }))
                }
              />
            </Field>

            <Field label="Portfolio / Dokumen (opsional)">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl text-center sm:flex-row sm:gap-3 border-2 border-dashed border-slate-200 p-7 text-slate-500 hover:border-UMADO-blue hover:bg-sky-50">
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
              UMADO.
            </label>

            </fieldset>


            {error && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-umado-blue px-6 py-4 font-black text-white shadow-lg shadow-sky-200 hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sedang memproses pendaftaran..." : "Kirim Pendaftaran"}
            </button>
          </form>
        </div>
      </section>

      {loading && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#071b33]/80 px-4 py-6 backdrop-blur-sm sm:px-6"
        >
          <div
            ref={loadingDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-loading-title"
            aria-describedby="registration-loading-description"
            tabIndex={-1}
            onKeyDown={(event) => {
              // Tanpa tombol batal: jangan pindahkan fokus ke form/navigasi di belakang modal.
              if (event.key === "Tab") event.preventDefault();
            }}
            className="relative my-auto w-full max-w-md overflow-hidden rounded-[28px] bg-white px-5 pb-7 pt-9 text-center shadow-2xl outline-none sm:rounded-[32px] sm:px-9 sm:pb-9 sm:pt-11"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-umado-blue via-sky-300 to-umado-blue" />

            {/* SLOT ICON LOADING: ganti <Loader2 /> di bawah dengan ikon/gambar milikmu.
                Contoh: <img src="/assets/registration-loading.png" alt="" className="h-14 w-14 object-contain" />
                Simpan file gambarnya di public/assets; elemen dan ukuran wadah tidak perlu diubah. */}
            <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-sky-50 sm:h-32 sm:w-32">
              <span aria-hidden="true" className="absolute inset-2 animate-ping rounded-full border border-sky-200 opacity-40" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg shadow-sky-100 sm:h-24 sm:w-24">
                <Loader2 aria-hidden="true" className="h-14 w-14 animate-spin text-umado-blue" />
              </span>
            </div>

            <div role="status" aria-live="polite" aria-atomic="true">
              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.22em] text-umado-blue">
                Pendaftaran UMADO
              </p>
              <h2 id="registration-loading-title" className="mt-2 text-2xl font-black leading-tight text-umado-navy sm:text-3xl">
                Sedang memproses...
              </h2>
              <p className="mt-3 text-base font-bold text-umado-navy">
                {stage === "preparing"
                  ? "Menyiapkan data dan portfolio"
                  : stage === "sending"
                    ? "Mengirim data pendaftaran"
                    : "Memeriksa konfirmasi server"}
              </p>
              <p id="registration-loading-description" className="mt-2 text-sm leading-6 text-slate-600">
                {stage === "preparing"
                  ? "Berkas sedang disiapkan. Data belum dikirim ke server."
                  : stage === "sending"
                    ? "Data sedang dikirim. Mohon tunggu sampai hasil pendaftaran tampil."
                    : "Menunggu kepastian status penyimpanan. Jangan mengirim pendaftaran kedua."}
              </p>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-1.5" aria-label="Tahapan proses pendaftaran">
              {(["Persiapan", "Pengiriman", "Konfirmasi"] as const).map((label, index) => {
                const current = stage === "preparing" ? 0 : stage === "sending" ? 1 : 2;
                const completed = index < current;
                const active = index === current;
                return (
                  <div key={label} className="min-w-0">
                    <div
                      aria-hidden="true"
                      className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-black sm:h-10 sm:w-10 ${
                        completed || active
                          ? "bg-umado-blue text-white"
                          : "bg-slate-100 text-slate-400"
                      } ${active ? "ring-4 ring-sky-100" : ""}`}
                    >
                      {completed ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                    </div>
                    <p className={`mt-2 text-[11px] font-bold sm:text-xs ${completed || active ? "text-umado-navy" : "text-slate-400"}`}>
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="mt-7 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-semibold leading-5 text-umado-navy sm:text-sm">
              Jangan tutup atau refresh halaman, ya. Cukup daftar sekali — hasilnya akan muncul otomatis setelah proses selesai.
            </p>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Pengunggahan portfolio atau koneksi yang lambat dapat membuat proses lebih lama.
            </p>
          </div>
        </div>
      )}

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
