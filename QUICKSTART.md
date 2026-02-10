# 🚀 Quick Start - KeuanganApp

## Cara Tercepat Menjalankan Aplikasi

### 1. Pastikan Node.js Terinstall
```bash
node --version
# Harus versi 16 atau lebih baru
```

Jika belum install, download dari: https://nodejs.org/

### 2. Extract & Install
```bash
# Extract file zip (jika ada)
# Masuk ke folder project
cd keuangan-app

# Install dependencies (tunggu 1-3 menit)
npm install
```

### 3. Jalankan Aplikasi
```bash
npm run dev
```

### 4. Buka Browser
- Otomatis terbuka, atau
- Manual: http://localhost:5173

## 🎉 Selesai!

Aplikasi sudah berjalan di komputer Anda.

## 📱 Install ke HP Android

### Cara 1: Deployment Online (Recommended)
1. Deploy dulu ke Vercel (gratis): https://vercel.com
2. Buka link dari HP
3. Chrome → Menu (3 titik) → "Add to Home Screen"

### Cara 2: Akses dari HP (dalam jaringan yang sama)
1. Di komputer, jalankan: `npm run dev -- --host`
2. Lihat IP address yang muncul (contoh: http://192.168.1.5:5173)
3. Buka IP itu di browser HP
4. Chrome → Menu → "Add to Home Screen"

## 🛠️ Development Flow

```
Koding → npm run dev → Test → Build → Deploy
```

## 📚 File Penting

- `src/` - Semua kode aplikasi
- `public/` - File statis & icons
- `package.json` - Dependencies
- `README.md` - Dokumentasi lengkap
- `DEPLOYMENT.md` - Panduan deploy

## ⚡ Tips

1. **Auto Reload**: Setiap perubahan kode langsung terlihat di browser
2. **Dark Mode**: Sudah aktif by default
3. **Offline**: Setelah di-build, aplikasi bisa jalan offline
4. **Export Data**: Jangan lupa backup berkala

## 🐛 Masalah?

### Port sudah digunakan?
```bash
npm run dev -- --port 3000
```

### Error saat install?
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Build error?
```bash
npm run build
# Lihat error di terminal
```

## 📞 Need Help?

Cek console browser (F12) untuk melihat error detail.

---

**Selamat mencoba! 🎯**
