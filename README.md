<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ee48d404-d5cc-4319-b200-b2c71b082e19

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Audit & fixes (30 Oktober 2026)

Perbaikan perilaku yang diterapkan:
- Restart sekarang selalu menghapus status pause, sehingga permainan tidak masuk ke kondisi restart tetapi tetap membeku.
- Matahari kuis hanya dapat digunakan untuk satu jawaban. Jawaban salah mengonsumsi matahari kuis tanpa hadiah; pemain tidak dapat mengulang soal yang sama untuk mengejar kuota 25 soal.
- Interaksi mengambil matahari dan menanam/menggali tanaman diblokir ketika permainan belum berjalan, sedang pause, atau modal kuis sedang terbuka.

Catatan verifikasi:
- Jalankan `npm install`, lalu `npm run lint` dan `npm run build` pada Node.js yang kompatibel dengan Vite 8.
- Pemeriksaan build otomatis pada lingkungan audit ini tidak dapat diselesaikan karena proses pemasangan dependensi melewati batas waktu. Karena itu, perubahan di atas merupakan perbaikan kode terarah, bukan klaim bahwa build telah berhasil diverifikasi.

- Semua matahari alami yang jatuh dari langit sekarang menjadi matahari kuis (bukan lagi acak 50:50). Setelah target 25 soal tercapai, matahari langit kembali menjadi matahari biasa agar target kuis tetap 25.
