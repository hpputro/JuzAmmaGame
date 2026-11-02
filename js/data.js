// Data surat Juz Amma (prototipe: 5 surat pendek).
//
// Setiap kata = [teks Arab, arti, transliterasi].
// Transliterasi ditulis per potongan sesuai bacaan bersambung, lalu dirangkai
// menjadi transliterasi ayat (mis. "birabbin" + "nās").
// Urutan kata mengikuti pemenggalan kata standar mushaf (dipakai juga untuk
// audio kata-per-kata dari quran.com).
// Terjemahan ayat mengacu pada Terjemahan Kemenag RI.
//
// PENTING: sebelum rilis, minta ustadz/guru Al-Qur'an memeriksa ulang
// teks Arab, arti per kata, transliterasi, cerita, dan Harta Terpendam.

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
    treasure: {
      message: "Allah adalah Tuhan yang memelihara kita, Raja yang menguasai kita, dan satu-satunya yang kita sembah. Hanya kepada-Nya kita minta perlindungan dari bisikan buruk, baik yang datang dari setan jin maupun manusia.",
      advice: [
        "Kalau hatimu tiba-tiba ingin berbuat nakal, ucapkan a‘ūdzu billāh, lalu tinggalkan.",
        "Pilih teman yang mengajak kepada kebaikan.",
        "Biasakan membaca An-Nas sebelum tidur."
      ],
      fact: "An-Nas adalah surat ke-114, surat terakhir dalam Al-Qur'an. Bersama Al-Falaq, keduanya disebut Al-Mu‘awwidzatain: dua surat untuk memohon perlindungan."
    },
    ayahs: [
      { words: [["قُلْ", "Katakanlah", "Qul"], ["أَعُوذُ", "aku berlindung", "a'ūdzu"], ["بِرَبِّ", "kepada Tuhan", "birabbin"], ["ٱلنَّاسِ", "manusia", "nās"]],
        tr: "Katakanlah, “Aku berlindung kepada Tuhannya manusia," },
      { words: [["مَلِكِ", "Raja", "Malikin"], ["ٱلنَّاسِ", "manusia", "nās"]],
        tr: "Raja manusia," },
      { words: [["إِلَٰهِ", "Sembahan", "Ilāhin"], ["ٱلنَّاسِ", "manusia", "nās"]],
        tr: "sembahan manusia," },
      { words: [["مِن", "dari", "Min"], ["شَرِّ", "kejahatan", "syarril"], ["ٱلْوَسْوَاسِ", "(bisikan) setan", "waswāsil"], ["ٱلْخَنَّاسِ", "yang bersembunyi", "khannās"]],
        tr: "dari kejahatan (bisikan) setan yang bersembunyi," },
      { words: [["ٱلَّذِى", "yang", "Alladzī"], ["يُوَسْوِسُ", "membisikkan", "yuwaswisu"], ["فِى", "ke dalam", "fī"], ["صُدُورِ", "dada", "shudūrin"], ["ٱلنَّاسِ", "manusia", "nās"]],
        tr: "yang membisikkan (kejahatan) ke dalam dada manusia," },
      { words: [["مِنَ", "dari", "Minal"], ["ٱلْجِنَّةِ", "jin", "jinnati"], ["وَٱلنَّاسِ", "dan manusia", "wan nās"]],
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
    treasure: {
      message: "Allah yang menghadirkan cahaya subuh setelah gelapnya malam juga mampu melindungi kita dari segala keburukan: kejahatan makhluk, gelapnya malam, sihir, dan orang yang dengki.",
      advice: [
        "Jangan takut gelap. Berdoalah dan ingat bahwa Allah selalu menjaga.",
        "Jangan iri kepada teman. Ikut senanglah saat teman mendapat kebaikan.",
        "Bacalah Al-Falaq pagi dan petang untuk memohon perlindungan."
      ],
      fact: "Al-Falaq artinya waktu subuh. Al-Falaq dan An-Nas turun berdekatan dan sering dibaca bersama untuk memohon perlindungan."
    },
    ayahs: [
      { words: [["قُلْ", "Katakanlah", "Qul"], ["أَعُوذُ", "aku berlindung", "a'ūdzu"], ["بِرَبِّ", "kepada Tuhan", "birabbil"], ["ٱلْفَلَقِ", "(yang menguasai) subuh", "falaq"]],
        tr: "Katakanlah, “Aku berlindung kepada Tuhan yang menguasai subuh (fajar)," },
      { words: [["مِن", "dari", "Min"], ["شَرِّ", "kejahatan", "syarri"], ["مَا", "(makhluk) yang", "mā"], ["خَلَقَ", "Dia ciptakan", "khalaq"]],
        tr: "dari kejahatan (makhluk yang) Dia ciptakan," },
      { words: [["وَمِن", "dan dari", "Wa min"], ["شَرِّ", "kejahatan", "syarri"], ["غَاسِقٍ", "malam", "ghāsiqin"], ["إِذَا", "apabila", "idzā"], ["وَقَبَ", "telah gelap gulita", "waqab"]],
        tr: "dan dari kejahatan malam apabila telah gelap gulita," },
      { words: [["وَمِن", "dan dari", "Wa min"], ["شَرِّ", "kejahatan", "syarrin"], ["ٱلنَّفَّٰثَٰتِ", "(penyihir) yang meniup", "naffātsāti"], ["فِى", "pada", "fil"], ["ٱلْعُقَدِ", "buhul-buhul (tali)", "'uqad"]],
        tr: "dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya)," },
      { words: [["وَمِن", "dan dari", "Wa min"], ["شَرِّ", "kejahatan", "syarri"], ["حَاسِدٍ", "orang yang dengki", "hāsidin"], ["إِذَا", "apabila", "idzā"], ["حَسَدَ", "ia dengki", "hasad"]],
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
    treasure: {
      message: "Allah itu satu. Semua makhluk membutuhkan-Nya, sedangkan Allah tidak membutuhkan siapa pun. Allah tidak beranak dan tidak diperanakkan, dan tidak ada yang setara dengan-Nya.",
      advice: [
        "Mintalah segala sesuatu hanya kepada Allah, karena hanya Dia tempat bergantung.",
        "Beribadahlah dengan ikhlas, karena Allah, bukan supaya dipuji orang.",
        "Saat melihat ciptaan Allah yang indah, ucapkan Subhānallāh."
      ],
      fact: "Rasulullah ﷺ bersabda bahwa surat Al-Ikhlas sebanding dengan sepertiga Al-Qur'an (HR. Bukhari)."
    },
    ayahs: [
      { words: [["قُلْ", "Katakanlah", "Qul"], ["هُوَ", "Dialah", "huwal"], ["ٱللَّهُ", "Allah", "lāhu"], ["أَحَدٌ", "Yang Maha Esa", "ahad"]],
        tr: "Katakanlah (Muhammad), “Dialah Allah, Yang Maha Esa." },
      { words: [["ٱللَّهُ", "Allah", "Allāhush"], ["ٱلصَّمَدُ", "tempat meminta segala sesuatu", "shamad"]],
        tr: "Allah tempat meminta segala sesuatu." },
      { words: [["لَمْ", "tidak", "Lam"], ["يَلِدْ", "Dia beranak", "yalid"], ["وَلَمْ", "dan tidak", "wa lam"], ["يُولَدْ", "Dia diperanakkan", "yūlad"]],
        tr: "(Allah) tidak beranak dan tidak pula diperanakkan." },
      { words: [["وَلَمْ", "dan tidak", "Wa lam"], ["يَكُن", "ada", "yakul"], ["لَّهُۥ", "bagi-Nya", "lahū"], ["كُفُوًا", "yang setara", "kufuwan"], ["أَحَدٌۢ", "seorang pun", "ahad"]],
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
    treasure: {
      message: "Allah telah memberi Nabi Muhammad ﷺ nikmat yang sangat banyak. Balasan terbaik atas nikmat adalah bersyukur: salat dan berkurban karena Allah. Orang yang membenci kebenaran justru dialah yang merugi.",
      advice: [
        "Hitunglah nikmat Allah hari ini: mata, telinga, keluarga, makanan… lalu ucapkan Alhamdulillah.",
        "Jaga salat lima waktu sebagai tanda terima kasih kepada Allah.",
        "Jangan sedih kalau diejek saat berbuat baik. Allah bersama orang yang benar."
      ],
      fact: "Al-Kautsar adalah surat terpendek dalam Al-Qur'an, hanya 3 ayat. Al-Kautsar juga nama sungai di surga yang Allah janjikan untuk Nabi Muhammad ﷺ (HR. Muslim)."
    },
    ayahs: [
      { words: [["إِنَّآ", "Sesungguhnya Kami", "Innā"], ["أَعْطَيْنَٰكَ", "telah memberimu", "a'thainākal"], ["ٱلْكَوْثَرَ", "nikmat yang banyak", "kautsar"]],
        tr: "Sungguh, Kami telah memberimu (Muhammad) nikmat yang banyak." },
      { words: [["فَصَلِّ", "maka salatlah", "Fa shalli"], ["لِرَبِّكَ", "karena Tuhanmu", "lirabbika"], ["وَٱنْحَرْ", "dan berkurbanlah", "wanhar"]],
        tr: "Maka laksanakanlah salat karena Tuhanmu, dan berkurbanlah." },
      { words: [["إِنَّ", "sesungguhnya", "Inna"], ["شَانِئَكَ", "orang yang membencimu", "syāni'aka"], ["هُوَ", "dialah", "huwal"], ["ٱلْأَبْتَرُ", "yang terputus", "abtar"]],
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
    treasure: {
      message: "Allah bersumpah demi waktu: semua manusia bisa rugi, kecuali yang punya empat hal, yaitu beriman, beramal saleh, saling menasihati dalam kebenaran, dan saling menasihati dalam kesabaran.",
      advice: [
        "Jangan habiskan waktu hanya untuk bermain gawai. Sisihkan waktu untuk mengaji dan membantu orang tua.",
        "Ajak temanmu berbuat baik dengan cara yang lembut.",
        "Bersabarlah saat belajar, walaupun terasa sulit."
      ],
      fact: "Imam Asy-Syafi‘i pernah berkata: seandainya manusia mau merenungkan surat Al-'Asr saja, sungguh surat ini sudah cukup bagi mereka."
    },
    ayahs: [
      { words: [["وَٱلْعَصْرِ", "Demi masa", "Wal 'ashr"]],
        tr: "Demi masa," },
      { words: [["إِنَّ", "sesungguhnya", "Innal"], ["ٱلْإِنسَٰنَ", "manusia", "insāna"], ["لَفِى", "benar-benar dalam", "lafī"], ["خُسْرٍ", "kerugian", "khusr"]],
        tr: "sungguh, manusia berada dalam kerugian," },
      { words: [["إِلَّا", "kecuali", "Illal"], ["ٱلَّذِينَ", "orang-orang yang", "ladzīna"], ["ءَامَنُوا۟", "beriman", "āmanū"], ["وَعَمِلُوا۟", "dan mengerjakan", "wa 'amilush"], ["ٱلصَّٰلِحَٰتِ", "kebajikan", "shālihāti"], ["وَتَوَاصَوْا۟", "dan saling menasihati", "wa tawāshau"], ["بِٱلْحَقِّ", "untuk kebenaran", "bil haqqi"], ["وَتَوَاصَوْا۟", "dan saling menasihati", "wa tawāshau"], ["بِٱلصَّبْرِ", "untuk kesabaran", "bish shabr"]],
        tr: "kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran." }
    ]
  }
];
