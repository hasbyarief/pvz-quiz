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

## GitHub Pages deployment fix

- Updated `esbuild` to `^0.28.2` to satisfy Vite 8's optional peer dependency (`^0.27.0 || ^0.28.0`).
- Configured Vite `base: '/pvz-quiz/'` for a GitHub Pages project site using the `pvz-quiz` repository.
- The GitHub Actions workflow should use `npm install` (not `npm ci`) until a package lock file is committed.


## Gameplay update — 30 October 2026

- Victory now requires 25 **correct** quiz answers, not merely 25 submitted answers.
- Incorrect answers still consume that quiz sun, but do not advance the correct-answer counter.
- The in-game target counter now displays correct answers out of 25.
- Quiz suns continue to appear until 25 correct answers are reached.
- Zombie sub-wave schedules have been spaced farther apart to give players more preparation time.
- The wave timer resets between waves so the next wave's scheduled groups do not all spawn immediately.
- Vite is configured for the `/pvz-quiz/` GitHub Pages project path.
