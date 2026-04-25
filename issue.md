# Daftar Tugas Perbaikan Repositori LeMon (TipFy)

Dokumen ini berisi daftar masalah yang ditemukan dalam basis kode beserta panduan langkah demi langkah untuk memperbaikinya. Instruksi ini dirancang agar mudah diikuti oleh Junior Programmer atau AI Assistant.

---

## 🛑 Prioritas Tinggi: Keamanan & Stabilitas Backend

### 1. Memperbaiki "Error Swallowing" pada Autentikasi
**Masalah**: Di `web/src/lib/db-actions.server.ts`, fungsi `checkProfileExistence` menangkap semua error dengan `catch (e)` dan mengembalikan nilai *false* tanpa mencatat log. Ini menyulitkan *debugging* jika database mati.
**Langkah-langkah perbaikan**:
1. Buka file `web/src/lib/db-actions.server.ts`.
2. Cari fungsi `checkProfileExistence()`.
3. Di dalam blok `catch (e) {`, tambahkan baris ini sebelum me-return nilai:
   ```typescript
   console.error('[DB Error] checkProfileExistence failed:', e);
   ```

### 2. Mengatasi Celah Kesalahan Tipe Data pada Leaderboard
**Masalah**: Fungsi `getLeaderboardData` melakukan *casting* nilai teks menjadi angka di SQL: `cast(${donation.amount} as numeric)`. Jika ada nilai non-angka, server akan *crash*.
**Langkah-langkah perbaikan**:
1. Karena `amount` dikirim dari smart contract (EVM), pastikan semua input `amount` divalidasi sebelum disimpan ke DB (hanya boleh berisi angka).
2. Tambahkan pengecekan Zod pada Server Function yang menyimpan donasi untuk memastikan regex angka (`/^\d+(\.\d+)?$/`).
3. (Opsional namun disarankan) Pertimbangkan untuk mengubah tipe kolom `amount` di `schema.ts` dari `varchar` menjadi `numeric` di masa mendatang, lalu lakukan migrasi database.

### 3. Mengganti Parsing Tanggal Manual dengan Zod/Date-fns
**Masalah**: Fungsi `saveVoting` di `db-actions.server.ts` mem-parsing string waktu secara manual menggunakan `new Date(\`\${dateStr}T\${timeStr}\`)` yang rawan error zona waktu.
**Langkah-langkah perbaikan**:
1. Jangan lakukan parsing manual. Mintalah frontend (komponen form) untuk mengirimkan format ISO 8601 string secara langsung (misal: `2026-04-26T00:00:00.000Z`).
2. Di `web/src/lib/overlay-utils.ts`, ubah `.inputValidator()` untuk `saveVotingServerFn` agar menerima tipe `Date` atau string ISO.
3. Hapus fungsi `parseDate` di dalam `saveVoting` (`db-actions.server.ts`) dan gunakan tanggal yang dikirim dari klien.

---

## 🟡 Prioritas Menengah: Kebersihan Kode & TypeScript

### 4. Membersihkan Variabel dan Import yang Tidak Terpakai
**Masalah**: Ada beberapa variabel yang dideklarasikan namun tidak dipanggil, sehingga membuat peringatan di *compiler*.
**Langkah-langkah perbaikan**:
1. Buka `web/src/components/dashboard/system-bridge/OverlayEditor.tsx`.
   - Hapus variabel `UploadCloud` dari daftar import `lucide-react`.
   - Hapus baris state `const [uploading, setUploading] = useState(false)`.
2. Buka `web/src/integrations/wagmi/root-provider.tsx`.
   - Hapus `mainnet` dari daftar import `wagmi/chains`.
3. Buka `web/src/routes/api/auth/ably-token.ts`.
   - Ubah `GET: async ({ request }) => {` menjadi `GET: async () => {` (hapus `request`).

### 5. Memperbaiki "Unnecessary Type Assertions" (Casting Tidak Perlu)
**Masalah**: Terdapat 75 error ESLint karena penulisan `as any` pada variabel yang tipenya sudah jelas.
**Langkah-langkah perbaikan**:
1. Jalankan perintah `npx eslint --fix` di folder `web/`. Ini akan memperbaiki sebagian besar masalah secara otomatis.
2. Sisa error harus dicek manual: cari `as any` di file seperti `u.$username.tsx` atau utilitas DB, dan hapus jika TypeScript tidak memberikan garis bawah merah setelahnya.

---

## 🔵 Prioritas Rendah: Infrastruktur & UX

### 6. Menyesuaikan Region Vercel
**Masalah**: `vercel.json` menggunakan `sin1` (Singapura). Jika database Neon tidak ada di Singapura, akses akan sangat lambat.
**Langkah-langkah perbaikan**:
1. Cek *dashboard* Neon Database untuk melihat di region mana database diletakkan (misal: `aws-us-east-1`).
2. Buka `web/vercel.json`.
3. Ubah array `["sin1"]` menjadi region Vercel yang paling dekat dengan DB Anda (misal: `["iad1"]` untuk Washington D.C / US East).

### 7. Menutup Celah Host Server Lokal
**Masalah**: `vite.config.ts` mengizinkan semua host mengakses *dev server*.
**Langkah-langkah perbaikan**:
1. Buka `web/vite.config.ts`.
2. Hapus baris `allowedHosts: true,` di dalam properti `server: {}`.

### 8. Menambahkan Paginasi (Mencegah Memori Penuh)
**Masalah**: `getDonations` mengambil semua data sekaligus.
**Langkah-langkah perbaikan**:
1. Ubah fungsi `getDonations()` di `db-actions.server.ts` agar menerima parameter `limit` dan `offset`.
2. Terapkan klausa `.limit(limit).offset(offset)` pada query Drizzle.
3. Update komponen frontend untuk menampilkan tombol "Load More" atau *Infinite Scroll*.

---
**Catatan untuk AI/Programmer**: Kerjakan perbaikan ini dari Prioritas Tinggi (1-3) terlebih dahulu. Selalu jalankan `npm run build` atau `npx tsc --noEmit` setelah setiap perubahan untuk memastikan tidak ada fitur yang rusak.
