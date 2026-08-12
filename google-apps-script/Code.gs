/**
 * UMADO Registration -> Google Sheets
 *
 * Script Properties yang wajib dibuat:
 * SPREADSHEET_ID                = ID Google Sheet tujuan
 * SHEET_NAME                    = Registrasi   (opsional, default: Registrasi)
 * REGISTRATION_SHARED_SECRET    = secret yang sama dengan .env website
 */

function doGet() {
  return jsonResponse({
    success: true,
    message: "UMADO registration endpoint is active."
  });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, message: "Request body kosong." });
    }

    var data = JSON.parse(e.postData.contents);
    var props = PropertiesService.getScriptProperties();
    var spreadsheetId = props.getProperty("SPREADSHEET_ID");
    var sheetName = props.getProperty("SHEET_NAME") || "Registrasi";
    var expectedSecret = props.getProperty("REGISTRATION_SHARED_SECRET");

    if (!spreadsheetId || !expectedSecret) {
      return jsonResponse({
        success: false,
        message: "Script Properties belum lengkap."
      });
    }

    if (!data.secret || data.secret !== expectedSecret) {
      return jsonResponse({ success: false, message: "Unauthorized." });
    }

    var required = [
      data.fullName,
      data.email,
      data.phone,
      data.division,
      data.motivation
    ];

    for (var i = 0; i < required.length; i++) {
      if (!required[i] || String(required[i]).trim() === "") {
        return jsonResponse({
          success: false,
          message: "Data wajib belum lengkap."
        });
      }
    }

    if (data.consent !== true) {
      return jsonResponse({
        success: false,
        message: "Persetujuan pendaftaran belum diberikan."
      });
    }

    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName(sheetName);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }

    ensureHeader(sheet);

    sheet.appendRow([
      new Date(),
      safeCell(data.fullName),
      safeCell(data.email),
      safeCell(data.phone),
      safeCell(data.division),
      safeCell(data.motivation),
      safeCell(data.portfolioName || ""),
      data.consent === true ? "Ya" : "Tidak",
      safeCell(data.submittedAt || "")
    ]);

    return jsonResponse({
      success: true,
      message: "Data berhasil disimpan ke Google Sheet."
    });
  } catch (error) {
    console.error(error);
    return jsonResponse({
      success: false,
      message: "Server Google Apps Script gagal memproses data."
    });
  }
}

function ensureHeader(sheet) {
  if (sheet.getLastRow() > 0) return;

  sheet.appendRow([
    "Timestamp",
    "Nama Lengkap",
    "Email",
    "No. HP / WhatsApp",
    "Divisi",
    "Motivasi Bergabung",
    "Nama File Portfolio",
    "Persetujuan",
    "Submitted At (Website)"
  ]);

  sheet.getRange(1, 1, 1, 9).setFontWeight("bold");
  sheet.setFrozenRows(1);
}

// Mencegah input yang diawali =, +, -, @ dibaca sebagai formula spreadsheet.
function safeCell(value) {
  var text = String(value == null ? "" : value).trim();
  if (/^[=+\-@]/.test(text)) {
    return "'" + text;
  }
  return text;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
