const SHEET_ID = '13NputFVrvhMti9Y7AkG8_Z4Fo70kyrumV82ZeqVZ0x0';
const SHEET_NAME = 'Sheet1';
const NOTIFY_EMAIL = 'careerarth@gmail.com';

function doPost(e) {
  try {
    const payload = parseJsonBody_(e);
    const name = clean_(payload.name);
    const email = clean_(payload.email).toLowerCase();
    const linkedin = clean_(payload.linkedin);
    const phone = clean_(payload.phone);
    const source = clean_(payload.source || 'careerarth_website');

    if (!name) {
      return jsonResponse_(400, { ok: false, error: 'Name is required.' });
    }

    if (!isValidEmail_(email)) {
      return jsonResponse_(400, { ok: false, error: 'Valid email is required.' });
    }

    if (linkedin && !isValidUrl_(linkedin)) {
      return jsonResponse_(400, { ok: false, error: 'LinkedIn URL is invalid.' });
    }

    if (phone && !isValidPhone_(phone)) {
      return jsonResponse_(400, { ok: false, error: 'Phone number is invalid.' });
    }

    const sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      name,
      email,
      linkedin,
      phone,
      source,
    ]);

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'New Career Arth consultation lead',
      htmlBody:
        '<p>A new consultation lead was submitted.</p>' +
        '<p><strong>Name:</strong> ' + escapeHtml_(name) + '</p>' +
        '<p><strong>Email:</strong> ' + escapeHtml_(email) + '</p>' +
        '<p><strong>LinkedIn:</strong> ' + escapeHtml_(linkedin || '-') + '</p>' +
        '<p><strong>Phone:</strong> ' + escapeHtml_(phone || '-') + '</p>' +
        '<p><strong>Source:</strong> ' + escapeHtml_(source) + '</p>',
    });

    return jsonResponse_(200, { ok: true });
  } catch (error) {
    return jsonResponse_(500, {
      ok: false,
      error: error && error.message ? error.message : 'Internal server error.',
    });
  }
}

function parseJsonBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Missing request body.');
  }

  return JSON.parse(e.postData.contents);
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Submitted At', 'Name', 'Email', 'LinkedIn', 'Phone', 'Flow']);
  }

  return sheet;
}

function jsonResponse_(status, payload) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: status,
      ...payload,
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function clean_(value) {
  return String(value || '').trim();
}

function isValidEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUrl_(value) {
  return /^https?:\/\/.+/i.test(value);
}

function isValidPhone_(value) {
  return /^[+]?[0-9\s\-()]{7,20}$/.test(value);
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
