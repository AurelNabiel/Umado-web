# Setup Registrasi UMADO ke Google Sheets

Website sudah diubah agar form `/register` mengirim data ke endpoint Next.js `/api/register`, lalu endpoint server meneruskan data ke Google Apps Script. Apps Script menambahkan satu baris baru ke Google Sheet setiap pendaftaran berhasil.

## 1. Buat Google Sheet

Buat Google Sheet baru, misalnya **UMADO - Data Pendaftaran**.

Tidak perlu membuat header manual. Script akan membuat sheet bernama `Registrasi` dan header otomatis ketika pendaftaran pertama masuk.

Ambil **Spreadsheet ID** dari URL Google Sheet:

`https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

## 2. Buat Google Apps Script

Dari Google Sheet buka **Extensions > Apps Script**.

Hapus isi `Code.gs`, kemudian copy seluruh isi file:

`google-apps-script/Code.gs`

## 3. Isi Script Properties

Di Apps Script buka **Project Settings > Script Properties**, lalu tambahkan:

- `SPREADSHEET_ID` = ID Google Sheet tadi
- `SHEET_NAME` = `Registrasi`
- `REGISTRATION_SHARED_SECRET` = secret random panjang, contoh buat sendiri minimal 32 karakter

Secret jangan ditaruh di source frontend.

## 4. Deploy sebagai Web App

Di Apps Script:

1. Klik **Deploy > New deployment**.
2. Pilih **Web app**.
3. Execute as: **Me**.
4. Atur akses agar endpoint dapat dipanggil oleh website sesuai opsi deployment yang tersedia pada akun Google Anda.
5. Klik **Deploy** dan selesaikan authorization.
6. Copy URL deployment yang berakhiran `/exec`.

Setiap kali mengubah `Code.gs` setelah deployment, buat/update deployment agar versi terbaru yang digunakan.

## 5. Buat `.env.local`

Di root project, copy `.env.example` menjadi `.env.local`:

```env
GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
REGISTRATION_SHARED_SECRET=SECRET_YANG_SAMA_DENGAN_SCRIPT_PROPERTIES
```

Jangan commit `.env.local` ke Git.

## 6. Jalankan website

```bash
npm run dev
```

Buka:

`http://localhost:3000/register`

Isi form lalu klik **Kirim Pendaftaran**.

Jika berhasil, baris baru akan muncul di Google Sheet.

## Kolom Google Sheet

1. Timestamp
2. Nama Lengkap
3. Email
4. No. HP / WhatsApp
5. Divisi
6. Motivasi Bergabung
7. Nama File Portfolio
8. Persetujuan
9. Submitted At (Website)

## Tentang Portfolio

Versi ini menyimpan **nama file portfolio** ke Google Sheet, tetapi belum meng-upload file fisiknya. Untuk upload file sebenarnya, integrasi Google Drive dapat ditambahkan kemudian sehingga Google Sheet menyimpan link file Drive.

## Deployment production

Endpoint `/api/register` adalah Next.js server route. Deploy project pada platform yang mendukung Next.js server/API routes (misalnya Vercel atau server Node.js). Jika project dibuat sebagai static export murni, endpoint API ini tidak akan berjalan.
