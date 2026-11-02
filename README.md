# Pelayaran Juz Amma

Prototipe game web untuk anak: **hafal Juz Amma sambil paham artinya**.
Anak berlayar bersama Pipo si penyu 🐢 dari pulau ke pulau. Setiap pulau = satu surat,
dan nama pulaunya diambil dari isi surat itu (mis. *Bukit Fajar* untuk Al-Falaq).

## Alur per surat
1. **Kisah Pulau** – 3 slide pengantar makna surat.
2. **Kenali Kata** – ketuk tiap kata Arab untuk melihat arti + mendengar audionya;
   ayat berikutnya terbuka setelah semua kata dikenal.
3. **Pahami Arti** – dengar ayat, pilih terjemahan yang benar.
4. **Susun Ayat** – susun potongan kata menjadi ayat yang utuh (uji hafalan urutan).
5. **Hasil** – 1–3 bintang (berdasarkan jumlah kesalahan) + hadiah *Harta Laut* untuk koleksi.

Pulau berikutnya terbuka setelah pulau sebelumnya selesai. Progres disimpan di browser (localStorage).

## Isi saat ini
An-Nas, Al-Falaq, Al-Ikhlas, Al-Kautsar, Al-'Asr. Tambah surat di `js/data.js`.

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
