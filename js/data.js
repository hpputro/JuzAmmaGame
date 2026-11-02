// Data surat Juz Amma (prototipe: 5 surat pendek).
// Teks Arab: rasm Utsmani. Terjemahan mengacu pada Terjemahan Kemenag RI.
// Setiap kata = [teks Arab, arti]. Urutan kata mengikuti pemenggalan kata
// standar (dipakai juga untuk audio kata-per-kata dari quran.com).
//
// PENTING: sebelum rilis, minta ustadz/guru Al-Qur'an memeriksa ulang
// teks Arab, arti per kata, dan cerita.

const SURAHS = [
  {
    id: 114,
    name: "An-Nas",
    meaning: "Manusia",
    place: "Menara Penjaga",
    emoji: "🗼",
    reward: { emoji: "🐚", name: "Kerang Penjaga", desc: "Kerang yang selalu menutup rapat saat ombak datang. Seperti kita yang berlindung kepada Allah." },
    story: [
      { art: "🌫️", text: "Kadang ada bisikan kecil di hati yang mengajak berbuat buruk." },
      { art: "👑", text: "Allah adalah Tuhan, Raja, dan sembahan seluruh manusia." },
      { art: "🛡️", text: "Yuk, minta perlindungan kepada Allah dengan membaca surat An-Nas!" }
    ],
    ayahs: [
      { words: [["قُلْ", "Katakanlah"], ["أَعُوذُ", "aku berlindung"], ["بِرَبِّ", "kepada Tuhan"], ["ٱلنَّاسِ", "manusia"]],
        tr: "Katakanlah, “Aku berlindung kepada Tuhannya manusia," },
      { words: [["مَلِكِ", "Raja"], ["ٱلنَّاسِ", "manusia"]],
        tr: "Raja manusia," },
      { words: [["إِلَٰهِ", "Sembahan"], ["ٱلنَّاسِ", "manusia"]],
        tr: "sembahan manusia," },
      { words: [["مِن", "dari"], ["شَرِّ", "kejahatan"], ["ٱلْوَسْوَاسِ", "(bisikan) setan"], ["ٱلْخَنَّاسِ", "yang bersembunyi"]],
        tr: "dari kejahatan (bisikan) setan yang bersembunyi," },
      { words: [["ٱلَّذِى", "yang"], ["يُوَسْوِسُ", "membisikkan"], ["فِى", "ke dalam"], ["صُدُورِ", "dada"], ["ٱلنَّاسِ", "manusia"]],
        tr: "yang membisikkan (kejahatan) ke dalam dada manusia," },
      { words: [["مِنَ", "dari"], ["ٱلْجِنَّةِ", "jin"], ["وَٱلنَّاسِ", "dan manusia"]],
        tr: "dari (golongan) jin dan manusia.”" }
    ]
  },
  {
    id: 113,
    name: "Al-Falaq",
    meaning: "Waktu Subuh",
    place: "Bukit Fajar",
    emoji: "🌅",
    reward: { emoji: "🪸", name: "Karang Fajar", desc: "Karang jingga yang berkilau setiap kali matahari terbit." },
    story: [
      { art: "🌄", text: "Setiap pagi, Allah mengganti gelapnya malam dengan cahaya fajar." },
      { art: "🌑", text: "Di dunia ada banyak hal yang bisa menakutkan, seperti gelapnya malam dan orang yang iri." },
      { art: "🤲", text: "Surat Al-Falaq mengajari kita berlindung kepada Allah dari semua itu." }
    ],
    ayahs: [
      { words: [["قُلْ", "Katakanlah"], ["أَعُوذُ", "aku berlindung"], ["بِرَبِّ", "kepada Tuhan"], ["ٱلْفَلَقِ", "(yang menguasai) subuh"]],
        tr: "Katakanlah, “Aku berlindung kepada Tuhan yang menguasai subuh (fajar)," },
      { words: [["مِن", "dari"], ["شَرِّ", "kejahatan"], ["مَا", "(makhluk) yang"], ["خَلَقَ", "Dia ciptakan"]],
        tr: "dari kejahatan (makhluk yang) Dia ciptakan," },
      { words: [["وَمِن", "dan dari"], ["شَرِّ", "kejahatan"], ["غَاسِقٍ", "malam"], ["إِذَا", "apabila"], ["وَقَبَ", "telah gelap gulita"]],
        tr: "dan dari kejahatan malam apabila telah gelap gulita," },
      { words: [["وَمِن", "dan dari"], ["شَرِّ", "kejahatan"], ["ٱلنَّفَّٰثَٰتِ", "(penyihir) yang meniup"], ["فِى", "pada"], ["ٱلْعُقَدِ", "buhul-buhul (tali)"]],
        tr: "dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya)," },
      { words: [["وَمِن", "dan dari"], ["شَرِّ", "kejahatan"], ["حَاسِدٍ", "orang yang dengki"], ["إِذَا", "apabila"], ["حَسَدَ", "ia dengki"]],
        tr: "dan dari kejahatan orang yang dengki apabila dia dengki.”" }
    ]
  },
  {
    id: 112,
    name: "Al-Ikhlas",
    meaning: "Memurnikan Keesaan",
    place: "Puncak Satu Bintang",
    emoji: "⭐",
    reward: { emoji: "⭐", name: "Bintang Laut Tunggal", desc: "Bintang laut yang hanya ada satu di seluruh pantai. Ingat, Allah Maha Esa!" },
    story: [
      { art: "🌌", text: "Lihat langit malam! Siapa yang menciptakan semua bintang itu?" },
      { art: "☝️", text: "Allah. Hanya satu, tidak ada yang menyamai-Nya." },
      { art: "💛", text: "Surat Al-Ikhlas mengenalkan kita kepada Allah Yang Maha Esa." }
    ],
    ayahs: [
      { words: [["قُلْ", "Katakanlah"], ["هُوَ", "Dialah"], ["ٱللَّهُ", "Allah"], ["أَحَدٌ", "Yang Maha Esa"]],
        tr: "Katakanlah (Muhammad), “Dialah Allah, Yang Maha Esa." },
      { words: [["ٱللَّهُ", "Allah"], ["ٱلصَّمَدُ", "tempat meminta segala sesuatu"]],
        tr: "Allah tempat meminta segala sesuatu." },
      { words: [["لَمْ", "tidak"], ["يَلِدْ", "Dia beranak"], ["وَلَمْ", "dan tidak"], ["يُولَدْ", "Dia diperanakkan"]],
        tr: "(Allah) tidak beranak dan tidak pula diperanakkan." },
      { words: [["وَلَمْ", "dan tidak"], ["يَكُن", "ada"], ["لَّهُۥ", "bagi-Nya"], ["كُفُوًا", "yang setara"], ["أَحَدٌۢ", "seorang pun"]],
        tr: "Dan tidak ada sesuatu yang setara dengan Dia.”" }
    ]
  },
  {
    id: 108,
    name: "Al-Kautsar",
    meaning: "Nikmat yang Banyak",
    place: "Telaga Nikmat",
    emoji: "💧",
    reward: { emoji: "🫧", name: "Gelembung Syukur", desc: "Gelembung yang muncul setiap kali kita bilang Alhamdulillah." },
    story: [
      { art: "🎁", text: "Allah memberi kita nikmat yang sangat banyak, sampai tidak bisa dihitung." },
      { art: "🕌", text: "Cara berterima kasih kepada Allah: salat dan berkurban." },
      { art: "😊", text: "Yuk, belajar surat Al-Kautsar, surat terpendek dalam Al-Qur'an!" }
    ],
    ayahs: [
      { words: [["إِنَّآ", "Sesungguhnya Kami"], ["أَعْطَيْنَٰكَ", "telah memberimu"], ["ٱلْكَوْثَرَ", "nikmat yang banyak"]],
        tr: "Sungguh, Kami telah memberimu (Muhammad) nikmat yang banyak." },
      { words: [["فَصَلِّ", "maka salatlah"], ["لِرَبِّكَ", "karena Tuhanmu"], ["وَٱنْحَرْ", "dan berkurbanlah"]],
        tr: "Maka laksanakanlah salat karena Tuhanmu, dan berkurbanlah." },
      { words: [["إِنَّ", "sesungguhnya"], ["شَانِئَكَ", "orang yang membencimu"], ["هُوَ", "dialah"], ["ٱلْأَبْتَرُ", "yang terputus"]],
        tr: "Sungguh, orang-orang yang membencimu dialah yang terputus (dari rahmat Allah)." }
    ]
  },
  {
    id: 103,
    name: "Al-'Asr",
    meaning: "Masa",
    place: "Menara Jam Pasir",
    emoji: "⏳",
    reward: { emoji: "⌛", name: "Jam Pasir Mungil", desc: "Pasirnya terus turun. Waktu itu berharga, gunakan untuk kebaikan!" },
    story: [
      { art: "⏰", text: "Waktu terus berjalan dan tidak bisa diulang." },
      { art: "🤝", text: "Orang yang beruntung adalah yang beriman, berbuat baik, dan saling menasihati." },
      { art: "🌱", text: "Surat Al-'Asr mengajak kita memakai waktu untuk kebaikan." }
    ],
    ayahs: [
      { words: [["وَٱلْعَصْرِ", "Demi masa"]],
        tr: "Demi masa," },
      { words: [["إِنَّ", "sesungguhnya"], ["ٱلْإِنسَٰنَ", "manusia"], ["لَفِى", "benar-benar dalam"], ["خُسْرٍ", "kerugian"]],
        tr: "sungguh, manusia berada dalam kerugian," },
      { words: [["إِلَّا", "kecuali"], ["ٱلَّذِينَ", "orang-orang yang"], ["ءَامَنُوا۟", "beriman"], ["وَعَمِلُوا۟", "dan mengerjakan"], ["ٱلصَّٰلِحَٰتِ", "kebajikan"], ["وَتَوَاصَوْا۟", "dan saling menasihati"], ["بِٱلْحَقِّ", "untuk kebenaran"], ["وَتَوَاصَوْا۟", "dan saling menasihati"], ["بِٱلصَّبْرِ", "untuk kesabaran"]],
        tr: "kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran." }
    ]
  }
];
