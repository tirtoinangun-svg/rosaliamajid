# 📖 Panduan Pemilik Website — Rosalia Majid MC

Dokumen ini panduan lengkap untuk mengelola website Anda tanpa perlu paham coding.

---

## 📁 Struktur File

```
mc-rosa/
├── index.html      ← Isi konten (teks, foto mana yang tampil)
├── styles.css      ← Desain & warna (jangan diubah)
├── script.js       ← Logika + KONFIGURASI (yang perlu Anda edit)
└── images/         ← SEMUA foto landing page ada di sini
```

---

## ⚙️ SETUP AWAL (WAJIB SEKALI SAJA)

Buka `script.js` dengan text editor. Di bagian paling atas (baris 6–53) ada area **⚙️ OWNER CONFIG**. Ada 3 hal yang perlu di-set:

1. `SHEET_URL` — untuk kalender booking (lihat bagian 📅)
2. `WHATSAPP_NUMBER` — sudah diisi `6281188070929`, ganti kalau berubah
3. `TESTIMONIAL_ENDPOINT` — untuk form testimoni (lihat bagian 📝)

---

## 🖼️ Cara Ganti Foto (PALING SERING)

### Aturan dasar:
1. Buka folder `images/`
2. **Pertahankan nama file yang sama**. Contoh: foto profil utama harus tetap bernama `Personal_Photo_2.JPG`
3. Upload foto baru dengan nama file yang sama → foto lama otomatis terganti
4. Refresh browser → foto langsung berubah

### Daftar foto yang dipakai:

| Lokasi di Web | Nama File |
|---|---|
| Hero (portrait besar) | `Personal_Photo_2.JPG` |
| About (foto utama) | `Personal_Photo.JPG` |
| About (foto kecil) | `Engagement_Event.jpeg` |
| Gallery Carousel | `wedding_event_1.JPG`, `wedding_event_2.JPG`, `Engagement_Event.jpeg`, `government_event.jpg`, `government_event.jpeg`, `Event_Dinas_Perhubungan.jpeg`, `Event_Dinas_Perhubungan.jpg`, `FGD_Event.jpeg`, `Bike_To_Work_Event.jpeg`, `Corporate_Event.jpeg`, `Corporate_FGD_Event.jpg`, `corporate_FGD.jpg`, `BNSP_Certification.jpg` |
| Logo klien | `Logo_Provinsi_DKI_Jakarta_koleksilogo_com_1.png`, `OIP.webp`, `LOGOPNGBNSP.png` |

> 💡 **Tip**: Resolusi minimal 1200px (lebar). Kompres dengan tinypng.com agar loading cepat.

---

## 📅 Cara Setting Booking Calendar

Kalender booking mengambil data dari **Google Sheets** Anda.

### Langkah setup (SEKALI SAJA):

**1. Buat Google Sheet baru** dengan format persis seperti ini:

| Tanggal     | Sesi  |
|-------------|-------|
| 2026-05-01  | pagi  |
| 2026-05-01  | sore  |
| 2026-05-03  | pagi  |
| 2026-06-14  | sore  |

**Aturan penting:**
- Baris 1 = header: `Tanggal` dan `Sesi`
- Kolom **Tanggal** format: `YYYY-MM-DD` (contoh: `2026-05-01` untuk 1 Mei 2026)
- Kolom **Sesi** isi: `pagi` atau `sore` (huruf kecil)
- Satu baris = satu slot sudah dibooking
- Untuk tanggal penuh, buat 2 baris (pagi + sore)

**2. Publish ke web sebagai CSV**

1. Klik **File → Share → Publish to web**
2. Pilih format: **Comma-separated values (.csv)**
3. Klik **Publish**
4. Copy link yang muncul (ujungnya `.../pub?output=csv`)

**3. Masukkan link ke website**

Buka `script.js`, cari baris:
```js
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/PASTE_YOUR_PUBLISHED_CSV_URL_HERE/pub?output=csv";
```

Ganti `PASTE_YOUR_PUBLISHED_CSV_URL_HERE` dengan link Anda.

### Setelah setup:
- Tambahkan baris baru di Google Sheet setiap ada klien booking
- **Perubahan otomatis muncul di website** (tanpa edit code)
- Slot yang dibooking → otomatis ditandai coklat gelap & tidak bisa diklik

---

## 📝 Cara Setting Form Testimoni

Pengunjung bisa isi form testimoni → masuk otomatis ke Google Sheet Anda.

### Langkah setup (SEKALI SAJA):

**1. Buat Google Sheet baru untuk testimoni**

Header di baris 1:

| Tanggal | Nama | Jenis Acara | Rating | Pesan |
|---------|------|-------------|--------|-------|

Kosongkan data, biarkan header saja.

**2. Buka Apps Script**

Di Google Sheet: **Extensions → Apps Script** → hapus semua kode bawaan, paste kode ini:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(data.tanggal || new Date()),
      data.nama || "",
      data.jenis_acara || "",
      data.rating || "",
      data.pesan || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Testimoni endpoint aktif. POST only.");
}
```

**3. Deploy sebagai Web App**

1. Klik tombol **Deploy** (pojok kanan atas) → **New deployment**
2. Klik icon ⚙️ di sebelah "Select type" → pilih **Web app**
3. Isi form:
   - **Description**: Testimoni MC Rosa
   - **Execute as**: Me (email Anda)
   - **Who has access**: **Anyone** ← PENTING, harus Anyone
4. Klik **Deploy**
5. Saat diminta permission, klik **Authorize access** → pilih akun Google Anda → klik **Advanced** → **Go to (project name) (unsafe)** → **Allow**
6. Copy **Web app URL** yang muncul (format: `https://script.google.com/macros/s/XXXXX/exec`)

**4. Masukkan URL ke website**

Buka `script.js`, cari baris:
```js
const TESTIMONIAL_ENDPOINT = "https://script.google.com/macros/s/PASTE_YOUR_APPS_SCRIPT_URL_HERE/exec";
```

Ganti dengan URL Web app Anda.

### Setelah setup:
- Pengunjung isi form → data masuk otomatis ke Google Sheet
- Anda review testimoni → kalau bagus, copy ke `index.html` bagian testimoni
- Jika belum di-setup, form tetap bekerja tapi data tersimpan sementara di browser pengunjung

---

## 📞 Cara Ganti Nomor WhatsApp

Di `script.js`, cari:
```js
const WHATSAPP_NUMBER = "6281188070929";
```

Format: kode negara + nomor tanpa `+` atau `0` di depan.

Contoh: `08123456789` → tulis `628123456789`

Ini otomatis dipakai oleh:
- Tombol "Konsultasi Gratis" di hero
- Tombol floating WhatsApp (hijau pojok kanan bawah)
- Tombol floating Konsultasi Gratis
- Kalender booking (auto-fill pesan saat klik slot)

---

## 💬 Cara Ganti Pesan Konsultasi Gratis

Saat pengunjung klik tombol "Konsultasi Gratis", WhatsApp terbuka dengan pesan auto-fill. Untuk ganti pesannya, buka `script.js`:

```js
const CONSULT_MESSAGE = `Halo Kak Rosalia 👋

Saya ingin konsultasi gratis soal rencana acara saya.
Bisa bantu diskusi?

Terima kasih!`;
```

Edit teks di dalam backticks `` ` `` sesuai keinginan.

---

## ✏️ Cara Edit Teks

Semua teks ada di `index.html`. Buka pakai text editor, cari & ganti teks yang diinginkan.

| Yang Mau Diedit | Cari teks ini |
|---|---|
| Judul hero | `Menghadirkan` |
| Tagline | `Menuntun Setiap` |
| About me | `Halo, saya <em>Rosalia` |
| Nomor WA di kontak | `0811 8807 0929` |
| Email | `rosaliamajid@gmail.com` |
| Instagram | `@rosaliamajid` |
| Testimoni existing | `Best MC ever!` atau `Seneng banget pakai MC Rosa` |
| FAQ | `Apakah melayani acara di luar kota` |

---

## 🎨 Fitur-Fitur Website

✨ **Mouse trail luxury** — efek kursor gold transparan yang mengikuti cursor (auto off di HP)
📱 **2 tombol WhatsApp floating** — hijau (chat biasa) + coklat (konsultasi gratis)
📅 **Booking calendar** — terintegrasi Google Sheets
📝 **Form Testimoni** — dengan rating stars, anti-spam, otomatis ke Google Sheets
📸 **Gallery carousel** — auto-play + drag-to-scroll + dots navigation
🎬 **Parallax scroll** — semua section punya animasi scroll halus 60fps
🎨 **Responsive** — otomatis rapi di HP, tablet, desktop
⚡ **Smooth navigation** — click menu → scroll lembut ke section

---

## 🚨 Troubleshooting

### Kalender tidak muncul data booking?
- Pastikan link Google Sheet sudah dipublish sebagai CSV
- Pastikan format tanggal `YYYY-MM-DD` (bukan `DD/MM/YYYY`)
- Pastikan sesi ditulis `pagi` atau `sore` (huruf kecil)

### Form testimoni tidak masuk ke Google Sheet?
- Pastikan Apps Script sudah di-deploy sebagai **Web App**
- Pastikan **Who has access: Anyone** saat deploy
- Coba akses URL Web app di browser → harusnya muncul "Testimoni endpoint aktif"
- Kalau update Apps Script, **harus deploy ulang** dengan versi baru (Deploy → Manage deployments → Edit → New version)

### Foto tidak muncul?
- Nama file harus persis sama (case-sensitive): `Personal_Photo.JPG` ≠ `personal_photo.jpg`
- Pastikan file ada di folder `images/`

### Menu di HP tidak bisa di-klik?
- Sudah di-fix di versi terbaru. Kalau masih, clear cache browser (Ctrl+Shift+R atau Cmd+Shift+R)

### Website lambat?
- Kompres foto ke < 500KB pakai tinypng.com
- Video showreel sebaiknya pakai link YouTube/Drive (sudah di-set)

---

## 🚀 Cara Hosting (Upload ke Internet)

**Option 1 — Gratis & termudah: Netlify Drop**
1. Buka [netlify.com/drop](https://www.netlify.com/drop)
2. Drag folder `mc-rosa` ke area drop
3. Tunggu upload → dapat URL gratis (contoh: `amazing-site-123.netlify.app`)
4. (Opsional) Custom domain dari Netlify

**Option 2 — Vercel**
- Sama caranya, upload folder ke [vercel.com](https://vercel.com)

**Option 3 — Hosting biasa (cPanel)**
- Upload semua isi folder ke `public_html/` atau folder root domain Anda

---

Selamat mengelola! 🤝

Jika ada pertanyaan lebih lanjut atau kendala, hubungi developer Anda.
