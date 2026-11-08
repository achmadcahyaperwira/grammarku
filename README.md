# Cay's English

> **Versi baru: Cay's English V2** ada di folder `v2/` dan tayang di
> `https://achmadcahyaperwira.github.io/grammarku/v2/`. Kode sumbernya di `v2-src/`
> (lihat `v2-src/README.md`). Aplikasi lama di bawah ini tetap berjalan seperti biasa.

Aplikasi pribadi untuk belajar grammar bahasa Inggris unit demi unit, mengikuti kurikulum buku
*English Grammar in Use*, Fifth Edition (Raymond Murphy, Cambridge University Press, 2019).
Penjelasan dan soal ditulis ulang dengan kata-kata sendiri. Aplikasi ini tidak memuat teks, gambar,
atau kunci jawaban buku.

- Mobile-first, untuk Google Chrome di Android.
- Tanpa login, tanpa server. Progres tersimpan di HP (localStorage).
- Bisa dipasang ke layar utama dan berjalan offline (PWA dengan service worker).
- Versi materi saat ini: Unit 1-18 dari 145 unit.

## Cara memasang di HP (GitHub Pages)

1. Di repo ini, buka **Settings**, lalu **Pages**.
2. Di bagian "Build and deployment", pilih **Source: Deploy from a branch**, branch **main**, folder **/(root)**, lalu **Save**.
3. Tunggu 1-3 menit, lalu buka `https://achmadcahyaperwira.github.io/grammarku/` di Chrome HP.
4. Ketuk menu titik tiga, lalu **Instal aplikasi** atau **Tambahkan ke layar utama**.
5. Buka aplikasi sekali saat online. Di **Pengaturan**, tunggu sampai muncul "Siap dipakai offline".
6. Coba mode pesawat: aplikasi tetap bisa dibuka.

Suara tombol dengar memakai suara bawaan HP. Agar berfungsi offline, unduh paket suara bahasa Inggris
di Setelan Android, bagian Text-to-speech (letak menunya berbeda di tiap merek HP).

**Penting:** progres hilang jika data Chrome dihapus atau aplikasi di-uninstall. Simpan cadangan sesekali
lewat **Pengaturan, Cadangan progres, Ekspor**. Filenya bisa dipulihkan dengan **Impor**.

## Struktur

```
index.html, style.css, app.js     tampilan dan logika aplikasi
grading.js                        penilaian jawaban (dipakai aplikasi dan pemeriksa)
sw.js, manifest.webmanifest       offline dan pemasangan
icons/                            ikon aplikasi
content/index.json                daftar 16 jalur dan 145 unit (available = sudah ada materinya)
content/placement.json            20 soal tes penempatan
content/units/unit-NNN.json       materi satu unit: kartu penjelasan dan 10 soal
tools/validate.js                 pemeriksa materi (node tools/validate.js)
tools/e2e.js                      uji alur di Chromium dengan emulasi HP (butuh Playwright)
```

## Menambah unit

1. Tambahkan `content/units/unit-NNN.json` (format sama dengan unit yang ada).
2. Di `content/index.json`, ubah unit itu menjadi `"available": true` dan isi `"file"`.
3. Naikkan `CACHE_VERSION` di `sw.js` agar HP mengambil versi baru.
4. Jalankan `node tools/validate.js` sampai "SEMUA LOLOS".

Progres pengguna tidak terpengaruh oleh pembaruan materi.

## Jenis soal dan penilaian

Pilihan ganda, isi bagian kosong, susun kalimat, perbaiki kalimat, ubah bentuk kata kerja, jodohkan,
dan terjemahan Indonesia ke Inggris. Penilaian mengabaikan huruf besar/kecil, spasi berlebih, dan tanda
baca, menyamakan bentuk singkat dan panjang (isn't = is not, I've = I have), dan menerima daftar varian
sah per soal. Salah ketik tidak ditoleransi karena ejaan termasuk materi grammar.

`tools/authoring/` berisi skrip Python yang dipakai untuk menulis materi (`python3 tools/authoring/build.py content`
lalu `python3 tools/authoring/index_gen.py content <versi>`). File JSON di `content/` adalah sumber yang dipakai aplikasi.
