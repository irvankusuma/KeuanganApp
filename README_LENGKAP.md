# 💰 KeuanganApp - Aplikasi Manajemen Keuangan Pribadi

[![Version](https://img.shields.io/badge/version-2.4.0-blue.svg)](https://github.com/yourusername/keuangan-app)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-enabled-purple.svg)](https://web.dev/progressive-web-apps/)

**KeuanganApp** adalah aplikasi Progressive Web App (PWA) untuk mengelola keuangan pribadi dan catatan perbaikan kendaraan secara offline. Aplikasi ini dirancang dengan antarmuka dark mode yang modern, responsive, dan mudah digunakan.

![KeuanganApp Screenshot](screenshot.png)

---

## 🌟 Fitur Utama

### 💳 Manajemen Hutang
- Catat semua hutang yang harus dibayar
- Sistem cicilan dengan tracking pembayaran
- Progress bar untuk monitoring pembayaran
- Histori lengkap setiap pembayaran
- Alert otomatis saat hutang lunas
- Support berbagai tipe hutang (Pribadi, Kredit, Bank, dll)

### 💰 Manajemen Piutang
- Catat orang yang berhutang kepada Anda
- Terima dan tracking pembayaran
- Jatuh tempo dengan alert otomatis
- Status LUNAS/JATUH TEMPO
- Histori pembayaran per orang

### 📈 Manajemen Pemasukan
- Catat semua sumber pemasukan
- Kategorisasi berdasarkan tipe
- Filter dan tracking mudah
- Support berbagai sumber (Gaji, Bonus, Freelance, dll)

### 📉 Manajemen Pengeluaran
- Catat pengeluaran harian
- Kategorisasi detail
- Catatan bebas untuk setiap transaksi
- Summary per kategori

### 🔧 Catatan Perbaikan
- Khusus untuk maintenance kendaraan
- Tracking kilometer
- Estimasi waktu perbaikan berikutnya
- Alert saat mendekati jadwal service
- Riwayat lengkap perbaikan

### 📊 Dashboard Interaktif
- **Saldo Bersih** dengan breakdown detail
- Ringkasan total semua kategori
- Recent activities dari semua fitur
- Visual progress bars
- Real-time updates

### 💾 Backup & Restore
- **Export** data ke TXT atau Excel
- **Import** data dari file backup
- Backup otomatis ke file lokal
- Data portability penuh

---

## 🚀 Teknologi

### Frontend Framework
- **React 18** - UI Framework
- **Vite** - Build tool (super fast!)
- **Tailwind CSS** - Styling dengan dark mode built-in

### Database & Storage
- **IndexedDB** - Local database (via Dexie.js)
- **Dexie.js** - IndexedDB wrapper
- **LocalStorage** - App settings

### PWA Features
- **Service Worker** - Offline functionality
- **Web Manifest** - Installable app
- **Cache API** - Fast loading

### Libraries
- **lucide-react** - Beautiful icons
- **SheetJS (xlsx)** - Excel export/import
- **Workbox** - PWA optimization

---

## 📦 Instalasi

### Prerequisites
- Node.js 16+ dan npm
- Browser modern (Chrome, Firefox, Safari, Edge)

### Setup Development

```bash
# 1. Clone repository
git clone https://github.com/yourusername/keuangan-app.git
cd keuangan-app

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open browser
# Otomatis terbuka di http://localhost:5173
```

### Build Production

```bash
# Build aplikasi
npm run build

# Preview build
npm run preview
```

---

## 📱 Install sebagai PWA

### Android
1. Buka aplikasi di Chrome
2. Tap menu (⋮) → **"Add to Home Screen"**
3. Aplikasi muncul di home screen
4. Buka seperti aplikasi native

### iOS (iPhone/iPad)
1. Buka di Safari
2. Tap tombol **Share** (⬆️)
3. Pilih **"Add to Home Screen"**
4. Tap **"Add"**

### Desktop
1. Buka di Chrome/Edge
2. Klik icon install di address bar
3. Klik **"Install"**
4. Aplikasi berjalan seperti desktop app

---

## 🎯 Cara Penggunaan

### 1. Dashboard - Lihat Ringkasan
```
💎 Saldo Bersih: Rp 15.750.000
├─ Pemasukan + Piutang: Rp 25.000.000
└─ Pengeluaran + Hutang: Rp 9.250.000

📊 Summary Cards:
- Sisa Hutang: Rp 5.000.000 (dari 3 hutang)
- Sisa Piutang: Rp 3.000.000 (dari 2 piutang)
- Total Pemasukan: Rp 20.000.000
- Total Pengeluaran: Rp 4.250.000
```

### 2. Tambah Hutang
```
Menu → Hutang → Tambah Hutang

Form:
├─ Nama: "Cicilan Motor Honda"
├─ Tipe: "Kredit"
├─ Jumlah: Rp 15.000.000
├─ Periode: 12 bulan
├─ Tanggal: 01/01/2024
└─ Catatan: "Bunga 0%"

→ Simpan
```

### 3. Bayar Hutang
```
Klik "Bayar" pada hutang

Form:
├─ Jumlah Bayar: Rp 1.250.000
├─ Tanggal: 01/02/2024
└─ Catatan: "Cicilan bulan Februari"

→ Bayar

Progress: ████░░░░░░░░ 8.3%
Sisa: Rp 13.750.000
```

### 4. Tambah Piutang
```
Menu → Piutang → Tambah Piutang

Form:
├─ Nama Orang: "Ahmad"
├─ Jumlah: Rp 5.000.000
├─ Tanggal Pinjam: 15/01/2024
├─ Jatuh Tempo: 15/12/2024
└─ Catatan: "Untuk modal usaha"

→ Simpan
```

### 5. Terima Pembayaran Piutang
```
Klik "Terima" pada piutang Ahmad

Form:
├─ Jumlah Diterima: Rp 2.000.000
├─ Tanggal: 15/03/2024
└─ Catatan: "Cicilan 1"

→ Terima

Progress: ████████░░░░ 40%
Sisa: Rp 3.000.000
```

### 6. Catat Perbaikan
```
Menu → Perbaikan → Tambah

Form:
├─ Nama: "Ganti Oli Mesin"
├─ Tanggal: 01/02/2024
├─ KM Saat Ini: 15.000
├─ KM Berikutnya: 20.000
└─ Catatan: "Oli Shell Helix 10W-40"

→ Simpan

Alert: "Perbaikan berikutnya dalam ~100 hari"
```

### 7. Export Data (Backup)
```
Klik "Export" → Tab "Export"

Pilihan:
├─ TXT: File teks terformat
└─ Excel: Spreadsheet dengan multiple sheets

→ Download
File: keuangan-export-1234567890.xlsx
```

### 8. Import Data (Restore)
```
Klik "Export" → Tab "Import"

Pilihan:
├─ Import dari TXT
└─ Import dari Excel

→ Upload file
→ ✅ Berhasil import 47 data!
```

---

## 💡 Fitur Unggulan

### 🔄 Auto-Format Angka
Semua input nominal otomatis terformat dengan pemisah ribuan:
```
Input: 15000000
Display: 15.000.000 ✅
```

### 📊 Real-time Updates
Semua perubahan langsung terlihat:
- Bayar hutang → Progress bar update
- Terima piutang → Saldo update
- Tambah data → Dashboard update

### 🎯 Smart Alerts
- **Hutang Lunas**: Alert otomatis saat hutang terbayar penuh
- **Jatuh Tempo**: Badge merah pada piutang yang lewat deadline
- **Perbaikan Due**: Warning saat mendekati jadwal service

### 📱 Responsive Design
- **Mobile**: Bottom navigation (6 menu)
- **Tablet**: Optimized layout
- **Desktop**: Sidebar toggle (tutup/buka)

### 🌙 Dark Mode
- Theme gelap yang nyaman di mata
- Battery-friendly di OLED screens
- Professional look

### 💾 Offline First
- Bekerja 100% tanpa internet
- Data tersimpan lokal
- Service worker caching
- Instant load

---

## 📂 Struktur Project

```
keuangan-app/
├── public/                      # Static assets & PWA icons
│   ├── pwa-192x192.png
│   └── pwa-512x512.png
│
├── src/
│   ├── components/
│   │   ├── common/             # Reusable components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   ├── Header.jsx
│   │   │   └── ImportExportModal.jsx
│   │   │
│   │   ├── dashboard/          # Dashboard
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── hutang/             # Hutang management
│   │   │   └── Hutang.jsx
│   │   │
│   │   ├── piutang/            # Piutang management
│   │   │   └── Piutang.jsx
│   │   │
│   │   ├── pemasukan/          # Pemasukan management
│   │   │   └── Pemasukan.jsx
│   │   │
│   │   ├── pengeluaran/        # Pengeluaran management
│   │   │   └── Pengeluaran.jsx
│   │   │
│   │   └── maintenance/        # Perbaikan tracking
│   │       └── Maintenance.jsx
│   │
│   ├── db/
│   │   └── database.js         # IndexedDB schema (Dexie)
│   │
│   ├── utils/
│   │   ├── formatters.js       # Format currency, date, numbers
│   │   ├── export.js           # Export to TXT & Excel
│   │   └── import.js           # Import from TXT & Excel
│   │
│   ├── styles/
│   │   └── index.css           # Global CSS + Tailwind
│   │
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
│
├── index.html                  # HTML template
├── vite.config.js             # Vite & PWA configuration
├── tailwind.config.js         # Tailwind configuration
├── package.json               # Dependencies
└── README.md                  # Dokumentasi
```

---

## 🗄️ Database Schema

### Tables (IndexedDB)

```javascript
// Main data tables
hutang              // Data hutang
pembayaranHutang    // Histori pembayaran hutang
piutang             // Data piutang
pembayaranPiutang   // Histori pembayaran piutang
pemasukan           // Data pemasukan
pengeluaran         // Data pengeluaran
maintenance         // Data perbaikan

// Master data tables
tipeHutang          // Master tipe hutang
tipePemasukan       // Master tipe pemasukan
kategoriPengeluaran // Master kategori pengeluaran
```

### Example: Hutang Schema
```javascript
{
  id: 1,                          // Auto-increment
  nama: "Cicilan Motor Honda",
  tipe: "Kredit",
  jumlah: 15000000,
  periode: 12,
  tanggal: "2024-01-01",
  catatan: "Bunga 0%"
}
```

### Example: Pembayaran Hutang Schema
```javascript
{
  id: 1,
  hutangId: 1,                    // Foreign key
  jumlah: 1250000,
  tanggal: "2024-02-01",
  catatan: "Cicilan bulan Februari"
}
```

---

## 🎨 Customization

### Mengubah Warna Theme

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      dark: {
        bg: '#0f172a',      // Background utama
        card: '#1e293b',    // Background card
        border: '#334155',  // Border color
      }
    }
  }
}
```

### Menambah Tipe/Kategori Default

Edit `src/db/database.js`:

```javascript
db.on('populate', async () => {
  // Tambah tipe hutang
  await db.tipeHutang.bulkAdd([
    { nama: 'Tipe Baru' }
  ]);
  
  // Tambah kategori pengeluaran
  await db.kategoriPengeluaran.bulkAdd([
    { nama: 'Kategori Baru' }
  ]);
});
```

### Mengubah Estimasi KM per Hari

Edit `src/components/maintenance/Maintenance.jsx`:

```javascript
const getDaysUntilNext = (item) => {
  const kmRemaining = item.km_berikutnya - item.km_saat_ini;
  const avgKmPerDay = 50; // Ubah sesuai kebutuhan
  return Math.ceil(kmRemaining / avgKmPerDay);
};
```

---

## 🚀 Deployment

### Deploy ke Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```

### Deploy ke Netlify

```bash
# Build
npm run build

# Deploy via Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy ke GitHub Pages

1. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/repository-name/',
  // ...
})
```

2. Deploy:
```bash
npm install --save-dev gh-pages
npm run build
npx gh-pages -d dist
```

### Deploy ke VPS/Shared Hosting

1. Build:
```bash
npm run build
```

2. Upload folder `dist/` ke hosting via FTP/SFTP

3. Konfigurasi web server (Apache/Nginx) untuk SPA

---

## ⚠️ Catatan Penting

### Data Storage
- ✅ Semua data disimpan lokal di browser (IndexedDB)
- ✅ Tidak perlu server atau koneksi internet
- ⚠️ **PENTING**: Jangan clear browser data atau cookies
- 💡 **Backup**: Export data secara berkala

### Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ Internet Explorer (not supported)

### Security
- Data tersimpan lokal (tidak di-upload ke server)
- Tidak ada tracking atau analytics
- Privacy-first approach
- Data hanya bisa diakses di browser yang sama

### Backup Strategy
1. Export data setiap minggu/bulan
2. Simpan file backup di cloud (Google Drive, Dropbox)
3. Test import backup secara berkala
4. Jangan hanya andalkan browser storage

---

## 🐛 Troubleshooting

### Q: Data hilang setelah clear browser
**A:** Data tersimpan di IndexedDB browser. Jika clear browser data/cookies, data akan hilang. Solusi: Export data secara berkala untuk backup.

### Q: Tidak bisa install sebagai PWA
**A:** Pastikan:
- Menggunakan HTTPS (atau localhost)
- Browser support PWA
- Service worker aktif
- Manifest.json valid

### Q: Error saat import Excel
**A:** Pastikan:
- File adalah hasil export dari aplikasi ini
- Format Excel (.xlsx atau .xls)
- File tidak corrupt
- Browser support FileReader API

### Q: Bottom navigation overlap dengan konten
**A:** Sudah diperbaiki di v2.4. Update ke versi terbaru.

### Q: Sidebar collapsed logo hilang
**A:** Sudah diperbaiki di v2.4. Update ke versi terbaru.

---

## 🤝 Contributing

Kontribusi sangat diterima! Jika Anda ingin berkontribusi:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines
- Ikuti struktur folder yang ada
- Gunakan Tailwind untuk styling
- Test di mobile dan desktop
- Update dokumentasi jika perlu

---

## 📝 Changelog

### v2.4.0 (Current) - 3 Feb 2024
- ✨ Fitur import data dari TXT & Excel
- 🐛 Fix logo sidebar collapsed
- 🐛 Fix mobile bottom nav overlap
- 🎨 UI polish semua halaman

### v2.3.0 - 2 Feb 2024
- ✨ Sidebar toggle (tutup/buka)
- ✨ Auto-format KM di perbaikan
- 🎨 Saldo bersih di atas dashboard
- 🔄 Rename "Maintenance" → "Perbaikan"

### v2.2.0 - 2 Feb 2024
- ✨ Fitur Piutang lengkap
- 🎨 Responsive mobile layout
- 🐛 Fix Vercel build error

### v2.1.0 - 2 Feb 2024
- ✨ Auto-format angka dengan titik

### v2.0.0 - 2 Feb 2024
- ✨ Fitur pembayaran hutang
- 📊 Progress bar & histori

### v1.0.0 - 1 Feb 2024
- 🎉 Initial release
- ✨ Basic features

---

## 📄 License

MIT License - feel free to use and modify

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI Framework: [React](https://react.dev/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)
- Database: [Dexie.js](https://dexie.org/)
- Build Tool: [Vite](https://vitejs.dev/)

---

## 📞 Support

Jika ada pertanyaan atau masalah:
- 🐛 Report bug: [GitHub Issues](https://github.com/yourusername/keuangan-app/issues)
- 💬 Discussion: [GitHub Discussions](https://github.com/yourusername/keuangan-app/discussions)
- 📧 Email: your.email@example.com

---

## ⭐ Star History

Jika aplikasi ini membantu, jangan lupa kasih ⭐ di GitHub!

---

**Dibuat dengan ❤️ untuk pengelolaan keuangan pribadi yang lebih baik**

