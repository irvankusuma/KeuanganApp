# 🚀 Panduan Deployment KeuanganApp

## 📋 Persiapan

### 1. Install Node.js
- Download dan install Node.js dari https://nodejs.org/
- Versi minimum: Node.js 16+
- Cek instalasi: `node --version` dan `npm --version`

### 2. Clone/Download Project
```bash
# Jika menggunakan git
git clone <repository-url>

# Atau extract file ZIP yang sudah di-download
```

### 3. Install Dependencies
```bash
cd keuangan-app
npm install
```

## 🔧 Development (Local)

### Jalankan Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 🏗️ Build Production

### Build Aplikasi
```bash
npm run build
```

File hasil build akan ada di folder `dist/`

### Preview Build
```bash
npm run preview
```

## 🌐 Deployment Options

### Option 1: Vercel (Gratis & Mudah) ⭐ RECOMMENDED

1. **Daftar/Login ke Vercel**
   - Kunjungi https://vercel.com
   - Login dengan GitHub, GitLab, atau Bitbucket

2. **Deploy via Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

3. **Deploy via Vercel Dashboard**
   - Klik "New Project"
   - Import repository atau upload folder
   - Vercel akan auto-detect Vite dan deploy

**Keuntungan:**
- ✅ Gratis
- ✅ Auto HTTPS
- ✅ Global CDN
- ✅ Auto deploy on push (jika pakai Git)

---

### Option 2: Netlify (Gratis)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Via Dashboard**
   - Drag & drop folder `dist/` ke https://app.netlify.com/drop

---

### Option 3: GitHub Pages (Gratis)

1. **Update `vite.config.js`**
   ```js
   export default defineConfig({
     base: '/repository-name/', // Ganti dengan nama repo
     // ... config lainnya
   })
   ```

2. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Tambah script di `package.json`**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Setting GitHub Pages**
   - Repo → Settings → Pages
   - Source: gh-pages branch

---

### Option 4: Firebase Hosting (Gratis)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login & Init**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Konfigurasi**
   - Public directory: `dist`
   - Single-page app: Yes
   - GitHub auto deploy: Terserah

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

---

### Option 5: VPS / Shared Hosting

1. **Build aplikasi**
   ```bash
   npm run build
   ```

2. **Upload folder `dist/` ke hosting**
   - Via FTP/SFTP
   - Atau cPanel File Manager

3. **Atur Web Server**

   **Apache (.htaccess):**
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

   **Nginx:**
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

---

## 🎯 Optimisasi Production

### 1. Compress Assets
Tambah plugin di `vite.config.js`:
```bash
npm install vite-plugin-compression -D
```

```js
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    // ... plugins lain
    viteCompression()
  ]
})
```

### 2. Analyze Bundle Size
```bash
npm run build -- --mode analyze
```

### 3. PWA Icons
Buat icon dengan ukuran:
- 192x192px → `public/pwa-192x192.png`
- 512x512px → `public/pwa-512x512.png`

Tools: https://realfavicongenerator.net/

---

## 🔒 Environment Variables

Jika perlu config berbeda per environment:

1. **Buat file `.env`**
   ```
   VITE_APP_NAME=KeuanganApp
   VITE_API_URL=https://api.example.com
   ```

2. **Akses di kode**
   ```js
   const appName = import.meta.env.VITE_APP_NAME
   ```

3. **Per Environment**
   - `.env.development` - untuk dev
   - `.env.production` - untuk production

---

## ✅ Checklist Deployment

- [ ] Test aplikasi di localhost
- [ ] Build berhasil tanpa error
- [ ] PWA manifest valid
- [ ] Service worker aktif
- [ ] Icons tersedia (192x192, 512x512)
- [ ] Test offline mode
- [ ] Test responsive di mobile
- [ ] Test di berbagai browser

---

## 🆘 Troubleshooting

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build gagal
```bash
npm cache clean --force
npm install
npm run build
```

### PWA tidak install
- Pastikan di-akses via HTTPS (atau localhost)
- Cek manifest.json valid
- Clear browser cache

### Data hilang setelah clear browser
- Backup data via export secara berkala
- Data tersimpan di IndexedDB browser

---

## 📞 Support

Jika ada masalah, cek:
1. Console browser (F12)
2. Build logs
3. Network tab untuk error

---

**Happy Deploying! 🚀**
