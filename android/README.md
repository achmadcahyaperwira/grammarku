# Cay's English V2 untuk Android

Pembungkus WebView untuk aplikasi di `../v2/`. Semua file web disalin ke `app/src/main/assets/www/` saat build
dan dilayani lewat `WebViewAssetLoader` (`https://appassets.androidplatform.net/assets/www/`), jadi aplikasi
berjalan sepenuhnya offline. Progres tersimpan di IndexedDB milik aplikasi.

- Build otomatis: GitHub Actions (`.github/workflows/android.yml`) setiap kali `v2/` atau `android/` berubah.
- Unduhan terbaru: https://github.com/achmadcahyaperwira/grammarku/releases/download/android-latest/CaysEnglishV2.apk
- `versionCode` = nomor build Actions, jadi APK baru bisa dipasang di atas yang lama.
- Kunci tanda tangan `app/cays-v2.keystore` sengaja disimpan di repo agar setiap build bertanda tangan sama.
  Karena repo publik, pasang APK hanya dari tautan Releases di atas.
- Jembatan JavaScript `window.AndroidBridge.saveBackup(nama, isi)` membuka pemilih lokasi simpan Android untuk ekspor
  cadangan. Impor memakai `<input type=file>` yang ditangani `onShowFileChooser`.
