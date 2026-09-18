import { NextResponse } from "next/server";

type RegistrationPayload = {
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
  let forwardedToGoogle = false;
  try {
    const body = (await request.json()) as RegistrationPayload;

    const fullName = clean(body.fullName);
    const email = clean(body.email);
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
    });

    const rawResult = await googleResponse.text();
    let result: { success?: boolean; message?: string } = {};

    try {
      result = JSON.parse(rawResult);
    } catch {
      console.error("Invalid Google Apps Script response:", rawResult);
    }

    // Hanya respons success:true yang membuktikan penyimpanan selesai.
    // Jika Apps Script memberi status duplikat, sampaikan tanpa menulis ulang.
    if (googleResponse.status === 409 || (result as { status?: string }).status === "already_registered") {
      return NextResponse.json(
        { success: false, status: "already_registered", message: "Email sudah terdaftar." },
        { status: 409 }
      );
    }
    if (!googleResponse.ok || result.success !== true) {
      console.error("Google Apps Script confirmation missing:", googleResponse.status, rawResult);
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
