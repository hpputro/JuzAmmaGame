# Pelayaran Juz Amma

Prototipe game web untuk anak: **hafal Juz Amma sambil paham artinya**.
Anak berlayar bersama Pipo si penyu 🐢 dari pulau ke pulau. Setiap pulau = satu surat,
dan nama pulaunya diambil dari isi surat itu (mis. *Bukit Fajar* untuk Al-Falaq).

## Menu utama
- **⛵ Mulai Berlayar** – jelajahi pulau satu per satu; tiap pulau berisi 9 tahap berurutan
  dan pulau berikutnya terbuka setelah pulau sebelumnya selesai.
- **🧭 Pelayaran Mandiri** – semua surat dan semua aktivitas terbuka tanpa prasyarat.
  Pilih surat, lalu pilih aktivitas mana saja. Hasil di mode ini tidak mengubah bintang,
  pulau yang terbuka, atau koleksi.
- **🧺 Harta Laut** – koleksi oleh-oleh dari pulau yang sudah diselesaikan.

## Alur per surat
1. **Pengantar** – 3 slide kisah singkat tentang pesan surat.
2. **Dengarkan Utuh** – surat diputar otomatis ayat demi ayat, menampilkan tulisan Arab,
   transliterasi, dan arti. Bisa diatur: paket ayat (dari–sampai), berapa kali tiap ayat
   diulang, dan berapa kali satu paket diulang. Ada tombol jeda/lanjutkan.
3. **Kenali Kata** – ketuk tiap kata Arab untuk melihat arti, transliterasi, dan mendengar
   audionya; ayat berikutnya terbuka setelah semua kata dikenal.
4. **Harta Terpendam** – pesan/simpulan surat, nasihat untuk anak, dan "Tahukah Kamu?".
5. **Kuis Lanjut Ayat** – dengar sebuah ayat (ada audio), pilih ayat sesudahnya.
6. **Kuis Kata yang Hilang** – satu kata dikosongkan pada tulisan Arab dan transliterasi,
   arti ayat ditampilkan; pilih kata yang tepat.
7. **Kuis Susun Ayat** – susun potongan kata menjadi ayat yang utuh.
8. **Kuis Pahami Arti** – dengar ayat, pilih terjemahan yang benar.
9. **Hasil** – 1–3 bintang + hadiah *Harta Laut* untuk koleksi.

Jumlah soal kuis (separuh = dibulatkan ke atas):

| Kuis | Mulai Berlayar | Pelayaran Mandiri |
|---|---|---|
| Lanjut Ayat | separuh jumlah ayat, min 2, maks 10 | separuh jumlah ayat, min 2 |
| Kata yang Hilang | separuh jumlah ayat, min 2, maks 10 | jumlah ayat |
| Susun Ayat | separuh jumlah ayat, min 2, maks 10 | jumlah ayat |
| Pahami Arti | separuh jumlah ayat, min 2, maks 10 | separuh jumlah ayat, min 2, maks 10 |

Ayat yang tidak bisa dijadikan soal (mis. ayat satu kata untuk Susun Ayat) dilewati,
sehingga jumlah soal bisa sedikit lebih kecil.
Bintang dihitung dari rata-rata kesalahan per soal: ≤ 0,2 → 3 bintang, ≤ 0,6 → 2 bintang, selebihnya 1.

Pulau berikutnya terbuka setelah pulau sebelumnya selesai. Progres dan pengaturan
pengulangan disimpan di browser (localStorage).

## Isi saat ini
An-Nas, Al-Falaq, Al-Ikhlas, Al-Kautsar, Al-'Asr, Al-Muthaffifin. Tambah surat di `js/data.js`.

## Menjalankan
Buka `index.html` di browser, atau jalankan server statis:

```bash
python3 -m http.server 8000
```

lalu buka http://localhost:8000. Bisa juga di-host gratis lewat GitHub Pages.

Audio ayat (Mishary Alafasy, everyayah.com) dan audio per kata (quran.com) diambil
dari internet; tanpa koneksi, game tetap bisa dimainkan tanpa suara.

## Catatan konten
Teks Arab dan arti per kata ditulis untuk prototipe. **Sebelum dipakai luas, minta
ustadz/guru Al-Qur'an memeriksa** teks, arti per kata, terjemahan, dan cerita.

## Main online (GitHub Pages)
Alamat: https://hpputro.github.io/JuzAmmaGame/

Pengaturan (sekali saja): **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
pilih branch utama repo dan folder `/ (root)`, lalu **Save**.
