import { NextResponse } from "next/server";
import { REGISTRATION_OPEN } from "@/lib/registration-config";

type RegistrationPayload = {
  registrationId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  division?: string;
  motivation?: string;
  portfolioFileName?: string;
  portfolioMimeType?: string;
  portfolioFileBase64?: string;
  consent?: boolean;
};

// Harus sinkron dengan MAX_UPLOAD_MB di src/app/register/page.tsx —
// di bawah 4.5MB hard-limit payload Vercel Function.
const MAX_UPLOAD_MB = 3;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  if (!REGISTRATION_OPEN) {
    return NextResponse.json(
      {
        success: false,
        status: "registration_closed",
        message: "Registrasi sedang ditutup. Silakan hubungi tim UMADO untuk mendaftar.",
      },
      { status: 403 }
    );
  }

  let forwardedToGoogle = false;
  try {
    const body = (await request.json()) as RegistrationPayload;

    const fullName = clean(body.fullName);
    const email = clean(body.email).toLowerCase();
    const registrationId = clean(body.registrationId);
    const phone = clean(body.phone);
    const division = clean(body.division);
    const motivation = clean(body.motivation);
    const portfolioFileName = clean(body.portfolioFileName);
    const portfolioMimeType = clean(body.portfolioMimeType);
    const portfolioFileBase64 =
      typeof body.portfolioFileBase64 === "string" ? body.portfolioFileBase64 : "";
    const consent = body.consent === true;

    if (!fullName || !email || !phone || !division || !motivation || !consent) {
      return NextResponse.json(
        {
          success: false,
          status: "not_sent",
          message: "Mohon lengkapi seluruh data wajib dan persetujuan pendaftaran.",
        },
        { status: 400 }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { success: false, status: "not_sent", message: "Format email tidak valid." },
        { status: 400 }
      );
    }

    // ID dibuat sekali oleh browser untuk mengenali retry. Tidak menggantikan
    // pemeriksaan email + penguncian di Google Apps Script.
    if (registrationId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(registrationId)) {
      return NextResponse.json(
        { success: false, status: "not_sent", message: "ID pendaftaran tidak valid. Muat ulang halaman dan coba lagi." },
        { status: 400 }
      );
    }

    // Harus sinkron dengan MAX_UPLOAD_MB di src/app/register/page.tsx —
    // di bawah 4.5MB hard-limit payload Vercel Function.
    const approxFileSizeMb = (portfolioFileBase64.length * 0.75) / (1024 * 1024);
    if (approxFileSizeMb > MAX_UPLOAD_MB) {
      return NextResponse.json(
        {
          success: false,
          status: "not_sent",
          message: `Ukuran file portfolio maksimal ${MAX_UPLOAD_MB}MB.`,
        },
        { status: 413 }
      );
    }

    const webAppUrl = process.env.GOOGLE_SHEETS_WEB_APP_URL;
    const sharedSecret = process.env.REGISTRATION_SHARED_SECRET;

    if (!webAppUrl || !sharedSecret) {
      console.error(
        "Missing GOOGLE_SHEETS_WEB_APP_URL or REGISTRATION_SHARED_SECRET"
      );
      return NextResponse.json(
        {
          success: false,
          status: "not_sent",
          message: "Integrasi Google Sheet belum dikonfigurasi di server.",
        },
        { status: 500 }
      );
    }

    forwardedToGoogle = true;
    const googleResponse = await fetch(webAppUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: sharedSecret,
        registrationId,
        fullName,
        email,
        phone,
        division,
        motivation,
        portfolioFileName,
        portfolioMimeType,
        portfolioFileBase64,
        consent,
        submittedAt: new Date().toISOString(),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    });

    const rawResult = await googleResponse.text();
    let result: { success?: boolean; message?: string; status?: string; registrationId?: string } = {};

    try {
      result = JSON.parse(rawResult);
    } catch {
      // Jangan log isi respons: berpotensi mengandung data pribadi pendaftar.
      console.error("Invalid Google Apps Script response", googleResponse.status);
    }

    const status = (result.status || "").toLowerCase();
    // ContentService Apps Script biasanya merespons HTTP 200, termasuk duplikat.
    // HTTP 409 tanpa status JSON eksplisit BUKAN bukti email sudah terdaftar.
    if (status === "already_registered") {
      return NextResponse.json(
        { success: false, status: "already_registered", message: "Email ini sudah terdaftar. Tidak ada data baru yang disimpan." },
        { status: 409 }
      );
    }
    // Hanya terima status not_sent jika Apps Script secara eksplisit menjamin
    // tidak ada operasi penyimpanan yang dimulai.
    if (googleResponse.ok && status === "not_sent") {
      return NextResponse.json(
        { success: false, status: "not_sent", message: result.message || "Data belum dikirim karena validasi server." },
        { status: 400 }
      );
    }
    // Jika Apps Script mengembalikan ID, wajib sesuai dengan request.
    // Respons legacy success:true masih diterima agar integrasi lama tidak putus,
    // tetapi anti-duplikasi lintas perangkat baru berlaku setelah guard dipasang.
    const idMatches = !result.registrationId || result.registrationId === registrationId;
    if (!googleResponse.ok || result.success !== true || !idMatches ||
        (status && status !== "success" && status !== "registered")) {
      console.error("Google Apps Script confirmation missing", googleResponse.status, status);
      return NextResponse.json(
        {
          success: false,
          status: "unverified",
          message: "Permintaan sudah diteruskan, tetapi status penyimpanan belum dapat dikonfirmasi. Jangan kirim ulang sebelum menghubungi tim UMADO.",
        },
        { status: 202 }
      );
    }

    return NextResponse.json({
      success: true,
      status: "success",
      registrationId,
      message: "Pendaftaran berhasil disimpan.",
    });
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      {
        success: false,
        status: forwardedToGoogle ? "unverified" : "not_sent",
        message: forwardedToGoogle
          ? "Status pendaftaran belum dapat dipastikan. Jangan kirim ulang sebelum tim UMADO mengecek Google Sheets."
          : "Data belum dikirim. Periksa formulir dan coba kembali.",
      },
      { status: forwardedToGoogle ? 202 : 400 }
    );
  }
}
