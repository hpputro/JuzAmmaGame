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
  },
  {
    id: 96,
    name: "Al-'Alaq",
    meaning: "Segumpal Darah",
    place: "Gua Pena",
    emoji: "🖋️",
    reward: { emoji: "🪶", name: "Bulu Pena Camar", desc: "Bulu burung camar yang bisa dipakai menulis. Ingat, Allah mengajar manusia dengan pena!" },
    story: [
      { art: "📖", text: "Allah memerintahkan kita membaca dengan menyebut nama-Nya, Tuhan yang menciptakan." },
      { art: "✏️", text: "Allah mengajari manusia dengan pena, mengajarkan hal-hal yang sebelumnya tidak kita ketahui." },
      { art: "🙇", text: "Jangan sombong! Allah selalu melihat kita. Yuk, sujud dan mendekat kepada Allah." }
    ],
    treasure: {
      message: "Allah memerintahkan manusia membaca dan belajar dengan menyebut nama-Nya. Dialah yang menciptakan manusia dan mengajarinya dengan pena. Manusia bisa menjadi sombong saat merasa serba cukup, padahal Allah melihat segalanya dan semua akan kembali kepada-Nya. Maka sujudlah dan dekatkan diri kepada Allah.",
      advice: [
        "Mulailah membaca dan belajar dengan Bismillah.",
        "Rajinlah membaca dan menulis, karena ilmu adalah karunia dari Allah.",
        "Jangan sombong walaupun pintar atau punya banyak barang.",
        "Jangan menghalangi orang yang ingin salat atau berbuat baik.",
        "Ingatlah bahwa Allah selalu melihat kita, di mana pun kita berada."
      ],
      fact: "Lima ayat pertama surat Al-'Alaq adalah wahyu yang pertama kali turun kepada Nabi Muhammad ﷺ, di Gua Hira (HR. Bukhari dan Muslim). Ayat terakhirnya adalah ayat sajdah: kita disunnahkan sujud tilawah saat membaca atau mendengarnya."
    },
    ayahs: [
      { words: [["ٱقْرَأْ", "bacalah", "Iqra'"], ["بِٱسْمِ", "dengan (menyebut) nama", "bismi"], ["رَبِّكَ", "Tuhanmu", "rabbikal"], ["ٱلَّذِى", "yang", "ladzī"], ["خَلَقَ", "menciptakan", "khalaq"]],
        tr: "Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan," },
      { words: [["خَلَقَ", "Dia telah menciptakan", "Khalaqal"], ["ٱلْإِنسَٰنَ", "manusia", "insāna"], ["مِنْ", "dari", "min"], ["عَلَقٍ", "segumpal darah", "'alaq"]],
        tr: "Dia telah menciptakan manusia dari segumpal darah." },
      { words: [["ٱقْرَأْ", "bacalah", "Iqra'"], ["وَرَبُّكَ", "dan Tuhanmu", "wa rabbukal"], ["ٱلْأَكْرَمُ", "Yang Mahamulia", "akram"]],
        tr: "Bacalah, dan Tuhanmulah Yang Mahamulia," },
      { words: [["ٱلَّذِى", "yang", "Alladzī"], ["عَلَّمَ", "mengajar", "'allama"], ["بِٱلْقَلَمِ", "dengan pena", "bil qalam"]],
        tr: "Yang mengajar (manusia) dengan pena." },
      { words: [["عَلَّمَ", "Dia mengajarkan", "'Allamal"], ["ٱلْإِنسَٰنَ", "manusia", "insāna"], ["مَا", "apa yang", "mā"], ["لَمْ", "tidak", "lam"], ["يَعْلَمْ", "ia ketahui", "ya'lam"]],
        tr: "Dia mengajarkan manusia apa yang tidak diketahuinya." },
      { words: [["كَلَّآ", "sekali-kali tidak", "Kallā"], ["إِنَّ", "sesungguhnya", "innal"], ["ٱلْإِنسَٰنَ", "manusia", "insāna"], ["لَيَطْغَىٰٓ", "benar-benar melampaui batas", "layathghā"]],
        tr: "Sekali-kali tidak! Sungguh, manusia itu benar-benar melampaui batas," },
      { words: [["أَن", "apabila", "Ar"], ["رَّءَاهُ", "ia melihat dirinya", "ra'āhus"], ["ٱسْتَغْنَىٰٓ", "serba cukup", "taghnā"]],
        tr: "apabila melihat dirinya serba cukup." },
      { words: [["إِنَّ", "sesungguhnya", "Inna"], ["إِلَىٰ", "kepada", "ilā"], ["رَبِّكَ", "Tuhanmu", "rabbikar"], ["ٱلرُّجْعَىٰٓ", "tempat kembali", "ruj'ā"]],
        tr: "Sungguh, hanya kepada Tuhanmulah tempat kembali(mu)." },
      { words: [["أَرَءَيْتَ", "bagaimana pendapatmu", "Ara'aital"], ["ٱلَّذِى", "(tentang) orang yang", "ladzī"], ["يَنْهَىٰ", "melarang", "yanhā"]],
        tr: "Bagaimana pendapatmu tentang orang yang melarang?" },
      { words: [["عَبْدًا", "seorang hamba", "'Abdan"], ["إِذَا", "ketika", "idzā"], ["صَلَّىٰٓ", "ia salat", "shallā"]],
        tr: "seorang hamba ketika dia melaksanakan salat," },
      { words: [["أَرَءَيْتَ", "bagaimana pendapatmu", "Ara'aita"], ["إِن", "jika", "ing"], ["كَانَ", "ia berada", "kāna"], ["عَلَى", "di atas", "'alal"], ["ٱلْهُدَىٰٓ", "petunjuk (kebenaran)", "hudā"]],
        tr: "bagaimana pendapatmu jika dia (yang dilarang salat itu) berada di atas kebenaran (petunjuk)," },
      { words: [["أَوْ", "atau", "Au"], ["أَمَرَ", "ia menyuruh", "amara"], ["بِٱلتَّقْوَىٰٓ", "bertakwa", "bit taqwā"]],
        tr: "atau dia menyuruh bertakwa (kepada Allah)?" },
      { words: [["أَرَءَيْتَ", "bagaimana pendapatmu", "Ara'aita"], ["إِن", "jika", "in"], ["كَذَّبَ", "ia mendustakan", "kadzdzaba"], ["وَتَوَلَّىٰٓ", "dan berpaling", "wa tawallā"]],
        tr: "Bagaimana pendapatmu jika dia (yang melarang) itu mendustakan dan berpaling?" },
      { words: [["أَلَمْ", "tidakkah", "Alam"], ["يَعْلَم", "ia mengetahui", "ya'lam"], ["بِأَنَّ", "bahwa", "bi annal"], ["ٱللَّهَ", "Allah", "lāha"], ["يَرَىٰ", "melihat", "yarā"]],
        tr: "Tidakkah dia mengetahui bahwa sesungguhnya Allah melihat (segala perbuatannya)?" },
      { words: [["كَلَّا", "sekali-kali tidak", "Kallā"], ["لَئِن", "sungguh jika", "la'il"], ["لَّمْ", "tidak", "lam"], ["يَنتَهِ", "ia berhenti", "yantahi"], ["لَنَسْفَعًۢا", "pasti Kami tarik", "lanasfa'am"], ["بِٱلنَّاصِيَةِ", "ubun-ubunnya", "bin nāshiyah"]],
        tr: "Sekali-kali tidak! Sungguh, jika dia tidak berhenti (berbuat demikian) niscaya Kami tarik ubun-ubunnya (ke dalam neraka)," },
      { words: [["نَاصِيَةٍ", "ubun-ubun", "Nāshiyatin"], ["كَٰذِبَةٍ", "(orang) yang mendustakan", "kādzibatin"], ["خَاطِئَةٍ", "lagi durhaka", "khāthi'ah"]],
        tr: "(yaitu) ubun-ubun orang yang mendustakan dan durhaka." },
      { words: [["فَلْيَدْعُ", "maka biarlah ia memanggil", "Falyad'u"], ["نَادِيَهُۥ", "golongannya", "nādiyah"]],
        tr: "Maka biarlah dia memanggil golongannya (untuk menolongnya)," },
      { words: [["سَنَدْعُ", "Kami akan memanggil", "Sanad'uz"], ["ٱلزَّبَانِيَةَ", "Malaikat Zabaniyah", "zabāniyah"]],
        tr: "Kami pun akan memanggil Malaikat Zabaniyah (penyiksa orang-orang yang berdosa)," },
      { words: [["كَلَّا", "sekali-kali tidak", "Kallā"], ["لَا", "jangan", "lā"], ["تُطِعْهُ", "kamu patuhi dia", "tuthi'hu"], ["وَٱسْجُدْ", "dan sujudlah", "wasjud"], ["وَٱقْتَرِب", "dan dekatkanlah (dirimu)", "waqtarib"]],
        tr: "sekali-kali tidak! Janganlah kamu patuh kepadanya; dan sujudlah serta dekatkanlah (dirimu kepada Allah)." }
    ]
  },
  {
    id: 83,
    name: "Al-Muthaffifin",
    meaning: "Orang-orang yang Curang",
    place: "Pasar Timbangan",
    emoji: "⚖️",
    reward: { emoji: "🦀", name: "Kepiting Adil", desc: "Capit kanan dan kirinya sama besar. Ia selalu menakar dengan jujur, tidak pernah curang." },
    story: [
      { art: "⚖️", text: "Di sebuah pasar, ada pedagang yang curang: minta takaran penuh saat membeli, tapi mengurangi timbangan saat menjual." },
      { art: "📒", text: "Allah mencatat semua perbuatan kita, yang baik maupun yang buruk, dalam sebuah kitab catatan." },
      { art: "🏃", text: "Surat Al-Muthaffifin mengajak kita jujur dan berlomba-lomba dalam kebaikan!" }
    ],
    treasure: {
      message: "Allah mengancam orang yang curang dalam menakar dan menimbang. Semua amal dicatat: catatan orang durhaka tersimpan di Sijjin, catatan orang berbakti tersimpan di ‘Illiyyin. Orang berbakti akan menikmati surga, maka berlomba-lombalah untuk meraihnya.",
      advice: [
        "Selalu jujur: saat berjualan, membagi makanan, atau bermain bersama teman.",
        "Jangan menertawakan atau mengejek teman yang rajin beribadah.",
        "Berlombalah dalam kebaikan, bukan dalam hal yang sia-sia.",
        "Kalau berbuat salah, segera minta maaf dan bertobat supaya hati tidak tertutup oleh dosa (ayat 14)."
      ],
      fact: "Ibnu ‘Abbas menceritakan, ketika Nabi ﷺ tiba di Madinah, penduduknya termasuk yang paling curang dalam menakar. Lalu turunlah surat ini, dan setelah itu mereka menjadi jujur dalam menakar (HR. Ibnu Majah)."
    },
    ayahs: [
      { words: [["وَيْلٌ", "celakalah", "Wailul"], ["لِّلْمُطَفِّفِينَ", "bagi orang-orang yang curang", "lil muthaffifīn"]],
        tr: "Celakalah orang-orang yang curang (dalam menakar dan menimbang)!" },
      { words: [["ٱلَّذِينَ", "(yaitu) orang-orang yang", "Alladzīna"], ["إِذَا", "apabila", "idzak"], ["ٱكْتَالُوا۟", "menerima takaran", "tālū"], ["عَلَى", "dari", "'alan"], ["ٱلنَّاسِ", "orang lain", "nāsi"], ["يَسْتَوْفُونَ", "mereka minta dicukupkan", "yastaufūn"]],
        tr: "(Yaitu) orang-orang yang apabila menerima takaran dari orang lain mereka minta dicukupkan," },
      { words: [["وَإِذَا", "dan apabila", "Wa idzā"], ["كَالُوهُمْ", "mereka menakar (untuk orang lain)", "kālūhum"], ["أَو", "atau", "aw"], ["وَّزَنُوهُمْ", "menimbang (untuk orang lain)", "wazanūhum"], ["يُخْسِرُونَ", "mereka mengurangi", "yukhsirūn"]],
        tr: "dan apabila mereka menakar atau menimbang (untuk orang lain), mereka mengurangi." },
      { words: [["أَلَا", "tidakkah", "Alā"], ["يَظُنُّ", "mengira", "yazhunnu"], ["أُو۟لَٰٓئِكَ", "mereka itu", "ulā'ika"], ["أَنَّهُم", "bahwa mereka", "annahum"], ["مَّبْعُوثُونَ", "akan dibangkitkan", "mab'ūtsūn"]],
        tr: "Tidakkah mereka itu mengira, bahwa sesungguhnya mereka akan dibangkitkan," },
      { words: [["لِيَوْمٍ", "pada suatu hari", "Liyaumin"], ["عَظِيمٍ", "yang besar", "'azhīm"]],
        tr: "pada suatu hari yang besar," },
      { words: [["يَوْمَ", "(yaitu) hari", "Yauma"], ["يَقُومُ", "berdiri (bangkit)", "yaqūmun"], ["ٱلنَّاسُ", "manusia", "nāsu"], ["لِرَبِّ", "menghadap Tuhan", "lirabbil"], ["ٱلْعَٰلَمِينَ", "seluruh alam", "'ālamīn"]],
        tr: "(yaitu) pada hari (ketika) semua orang bangkit menghadap Tuhan seluruh alam." },
      { words: [["كَلَّآ", "sekali-kali jangan begitu", "Kallā"], ["إِنَّ", "sesungguhnya", "inna"], ["كِتَٰبَ", "catatan", "kitābal"], ["ٱلْفُجَّارِ", "orang-orang durhaka", "fujjāri"], ["لَفِى", "benar-benar dalam", "lafī"], ["سِجِّينٍ", "Sijjin", "sijjīn"]],
        tr: "Sekali-kali jangan begitu! Sesungguhnya catatan orang yang durhaka benar-benar tersimpan dalam Sijjin." },
      { words: [["وَمَآ", "dan apa", "Wa mā"], ["أَدْرَىٰكَ", "yang memberitahumu", "adrāka"], ["مَا", "apakah", "mā"], ["سِجِّينٌ", "Sijjin itu", "sijjīn"]],
        tr: "Dan tahukah engkau apakah Sijjin itu?" },
      { words: [["كِتَٰبٌ", "kitab", "Kitābum"], ["مَّرْقُومٌ", "yang berisi catatan", "marqūm"]],
        tr: "(Yaitu) kitab yang berisi catatan (amal)." },
      { words: [["وَيْلٌ", "celakalah", "Wailuy"], ["يَوْمَئِذٍ", "pada hari itu", "yauma'idzil"], ["لِّلْمُكَذِّبِينَ", "bagi orang-orang yang mendustakan", "lil mukadzdzibīn"]],
        tr: "Celakalah pada hari itu bagi orang-orang yang mendustakan!" },
      { words: [["ٱلَّذِينَ", "(yaitu) orang-orang yang", "Alladzīna"], ["يُكَذِّبُونَ", "mendustakan", "yukadzdzibūna"], ["بِيَوْمِ", "hari", "biyaumid"], ["ٱلدِّينِ", "pembalasan", "dīn"]],
        tr: "(yaitu) orang-orang yang mendustakan hari pembalasan." },
      { words: [["وَمَا", "dan tidak ada", "Wa mā"], ["يُكَذِّبُ", "yang mendustakan", "yukadzdzibu"], ["بِهِۦٓ", "nya (hari itu)", "bihī"], ["إِلَّا", "kecuali", "illā"], ["كُلُّ", "setiap", "kullu"], ["مُعْتَدٍ", "orang yang melampaui batas", "mu'tadin"], ["أَثِيمٍ", "lagi berdosa", "atsīm"]],
        tr: "Dan tidak ada yang mendustakannya (hari pembalasan) selain setiap orang yang melampaui batas dan berdosa," },
      { words: [["إِذَا", "apabila", "Idzā"], ["تُتْلَىٰ", "dibacakan", "tutlā"], ["عَلَيْهِ", "kepadanya", "'alaihi"], ["ءَايَٰتُنَا", "ayat-ayat Kami", "āyātunā"], ["قَالَ", "dia berkata", "qāla"], ["أَسَٰطِيرُ", "dongeng-dongeng", "asāthīrul"], ["ٱلْأَوَّلِينَ", "orang-orang dahulu", "awwalīn"]],
        tr: "yang apabila dibacakan kepadanya ayat-ayat Kami, dia berkata, “Itu adalah dongeng orang-orang dahulu.”" },
      { words: [["كَلَّا", "sekali-kali tidak", "Kallā"], ["بَلْ", "bahkan", "bal"], ["رَانَ", "telah menutupi", "rāna"], ["عَلَىٰ", "atas", "'alā"], ["قُلُوبِهِم", "hati mereka", "qulūbihim"], ["مَّا", "apa yang", "mā"], ["كَانُوا۟", "dahulu mereka", "kānū"], ["يَكْسِبُونَ", "kerjakan", "yaksibūn"]],
        tr: "Sekali-kali tidak! Bahkan apa yang mereka kerjakan itu telah menutupi hati mereka." },
      { words: [["كَلَّآ", "sekali-kali tidak", "Kallā"], ["إِنَّهُمْ", "sesungguhnya mereka", "innahum"], ["عَن", "dari", "'ar"], ["رَّبِّهِمْ", "Tuhan mereka", "rabbihim"], ["يَوْمَئِذٍ", "pada hari itu", "yauma'idzil"], ["لَّمَحْجُوبُونَ", "benar-benar terhalang", "lamahjūbūn"]],
        tr: "Sekali-kali tidak! Sesungguhnya mereka pada hari itu benar-benar terhalang dari (melihat) Tuhannya." },
      { words: [["ثُمَّ", "kemudian", "Tsumma"], ["إِنَّهُمْ", "sesungguhnya mereka", "innahum"], ["لَصَالُوا۟", "benar-benar masuk", "lashālul"], ["ٱلْجَحِيمِ", "neraka Jahim", "jahīm"]],
        tr: "Kemudian, sesungguhnya mereka benar-benar masuk neraka." },
      { words: [["ثُمَّ", "kemudian", "Tsumma"], ["يُقَالُ", "dikatakan", "yuqālu"], ["هَٰذَا", "inilah", "hādzal"], ["ٱلَّذِى", "(azab) yang", "ladzī"], ["كُنتُم", "dahulu kamu", "kuntum"], ["بِهِۦ", "terhadapnya", "bihī"], ["تُكَذِّبُونَ", "dustakan", "tukadzdzibūn"]],
        tr: "Kemudian, dikatakan (kepada mereka), “Inilah (azab) yang dahulu kamu dustakan.”" },
      { words: [["كَلَّآ", "sekali-kali tidak", "Kallā"], ["إِنَّ", "sesungguhnya", "inna"], ["كِتَٰبَ", "catatan", "kitābal"], ["ٱلْأَبْرَارِ", "orang-orang yang berbakti", "abrāri"], ["لَفِى", "benar-benar dalam", "lafī"], ["عِلِّيِّينَ", "‘Illiyyin", "'illiyyīn"]],
        tr: "Sekali-kali tidak! Sesungguhnya catatan orang-orang yang berbakti benar-benar tersimpan dalam ‘Illiyyin." },
      { words: [["وَمَآ", "dan apa", "Wa mā"], ["أَدْرَىٰكَ", "yang memberitahumu", "adrāka"], ["مَا", "apakah", "mā"], ["عِلِّيُّونَ", "‘Illiyyin itu", "'illiyyūn"]],
        tr: "Dan tahukah engkau apakah ‘Illiyyin itu?" },
      { words: [["كِتَٰبٌ", "kitab", "Kitābum"], ["مَّرْقُومٌ", "yang berisi catatan", "marqūm"]],
        tr: "(Yaitu) kitab yang berisi catatan (amal)," },
      { words: [["يَشْهَدُهُ", "yang disaksikan", "Yasyhaduhul"], ["ٱلْمُقَرَّبُونَ", "(malaikat) yang didekatkan", "muqarrabūn"]],
        tr: "yang disaksikan oleh (malaikat-malaikat) yang didekatkan (kepada Allah)." },
      { words: [["إِنَّ", "sesungguhnya", "Innal"], ["ٱلْأَبْرَارَ", "orang-orang yang berbakti", "abrāra"], ["لَفِى", "benar-benar dalam", "lafī"], ["نَعِيمٍ", "kenikmatan", "na'īm"]],
        tr: "Sesungguhnya orang-orang yang berbakti benar-benar berada dalam (surga yang penuh) kenikmatan," },
      { words: [["عَلَى", "di atas", "'Alal"], ["ٱلْأَرَآئِكِ", "dipan-dipan", "arā'iki"], ["يَنظُرُونَ", "mereka memandang", "yanzhurūn"]],
        tr: "mereka (duduk) di atas dipan-dipan melepas pandangan." },
      { words: [["تَعْرِفُ", "kamu mengetahui", "Ta'rifu"], ["فِى", "pada", "fī"], ["وُجُوهِهِمْ", "wajah mereka", "wujūhihim"], ["نَضْرَةَ", "keceriaan", "nadhratan"], ["ٱلنَّعِيمِ", "kenikmatan", "na'īm"]],
        tr: "Kamu dapat mengetahui dari wajah mereka kesenangan hidup yang penuh kenikmatan." },
      { words: [["يُسْقَوْنَ", "mereka diberi minum", "Yusqauna"], ["مِن", "dari", "mir"], ["رَّحِيقٍ", "minuman murni", "rahīqim"], ["مَّخْتُومٍ", "yang disegel", "makhtūm"]],
        tr: "Mereka diberi minum dari khamar murni (tidak memabukkan) yang (tempatnya) masih dilak (disegel)," },
      { words: [["خِتَٰمُهُۥ", "segelnya", "Khitāmuhū"], ["مِسْكٌ", "kasturi", "misk"], ["وَفِى", "dan untuk", "wa fī"], ["ذَٰلِكَ", "yang demikian itu", "dzālika"], ["فَلْيَتَنَافَسِ", "hendaklah berlomba-lomba", "falyatanāfasil"], ["ٱلْمُتَنَٰفِسُونَ", "orang-orang yang berlomba", "mutanāfisūn"]],
        tr: "laknya dari kasturi. Dan untuk yang demikian itu hendaknya orang berlomba-lomba." },
      { words: [["وَمِزَاجُهُۥ", "dan campurannya", "Wa mizājuhū"], ["مِن", "dari", "min"], ["تَسْنِيمٍ", "Tasnim", "tasnīm"]],
        tr: "Dan campurannya dari tasnim," },
      { words: [["عَيْنًا", "(yaitu) mata air", "'Ainay"], ["يَشْرَبُ", "minum", "yasyrabu"], ["بِهَا", "darinya", "bihal"], ["ٱلْمُقَرَّبُونَ", "orang-orang yang didekatkan", "muqarrabūn"]],
        tr: "(yaitu) mata air yang diminum oleh mereka yang dekat (kepada Allah)." },
      { words: [["إِنَّ", "sesungguhnya", "Innal"], ["ٱلَّذِينَ", "orang-orang yang", "ladzīna"], ["أَجْرَمُوا۟", "berbuat dosa", "ajramū"], ["كَانُوا۟", "dahulu mereka", "kānū"], ["مِنَ", "terhadap", "minal"], ["ٱلَّذِينَ", "orang-orang yang", "ladzīna"], ["ءَامَنُوا۟", "beriman", "āmanū"], ["يَضْحَكُونَ", "menertawakan", "yadhhakūn"]],
        tr: "Sesungguhnya orang-orang yang berdosa adalah mereka yang dahulu menertawakan orang-orang yang beriman." },
      { words: [["وَإِذَا", "dan apabila", "Wa idzā"], ["مَرُّوا۟", "mereka melintas", "marrū"], ["بِهِمْ", "di hadapan mereka", "bihim"], ["يَتَغَامَزُونَ", "mereka saling mengedipkan mata", "yataghāmazūn"]],
        tr: "Dan apabila mereka (orang-orang yang beriman) melintas di hadapan mereka, mereka saling mengedip-ngedipkan matanya," },
      { words: [["وَإِذَا", "dan apabila", "Wa idzan"], ["ٱنقَلَبُوٓا۟", "mereka kembali", "qalabū"], ["إِلَىٰٓ", "kepada", "ilā"], ["أَهْلِهِمُ", "kaum mereka", "ahlihimun"], ["ٱنقَلَبُوا۟", "mereka kembali", "qalabū"], ["فَكِهِينَ", "dengan gembira ria", "fakihīn"]],
        tr: "dan apabila kembali kepada kaumnya, mereka kembali dengan gembira ria." },
      { words: [["وَإِذَا", "dan apabila", "Wa idzā"], ["رَأَوْهُمْ", "mereka melihat mereka (orang mukmin)", "ra'auhum"], ["قَالُوٓا۟", "mereka berkata", "qālū"], ["إِنَّ", "sesungguhnya", "inna"], ["هَٰٓؤُلَآءِ", "mereka ini", "hā'ulā'i"], ["لَضَآلُّونَ", "benar-benar orang sesat", "ladhāllūn"]],
        tr: "Dan apabila mereka melihat (orang-orang mukmin), mereka mengatakan, “Sesungguhnya mereka benar-benar orang-orang sesat,”" },
      { words: [["وَمَآ", "padahal tidak", "Wa mā"], ["أُرْسِلُوا۟", "mereka diutus", "ursilū"], ["عَلَيْهِمْ", "atas mereka", "'alaihim"], ["حَٰفِظِينَ", "sebagai penjaga", "hāfizhīn"]],
        tr: "padahal (orang-orang yang berdosa itu) tidak diutus sebagai penjaga mereka (orang-orang mukmin)." },
      { words: [["فَٱلْيَوْمَ", "maka pada hari ini", "Fal yaumal"], ["ٱلَّذِينَ", "orang-orang yang", "ladzīna"], ["ءَامَنُوا۟", "beriman", "āmanū"], ["مِنَ", "terhadap", "minal"], ["ٱلْكُفَّارِ", "orang-orang kafir", "kuffāri"], ["يَضْحَكُونَ", "menertawakan", "yadhhakūn"]],
        tr: "Maka pada hari ini, orang-orang yang beriman yang menertawakan orang-orang kafir," },
      { words: [["عَلَى", "di atas", "'Alal"], ["ٱلْأَرَآئِكِ", "dipan-dipan", "arā'iki"], ["يَنظُرُونَ", "mereka memandang", "yanzhurūn"]],
        tr: "mereka (duduk) di atas dipan-dipan melepas pandangan." },
      { words: [["هَلْ", "apakah", "Hal"], ["ثُوِّبَ", "diberi balasan", "tsuwwibal"], ["ٱلْكُفَّارُ", "orang-orang kafir", "kuffāru"], ["مَا", "(terhadap) apa yang", "mā"], ["كَانُوا۟", "dahulu mereka", "kānū"], ["يَفْعَلُونَ", "perbuat", "yaf'alūn"]],
        tr: "Apakah orang-orang kafir itu diberi balasan (hukuman) terhadap apa yang telah mereka perbuat?" }
    ]
  }
];
