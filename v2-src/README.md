# Cay's English V2 — kode sumber

PWA belajar grammar bahasa Inggris yang mengikuti urutan 145 unit *English Grammar in Use* edisi kelima
(Raymond Murphy, Cambridge University Press, 2019). Semua penjelasan, contoh, dan soal ditulis ulang;
tidak ada teks, gambar, atau kunci jawaban buku di repositori ini.

Hasil build ada di `../v2/` dan tayang di `https://achmadcahyaperwira.github.io/grammarku/v2/`.

## Isi saat ini (Tahap 1)

- Unit 1–18 (Present and past, Present perfect and past), masing-masing 20 soal: 360 soal.
- Unit 19–145 tampil di daftar dengan label "Segera".
- Fitur: daftar unit dengan pencarian dan filter, halaman materi, 4 jenis latihan dengan umpan balik,
  progres dan streak harian, bank kesalahan (Leitner 1/3/7/14/30 hari), offline, mode gelap, ekspor/impor cadangan.

## Perintah

```
npm install
npm run build        # validasi konten -> paket konten -> cek tipe -> build ke ../v2
npm test             # tes logika (penilaian, Leitner, streak, penyimpanan, cadangan)
node tests/e2e.cjs <url>/grammarku/v2/ <folder>   # uji alur di Chromium (butuh Playwright)
node tests/all-keys.cjs <url>/grammarku/v2/       # kerjakan semua soal dengan kuncinya lewat UI
python3 scripts/check-similarity.py /path/book.txt  # kemiripan dengan teks buku (file lokal, jangan di-commit)
```

## Menambah unit

1. Tulis unit di `scripts/authoring/` (format ringkas lewat `lib.py`), lalu jalankan file Python-nya.
   Hasilnya `content/units/uNNN.json`.
2. `npm run build`. Validator menolak ID ganda, kunci yang tidak cocok, kurang dari 16 soal, dan sebagainya.
3. Jalankan pemeriksa kemiripan, minta pemeriksaan kedua kunci jawaban, lalu uji di HP.
4. Unit otomatis berstatus dirilis begitu file-nya ada. Commit `v2-src/` dan `v2/`.

ID soal bersifat permanen. Kalau makna soal berubah, beri ID baru supaya bank kesalahan tidak menunjuk soal yang salah.

## Catatan teknis

- Data progres ada di IndexedDB `cays-english-v2` (asal yang sama dengan aplikasi lama, tetapi terpisah).
- `../sw.js` (aplikasi lama) sudah diberi pengecualian supaya tidak melayani `/v2/`.
