/* Pelayaran Juz Amma — prototipe sederhana.
 * Alur per surat:
 *   1 Pengantar → 2 Dengarkan Utuh → 3 Kenali Kata → 4 Harta Terpendam →
 *   5 Kuis Lanjut Ayat → 6 Kuis Kata yang Hilang → 7 Kuis Susun Ayat →
 *   8 Kuis Pahami Arti → Hasil
 */
(function () {
  "use strict";

  const app = document.getElementById("app");
  const toastEl = document.getElementById("toast");
  const MASCOT = "🐢"; // Pipo si penyu
  const SAVE_KEY = "pelayaran-juz-amma-v1";
  const LISTEN_KEY = "pelayaran-juz-amma-listen-v1";
  const STAGES = ["Pengantar", "Dengarkan Utuh", "Kenali Kata", "Harta Terpendam",
    "Kuis Lanjut Ayat", "Kuis Kata yang Hilang", "Kuis Susun Ayat", "Kuis Pahami Arti", "Laporan"];
  const QUIZ_STAGES = [5, 6, 7, 8];

  // ---------- penyimpanan (aman bila storage diblokir) ----------
  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* abaikan */ }
  }
  const progress = load(SAVE_KEY, {}); // { [surahId]: { stars: n } }
  // Catatan Pelayaran Mandiri: { [surahId]: { [tahap]: { times, questions?, mistakes?, items? } } }
  const FREE_KEY = "pelayaran-juz-amma-free-v1";
  const freeLog = load(FREE_KEY, {});
  // Pengaturan terakhir Penjelajahan Cerdas: { sid, kind, from, to }
  const SMART_KEY = "pelayaran-juz-amma-smart-v1";
  const listenPrefs = Object.assign({ ayahRepeat: 1, packRepeat: 1 }, load(LISTEN_KEY, {}));

  const starsOf = (s) => (progress[s.id] && progress[s.id].stars) || 0;
  const isUnlocked = (i) => i === 0 || starsOf(SURAHS[i - 1]) > 0;

  // ---------- util ----------
  const pad3 = (n) => String(n).padStart(3, "0");
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const arText = (ayah) => ayah.words.map((w) => w[0]).join(" ");
  /** Inti teks ayat untuk mendeteksi ayat (hampir) kembar: tanpa harakat/tanda baca
   *  Al-Qur'an, alif wasla disamakan, dan huruf و/ف di awal ayat diabaikan.
   *  Contoh: Al-Insyirah 5 (فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا) dan 6 (إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا). */
  const coreText = (ayah) => arText(ayah)
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/\u0671/g, "\u0627")
    .replace(/^[\u0648\u0641]/, "");
  const latin = (ayah) => ayah.words.map((w) => w[2]).join(" ");

  /** Jumlah soal kuis, tergantung mode.
   *  Mulai Berlayar   : semua kuis = separuh jumlah ayat, min 2, maks 10.
   *  Pelayaran Mandiri: Lanjut Ayat & Pahami Arti = separuh jumlah ayat (min 2, tanpa maks);
   *                     Kata yang Hilang & Susun Ayat = jumlah ayat.
   *  Jumlah sebenarnya dibatasi oleh banyaknya ayat yang bisa dijadikan soal. */
  function quizCount(ses, kind) {
    const n = ses.s.ayahs.length;
    const half = Math.max(2, Math.ceil(n / 2));
    if (!ses.free) return Math.min(10, half);
    if (kind === "missing" || kind === "arrange") return n;
    return half; // Lanjut Ayat & Pahami Arti
  }
  /** Ambil n indeks acak dari kandidat, lalu urutkan sesuai urutan ayat. */
  const pickIdx = (candidates, n) => shuffle(candidates).slice(0, n).sort((x, y) => x - y);
  /** Pengecoh unik: utamakan dari surat yang sama, bila kurang ambil dari surat lain. */
  function distractors(correct, samePool, otherPool, k, key = (v) => v) {
    const out = [];
    const used = new Set([key(correct)]);
    for (const v of shuffle(samePool).concat(shuffle(otherPool))) {
      if (out.length >= k) break;
      if (!used.has(key(v))) { used.add(key(v)); out.push(v); }
    }
    return out;
  }
  const otherSurahs = (s) => SURAHS.filter((x) => x !== s);

  // ---------- statistik kuis (per soal; satu soal bisa salah lebih dari sekali) ----------
  function newStats() {
    const st = {};
    QUIZ_STAGES.forEach((k) => { st[k] = { questions: 0, mistakes: 0, items: [] }; });
    return st;
  }
  const newSession = (s, free) => ({ s, mistakes: 0, questions: 0, free: !!free, stats: newStats() });
  function beginQ(ses, stage, label) {
    const item = { label, wrong: 0 };
    ses.stats[stage].items.push(item);
    ses.stats[stage].questions++;
    ses.questions++;
    return item;
  }
  function wrongQ(ses, stage, item) {
    item.wrong++;
    ses.stats[stage].mistakes++;
    ses.mistakes++;
  }

  /** Tabel laporan kuis. `data` = { [tahap]: {questions, mistakes, items} | undefined }. */
  function reportHtml(data, stages) {
    let rows = "", details = "";
    let tq = 0, tm = 0, tf = 0;
    stages.forEach((k) => {
      const d = data[k];
      const name = STAGES[k - 1].replace("Kuis ", "");
      if (!d || !d.questions) {
        rows += `<tr class="todo"><td>${esc(name)}</td><td colspan="3">Belum dikerjakan</td></tr>`;
        return;
      }
      const first = d.items.filter((it) => it.wrong === 0).length;
      tq += d.questions; tm += d.mistakes; tf += first;
      rows += `<tr><td>${esc(name)}</td><td>${d.questions}</td><td>${first}</td><td class="${d.mistakes ? "bad" : "good"}">${d.mistakes}</td></tr>`;
      const wrongItems = d.items.filter((it) => it.wrong > 0);
      details += `<details class="report-detail"><summary>${esc(name)} · ${d.questions} soal · ${d.mistakes}× salah</summary>
        ${wrongItems.length
          ? `<ul>${d.items.map((it) => `<li class="${it.wrong ? "bad" : "good"}">${esc(it.label)} — ${it.wrong ? `salah ${it.wrong}×` : "benar langsung ✓"}</li>`).join("")}</ul>`
          : `<p class="good">Semua soal benar di percobaan pertama 🎉</p>`}
      </details>`;
    });
    if (stages.length > 1) rows += `<tr class="total"><td>Total</td><td>${tq}</td><td>${tf}</td><td>${tm}</td></tr>`;
    return `<div class="card report">
      <table>
        <thead><tr><th>Kuis</th><th>Soal</th><th>Benar langsung</th><th>Salah</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="report-note">"Salah" menghitung setiap jawaban keliru, jadi satu soal bisa salah lebih dari sekali.</p>
      ${details}
    </div>`;
  }

  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  // ---------- audio (butuh internet) ----------
  const audio = new Audio();
  let audioWarned = false;
  let runId = 0; // naik setiap pindah layar, untuk menghentikan pemutaran berantai
  function warnAudio() {
    if (!audioWarned) { toast("🔇 Audio belum bisa diputar. Cek koneksi internet."); audioWarned = true; }
  }
  function play(url) {
    audio.onended = null;
    audio.pause();
    audio.src = url;
    return audio.play().catch((e) => { if (!e || e.name !== "AbortError") warnAudio(); });
  }
  /** Putar audio dan tunggu sampai selesai. Bila audio gagal, tunggu `fallbackMs`
   *  (tidak dihitung selama dijeda) supaya urutan tetap berjalan tanpa suara. */
  function playAndWait(url, fallbackMs, isPaused) {
    const myRun = runId;
    return new Promise((resolve) => {
      let finished = false;
      const finish = () => { if (finished) return; finished = true; audio.onended = null; resolve(); };
      audio.pause();
      audio.onended = finish;
      audio.src = url;
      audio.play().catch((e) => {
        if (e && e.name === "AbortError") return; // dijeda sebelum mulai
        warnAudio();
        audio.onended = null;
        let left = fallbackMs;
        const t = setInterval(() => {
          if (myRun !== runId) { clearInterval(t); return; }
          if (!isPaused()) left -= 200;
          if (left <= 0) { clearInterval(t); finish(); }
        }, 200);
      });
    });
  }
  const ayahUrl = (s, a) => `https://everyayah.com/data/Alafasy_128kbps/${pad3(s)}${pad3(a)}.mp3`;
  const wordUrl = (s, a, w) => `https://audio.qurancdn.com/wbw/${pad3(s)}_${pad3(a)}_${pad3(w)}.mp3`;

  // ---------- render helper ----------
  function render(html, bind) {
    runId++;
    toastEl.classList.remove("show");
    audio.onended = null;
    audio.pause();
    app.innerHTML = html;
    window.scrollTo(0, 0);
    if (bind) bind();
  }
  const $ = (sel) => app.querySelector(sel);
  const $$ = (sel) => Array.from(app.querySelectorAll(sel));
  const on = (sel, fn) => { const el = $(sel); if (el) el.addEventListener("click", fn); };
  const bindBack = (fn) => on("#back", fn);

  function topbar(label, title, right) {
    return `<div class="topbar">
      <button class="icon-btn" id="back" aria-label="Kembali">←</button>
      <div class="title"><small>${esc(label)}</small><b>${esc(title)}</b></div>
      ${right ? `<span class="pill">${esc(right)}</span>` : ""}
    </div>`;
  }
  const stageLabel = (k, s) => `Tahap ${k}/${STAGES.length} · ${STAGES[k - 1]} · ${s.name}`;
  function progressBar(total, current) {
    let h = '<div class="progress">';
    for (let i = 0; i < total; i++) h += `<span class="${i < current ? "done" : i === current ? "now" : ""}"></span>`;
    return h + "</div>";
  }
  /** Blok ayat lengkap: Arab + transliterasi + arti. */
  const ayahBlock = (ayah) => `
    <p class="arabic">${esc(arText(ayah))}</p>
    <p class="latin">${esc(latin(ayah))}</p>
    <p class="translation show">${esc(ayah.tr)}</p>`;

  // =====================================================================
  // BERANDA
  // =====================================================================
  function home() {
    render(`<section class="screen home">
      <div class="hero">⛵</div>
      <h1>Pelayaran<br>Juz Amma</h1>
      <p>Berlayar bersama Pipo si penyu ${MASCOT} dari pulau ke pulau. Tiap pulau menyimpan satu surat!</p>
      <div class="spacer"></div>
      <button class="btn menu smart" id="smart">🧠 Penjelajahan Cerdas<small>Pilih surat &amp; ayat, ulangi yang belum bisa</small></button>
      <button class="btn menu" id="start">⛵ Mulai Berlayar<small>Jelajahi pulau satu per satu</small></button>
      <button class="btn coral menu" id="free">🧭 Pelayaran Mandiri<small>Semua surat &amp; aktivitas terbuka</small></button>
      <button class="btn secondary menu" id="coll">🧺 Harta Laut<small>Koleksi oleh-oleh dari tiap pulau</small></button>
    </section>`, () => {
      on("#smart", () => smartSetup());
      on("#start", map);
      on("#free", freeMap);
      on("#coll", collection);
    });
  }

  // =====================================================================
  // PETA PULAU
  // =====================================================================
  function map() {
    const currentIdx = SURAHS.findIndex((s, i) => isUnlocked(i) && starsOf(s) === 0);
    let islands = "";
    SURAHS.forEach((s, i) => {
      const locked = !isUnlocked(i);
      const st = starsOf(s);
      const stars = st ? "⭐".repeat(st) + "☆".repeat(3 - st) : locked ? "🔒" : "Belum dikunjungi";
      islands += `<button class="island ${locked ? "locked" : ""} ${i === currentIdx ? "current" : ""}" data-i="${i}" ${locked ? 'aria-disabled="true"' : ""}>
        <span class="emo">${s.emoji}</span>
        <span><b>${esc(s.place)}</b><small>Surat ${esc(s.name)}</small><div class="stars">${stars}</div></span>
        ${i === currentIdx ? '<span class="boat">⛵</span>' : ""}
      </button>`;
    });
    render(`${topbar("Peta", "Kepulauan Juz Amma", `${Object.keys(progress).length}/${SURAHS.length}`)}
      <p>Ketuk pulau untuk mulai belajar. Selesaikan satu pulau untuk membuka pulau berikutnya.</p>
      <div class="map">${islands}</div>`, () => {
      bindBack(home);
      $$(".island").forEach((el) => el.addEventListener("click", () => {
        const i = Number(el.dataset.i);
        if (!isUnlocked(i)) { toast("🔒 Selesaikan pulau sebelumnya dulu ya!"); return; }
        startSurah(SURAHS[i]);
      }));
    });
  }

  // =====================================================================
  // PELAYARAN MANDIRI (semua surat & aktivitas terbuka, tanpa prasyarat)
  // =====================================================================
  const ACTIVITIES = [
    { emoji: "📖", desc: "Kisah singkat pesan surat", start: (ses) => story(ses, 0) },
    { emoji: "🎧", desc: "Dengarkan ayat demi ayat, bisa diulang", start: (ses) => listenSetup(ses) },
    { emoji: "👆", desc: "Ketuk kata, lihat arti & dengar suaranya", start: (ses) => learnWords(ses, 0) },
    { emoji: "💎", desc: "Pesan, nasihat, dan Tahukah Kamu?", start: (ses) => treasure(ses) },
    { emoji: "➡️", desc: "Dengar ayat, pilih ayat berikutnya", start: (ses) => quizNextAyah(ses) },
    { emoji: "🧩", desc: "Lengkapi kata yang dikosongkan", start: (ses) => quizMissingWord(ses) },
    { emoji: "🔤", desc: "Susun kata menjadi ayat utuh", start: (ses) => startArrange(ses) },
    { emoji: "💬", desc: "Dengar ayat, pilih artinya", start: (ses) => quizMeaning(ses) }
  ];

  function freeMap() {
    let list = "";
    SURAHS.forEach((s, i) => {
      list += `<button class="island free" data-i="${i}">
        <span class="emo">${s.emoji}</span>
        <span><b>${esc(s.name)}</b><small>${esc(s.meaning)} · ${s.ayahs.length} ayat</small></span>
      </button>`;
    });
    render(`${topbar("Pelayaran Mandiri", "Pilih surat")}
      <p>Semua surat terbuka. Pilih surat, lalu pilih aktivitas yang ingin kamu lakukan.</p>
      <div class="free-list">${list}</div>`, () => {
      bindBack(home);
      $$(".island").forEach((el) => el.addEventListener("click", () => activityMenu(SURAHS[Number(el.dataset.i)])));
    });
  }

  function activityMenu(s) {
    const log = freeLog[s.id] || {};
    let list = "";
    let done = 0;
    ACTIVITIES.forEach((a, i) => {
      const k = i + 1;
      const e = log[k];
      if (e) done++;
      let status;
      if (!e) status = '<span class="status-tag todo">Belum</span>';
      else if (QUIZ_STAGES.includes(k)) status = `<span class="status-tag ${e.mistakes ? "warn" : "ok"}">✓ ${e.questions} soal · ${e.mistakes}× salah</span>`;
      else status = '<span class="status-tag ok">✓ Sudah</span>';
      list += `<button class="activity ${e ? "done" : ""}" data-i="${i}">
        <span class="emo">${a.emoji}</span>
        <span class="act-text"><b>${k}. ${esc(STAGES[i])}</b><small>${esc(a.desc)}</small>${status}</span>
      </button>`;
    });
    list += `<button class="activity report-btn" id="report">
        <span class="emo">📊</span>
        <span class="act-text"><b>9. Laporan</b><small>Rekap semua kuis surat ini</small></span>
      </button>`;
    render(`${topbar("Pelayaran Mandiri", `Surat ${s.name}`, `${done}/${ACTIVITIES.length}`)}
      ${progressBar(ACTIVITIES.length, -1)}
      <p>Pilih aktivitas. Tidak harus berurutan!</p>
      <div class="free-list">${list}</div>`, () => {
      bindBack(freeMap);
      $$(".progress span").forEach((b, i) => { if (log[i + 1]) b.className = "done"; });
      on("#report", () => freeReport(s));
      $$(".activity[data-i]").forEach((el) => el.addEventListener("click", () => {
        const stage = Number(el.dataset.i) + 1;
        ACTIVITIES[stage - 1].start(newSession(s, true));
      }));
    });
  }

  /** Pindah ke tahap berikutnya (mode berlayar) atau selesaikan aktivitas (mode mandiri). */
  function go(ses, finishedStage, nextFn) {
    if (!ses.free) { nextFn(); return; }
    logFree(ses, finishedStage);
    if (finishedStage >= 5) { freeQuizDone(ses, finishedStage); return; }
    activityMenu(ses.s);
    toast(`✅ ${STAGES[finishedStage - 1]} selesai!`);
  }
  /** Label tombol penutup aktivitas: di mode mandiri menjadi "Selesai". */
  const endLabel = (ses, text, freeText) => ses.free ? (freeText || "Selesai ✓") : text;
  /** Tombol kembali: ke peta (mode berlayar) atau ke menu aktivitas (mode mandiri). */
  function exit(ses) { return ses.free ? activityMenu(ses.s) : map(); }

  function freeReport(s) {
    const log = freeLog[s.id] || {};
    let checklist = "";
    [1, 2, 3, 4].forEach((k) => {
      checklist += `<li class="${log[k] ? "good" : "todo"}">${log[k] ? "✓" : "○"} ${esc(STAGES[k - 1])}${log[k] ? ` <small>(${log[k].times}×)</small>` : ""}</li>`;
    });
    render(`${topbar("Pelayaran Mandiri · Laporan", `Surat ${s.name}`)}
      <div class="card report">
        <h3>📚 Aktivitas belajar</h3>
        <ul class="checklist">${checklist}</ul>
      </div>
      <h3 class="report-title">📊 Hasil kuis terakhir</h3>
      ${reportHtml(log, QUIZ_STAGES)}
      <div class="spacer"></div>
      <button class="btn secondary" id="reset">↺ Hapus progres surat ini</button>`, () => {
      bindBack(() => activityMenu(s));
      on("#reset", () => {
        let ok = true;
        try { ok = window.confirm(`Hapus progres Pelayaran Mandiri surat ${s.name}?`); } catch (e) { /* abaikan */ }
        if (!ok) return;
        delete freeLog[s.id];
        save(FREE_KEY, freeLog);
        freeReport(s);
      });
    });
  }

  /** Simpan hasil terakhir sebuah aktivitas di Pelayaran Mandiri. */
  function logFree(ses, stage) {
    const bySurah = freeLog[ses.s.id] = freeLog[ses.s.id] || {};
    const prev = bySurah[stage] || {};
    const entry = { times: (prev.times || 0) + 1 };
    if (QUIZ_STAGES.includes(stage)) Object.assign(entry, JSON.parse(JSON.stringify(ses.stats[stage])));
    bySurah[stage] = entry;
    save(FREE_KEY, freeLog);
  }

  function freeQuizDone(ses, stage) {
    const { s } = ses;
    const { mistakes } = ses.stats[stage];
    render(`<section class="screen result">
      <h2>${esc(STAGES[stage - 1])} selesai!</h2>
      <div class="big-stars">${mistakes === 0 ? "🏆" : "👍"}</div>
      <p>${mistakes === 0 ? "Tanpa kesalahan! Masya Allah!" : "Bagus! Terus berlatih ya."}<br>
        <small>Surat ${esc(s.name)}</small></p>
      ${reportHtml(ses.stats, [stage])}
      <div class="spacer"></div>
      <button class="btn" id="again">↻ Ulangi kuis ini</button>
      <button class="btn secondary" id="menu">Pilih aktivitas lain</button>
    </section>`, () => {
      on("#again", () => ACTIVITIES[stage - 1].start(newSession(s, true)));
      on("#menu", () => activityMenu(s));
    });
  }

  // =====================================================================
  // ALUR SATU SURAT
  // =====================================================================
  function startSurah(s) {
    story(newSession(s), 0);
  }

  // ---- 1. Pengantar ----
  function story(ses, idx) {
    const { s } = ses;
    const slide = s.story[idx];
    let dots = "";
    s.story.forEach((_, i) => { dots += `<i class="${i === idx ? "on" : ""}"></i>`; });
    render(`${topbar(stageLabel(1, s), s.place)}
      <div class="story-art" aria-hidden="true">${slide.art}</div>
      <div class="story-talk">
        <div class="mascot">${MASCOT}</div>
        <div class="bubble"><div class="dots">${dots}</div>${esc(slide.text)}</div>
      </div>
      <div class="spacer"></div>
      <div class="row">
        <button class="btn secondary" id="skip">Lewati</button>
        <button class="btn" id="next">${idx < s.story.length - 1 ? "Lanjut" : endLabel(ses, "Dengarkan suratnya ›")}</button>
      </div>`, () => {
      bindBack(() => exit(ses));
      on("#skip", () => go(ses, 1, () => listenSetup(ses)));
      on("#next", () => idx < s.story.length - 1 ? story(ses, idx + 1) : go(ses, 1, () => listenSetup(ses)));
    });
  }

  // ---- 2. Dengarkan Utuh ----
  function stepper(id, label, value, unit) {
    return `<div class="stepper">
      <span>${label}</span>
      <div class="stepper-ctl">
        <button class="icon-btn" data-step="${id}" data-d="-1" aria-label="Kurangi">−</button>
        <b id="${id}">${value}</b>${unit ? `<small>${unit}</small>` : ""}
        <button class="icon-btn" data-step="${id}" data-d="1" aria-label="Tambah">+</button>
      </div>
    </div>`;
  }
  function listenSetup(ses, prev) {
    const { s } = ses;
    const n = s.ayahs.length;
    const cfg = prev || { from: 1, to: n, ayahRepeat: listenPrefs.ayahRepeat, packRepeat: listenPrefs.packRepeat };
    const limits = { from: [1, n], to: [1, n], ayahRepeat: [1, 10], packRepeat: [1, 10] };

    render(`${topbar(stageLabel(2, s), "Atur cara mendengarkan")}
      <div class="story-talk"><div class="mascot">${MASCOT}</div>
        <div class="bubble">Dengarkan surat ${esc(s.name)} ayat demi ayat. Kamu cukup menyimak, nanti diputar otomatis!</div></div>
      <div class="card settings">
        <h3>📦 Paket ayat</h3>
        ${stepper("from", "Dari ayat", cfg.from)}
        ${stepper("to", "Sampai ayat", cfg.to)}
        <h3>🔁 Pengulangan</h3>
        ${stepper("ayahRepeat", "Ulang tiap ayat", cfg.ayahRepeat, "kali")}
        ${stepper("packRepeat", "Ulang satu paket", cfg.packRepeat, "kali")}
        <p class="translation" id="summary"></p>
      </div>
      <div class="spacer"></div>
      <button class="btn" id="play">▶ Mulai dengarkan</button>
      <button class="btn secondary" id="skip">${endLabel(ses, "Lewati ke Kenali Kata ›", "Kembali ke menu")}</button>`, () => {
      bindBack(() => exit(ses));
      const summary = () => {
        const count = (cfg.to - cfg.from + 1) * cfg.ayahRepeat * cfg.packRepeat;
        $("#summary").textContent = `Total ${count} kali putar ayat.`;
      };
      summary();
      $$("[data-step]").forEach((b) => b.addEventListener("click", () => {
        const key = b.dataset.step;
        const [min, max] = limits[key];
        cfg[key] = Math.min(max, Math.max(min, cfg[key] + Number(b.dataset.d)));
        // jaga agar "dari" ≤ "sampai"
        if (key === "from" && cfg.from > cfg.to) cfg.to = cfg.from;
        if (key === "to" && cfg.to < cfg.from) cfg.from = cfg.to;
        ["from", "to", "ayahRepeat", "packRepeat"].forEach((k) => { $("#" + k).textContent = cfg[k]; });
        summary();
      }));
      on("#play", () => {
        listenPrefs.ayahRepeat = cfg.ayahRepeat;
        listenPrefs.packRepeat = cfg.packRepeat;
        save(LISTEN_KEY, listenPrefs);
        listenPlay(ses, cfg);
      });
      on("#skip", () => go(ses, 2, () => learnWords(ses, 0)));
    });
  }
  function listenPlay(ses, cfg) {
    const { s } = ses;
    const queue = [];
    for (let p = 1; p <= cfg.packRepeat; p++)
      for (let a = cfg.from; a <= cfg.to; a++)
        for (let r = 1; r <= cfg.ayahRepeat; r++) queue.push({ p, a, r });

    render(`${topbar(stageLabel(2, s), `Ayat ${cfg.from}–${cfg.to}`)}
      ${progressBar(queue.length, 0)}
      <div class="card listen" id="ayah"></div>
      <p class="status" id="status"></p>
      <div class="spacer"></div>
      <div class="row">
        <button class="btn secondary" id="pause">⏸ Jeda</button>
        <button class="btn secondary" id="setup">⚙️ Atur</button>
      </div>
      <button class="btn" id="next">${endLabel(ses, "Lanjut ke Kenali Kata ›")}</button>`, () => {
      bindBack(() => exit(ses));
      const myRun = runId;
      let idx = 0, paused = false, waiting = false, done = false;
      const bars = $$(".progress span");

      function show(item) {
        $("#ayah").innerHTML = `<small class="pill">Ayat ${item.a}</small>${ayahBlock(s.ayahs[item.a - 1])}`;
        let st = `Ulangan ayat ${item.r}/${cfg.ayahRepeat}`;
        if (cfg.packRepeat > 1) st += ` · Putaran paket ${item.p}/${cfg.packRepeat}`;
        $("#status").textContent = st;
        bars.forEach((b, i) => { b.className = i < idx ? "done" : i === idx ? "now" : ""; });
      }
      function step() {
        if (myRun !== runId) return;
        if (paused) { waiting = true; return; }
        if (idx >= queue.length) {
          done = true;
          bars.forEach((b) => { b.className = "done"; });
          $("#status").textContent = "Selesai mendengarkan! Masya Allah 🎉";
          $("#pause").textContent = "↻ Putar lagi";
          return;
        }
        const item = queue[idx];
        const ayah = s.ayahs[item.a - 1];
        show(item);
        playAndWait(ayahUrl(s.id, item.a), 1500 + ayah.words.length * 700, () => paused).then(() => {
          if (myRun !== runId) return;
          idx++;
          setTimeout(step, 700);
        });
      }
      on("#pause", () => {
        const btn = $("#pause");
        if (done) { done = false; idx = 0; btn.textContent = "⏸ Jeda"; step(); return; }
        paused = !paused;
        btn.textContent = paused ? "▶ Lanjutkan" : "⏸ Jeda";
        if (paused) audio.pause();
        else if (waiting) { waiting = false; step(); }
        else if (audio.src && !audio.ended) audio.play().catch(() => {});
      });
      on("#setup", () => listenSetup(ses, cfg));
      on("#next", () => go(ses, 2, () => learnWords(ses, 0)));
      step();
    });
  }

  // ---- 3. Kenali Kata ----
  function learnWords(ses, a) {
    const { s } = ses;
    const ayah = s.ayahs[a];
    const seen = new Set();
    let words = "";
    ayah.words.forEach((w, i) => { words += `<button class="word" data-w="${i}">${esc(w[0])}</button>`; });

    render(`${topbar(stageLabel(3, s), "Ketuk tiap kata", `Ayat ${a + 1}/${s.ayahs.length}`)}
      ${progressBar(s.ayahs.length, a)}
      <div class="card">
        <div class="words">${words}</div>
        <div class="meaning" id="meaning"><span class="hint">👆 Ketuk kata Arab untuk melihat artinya</span></div>
      </div>
      <p class="translation" id="tr">Arti ayat muncul setelah semua kata diketuk.</p>
      <div class="story-talk"><div class="mascot">${MASCOT}</div>
        <div class="bubble" id="count">Kata yang sudah dikenal: 0/${ayah.words.length}</div></div>
      <div class="spacer"></div>
      <div class="row">
        <button class="btn secondary" id="listen">▶ Dengar ayat</button>
        <button class="btn" id="next" disabled>${a < s.ayahs.length - 1 ? "Ayat berikutnya ›" : endLabel(ses, "Buka Harta Terpendam ›")}</button>
      </div>`, () => {
      bindBack(() => exit(ses));
      on("#listen", () => play(ayahUrl(s.id, a + 1)));
      $$(".word").forEach((el) => el.addEventListener("click", () => {
        const i = Number(el.dataset.w);
        $$(".word").forEach((x) => x.classList.remove("active"));
        el.classList.add("active", "seen");
        seen.add(i);
        $("#meaning").innerHTML = `<div><span class="tag">${esc(ayah.words[i][1])}</span><p class="latin">${esc(ayah.words[i][2])}</p></div>`;
        $("#count").textContent = `Kata yang sudah dikenal: ${seen.size}/${ayah.words.length}`;
        play(wordUrl(s.id, a + 1, i + 1));
        if (seen.size === ayah.words.length) {
          $("#next").disabled = false;
          const tr = $("#tr");
          tr.innerHTML = `<span class="latin">${esc(latin(ayah))}</span><br>${esc(ayah.tr)}`;
          tr.classList.add("show");
          $("#count").textContent = "Hebat! Semua kata sudah kamu kenal 🎉";
        }
      }));
      on("#next", () => a < s.ayahs.length - 1 ? learnWords(ses, a + 1) : go(ses, 3, () => treasure(ses)));
    });
  }

  // ---- 4. Harta Terpendam / Tahukah Kamu ----
  function treasure(ses, idx = 0) {
    const { s } = ses;
    const t = s.treasure;
    let advice = "";
    t.advice.forEach((x) => { advice += `<li>${esc(x)}</li>`; });
    const slides = [
      { art: "📜", title: `Pesan surat ${s.name}`, body: `<p>${esc(t.message)}</p>`, talk: "Ini pesan penting dari surat yang baru kamu pelajari." },
      { art: "💡", title: "Nasihat untukmu", body: `<ul>${advice}</ul>`, talk: "Yuk, kita amalkan bersama!" },
      { art: "🤔", title: "Tahukah Kamu?", body: `<p>${esc(t.fact)}</p>`, talk: "Ada fakta menarik nih!", fact: true }
    ];
    const sl = slides[idx];
    const last = idx === slides.length - 1;
    let dots = "";
    slides.forEach((_, i) => { dots += `<i class="${i === idx ? "on" : ""}"></i>`; });
    const lastTalk = ses.free ? "Semoga bermanfaat! Simpan harta ini di hatimu ya." : "Sudah siap? Saatnya kuis! Ada 4 kuis menunggumu.";

    render(`${topbar(stageLabel(4, s), "Harta Terpendam", `${idx + 1}/${slides.length}`)}
      ${progressBar(slides.length, idx)}
      <div class="treasure-art" aria-hidden="true">${sl.art}</div>
      <div class="card treasure ${sl.fact ? "fact" : ""}">
        <h3>${esc(sl.title)}</h3>
        ${sl.body}
      </div>
      <div class="story-talk"><div class="mascot">${MASCOT}</div>
        <div class="bubble"><div class="dots">${dots}</div>${esc(last ? lastTalk : sl.talk)}</div></div>
      <div class="spacer"></div>
      <div class="row">
        <button class="btn secondary" id="prev" ${idx === 0 ? "disabled" : ""}>‹ Sebelumnya</button>
        <button class="btn ${last ? "coral" : ""}" id="next">${last ? endLabel(ses, "Mulai kuis ›") : "Lanjut ›"}</button>
      </div>`, () => {
      bindBack(() => exit(ses));
      on("#prev", () => { if (idx > 0) treasure(ses, idx - 1); });
      on("#next", () => last ? go(ses, 4, () => quizNextAyah(ses)) : treasure(ses, idx + 1));
    });
  }

  /** Markup pilihan jawaban; pilihan yang punya audio mendapat tombol 🔊 di sampingnya. */
  function optionsHtml(q, opts) {
    const optClass = q.optionClass || (q.arabicOptions ? "ar" : "");
    let html = "";
    opts.forEach((o, i) => {
      const btn = `<button class="option ${optClass}" data-i="${i}">${o.html}</button>`;
      html += o.audio
        ? `<div class="opt-row">${btn}<button class="icon-btn opt-play" data-play="${i}" aria-label="Dengar pilihan ini">🔊</button></div>`
        : btn;
    });
    return html;
  }

  // ---- Mesin kuis pilihan ganda (dipakai tahap 5, 6, 8) ----
  // q = { prompt, audio, autoplay, options: [{ html, correct }], arabicOptions, onCorrect }
  function mcQuiz(ses, stage, title, questions, qi, next) {
    const { s } = ses;
    const q = questions[qi];
    const opts = shuffle(q.options);
    let html = "";
    html = optionsHtml(q, opts);

    render(`${topbar(stageLabel(stage, s), title, `${qi + 1}/${questions.length}`)}
      ${progressBar(questions.length, qi)}
      <div class="card question">
        ${q.prompt}
        ${q.audio ? '<button class="btn secondary small" id="listen">▶ Dengar ayatnya</button>' : ""}
      </div>
      <div class="options">${html}</div>
      <div class="spacer"></div>
      <button class="btn" id="next" disabled>Lanjut ›</button>`, () => {
      bindBack(() => exit(ses));
      if (q.audio) {
        on("#listen", () => play(q.audio));
        if (q.autoplay) play(q.audio);
      }
      $$("[data-play]").forEach((b) => b.addEventListener("click", () => play(opts[Number(b.dataset.play)].audio)));
      let solved = false;
      const rec = beginQ(ses, stage, q.label);
      $$(".option").forEach((el) => el.addEventListener("click", () => {
        if (solved) return;
        if (opts[Number(el.dataset.i)].correct) {
          solved = true;
          el.classList.add("right");
          $("#next").disabled = false;
          toast("✅ Benar! Masya Allah!");
          if (q.onCorrect) q.onCorrect();
        } else {
          wrongQ(ses, stage, rec);
          el.classList.remove("wrong"); void el.offsetWidth; el.classList.add("wrong");
          toast("Hampir! Coba lagi 🙂");
        }
      }));
      on("#next", () => qi < questions.length - 1 ? mcQuiz(ses, stage, title, questions, qi + 1, next) : next());
    });
  }

  // ---- 5. Kuis Lanjut Ayat ----
  /** Ayat yang bisa ditanya "ayat berikutnya": bukan ayat terakhir, dan bukan ayat kembar
   *  (teks sama di tempat lain, mis. Al-Muthaffifin 9 & 20) karena lanjutannya ambigu. */
  function candsNext(s) {
    const texts = s.ayahs.map(arText);
    return s.ayahs.map((_, i) => i).slice(0, -1)
      .filter((i) => texts.indexOf(texts[i]) === texts.lastIndexOf(texts[i]));
  }
  function buildNextQ(s, a) {
    // pilihan berupa rujukan ayat {sid, n, ayah} agar bisa tampil transliterasi & audionya
    const ref = (x, i) => ({ sid: x.id, n: i + 1, ayah: x.ayahs[i] });
    const correct = ref(s, a + 1);
    const same = s.ayahs.map((_, i) => ref(s, i)).filter((r) => r.n - 1 !== a && r.n - 1 !== a + 1);
    const others = otherSurahs(s).flatMap((x) => x.ayahs.map((_, i) => ref(x, i)));
    // ayat hampir kembar dengan jawaban (mis. Al-Insyirah 5 & 6) tidak dijadikan pengecoh
    const wrong = distractors(correct, same, others, 2, (r) => coreText(r.ayah));
    const opt = (r, ok) => ({
      html: `<span class="opt-ar">${esc(arText(r.ayah))}</span><span class="opt-lt">${esc(latin(r.ayah))}</span>`,
      audio: ayahUrl(r.sid, r.n),
      correct: ok
    });
    return {
      label: `Ayat ${a + 1} → ${a + 2}`,
      prompt: `<p class="q-label">Dengarkan ayat ${a + 1}. Ayat berikutnya adalah…</p>
        <p class="arabic">${esc(arText(s.ayahs[a]))}</p>
        <p class="latin">${esc(latin(s.ayahs[a]))}</p>`,
      audio: ayahUrl(s.id, a + 1),
      autoplay: true,
      optionClass: "ayah-opt",
      options: [opt(correct, true)].concat(wrong.map((w) => opt(w, false))),
      onCorrect: () => play(ayahUrl(s.id, a + 2))
    };
  }
  function quizNextAyah(ses) {
    const { s } = ses;
    const qs = pickIdx(candsNext(s), quizCount(ses, "next")).map((a) => buildNextQ(s, a));
    mcQuiz(ses, 5, "Pilih ayat berikutnya", qs, 0, () => go(ses, 5, () => quizMissingWord(ses)));
  }

  // ---- 6. Kuis Kata yang Hilang ----
  /** Ayat dengan minimal 2 kata (dipakai Kata yang Hilang & Susun Ayat). */
  const candsMultiWord = (s) => s.ayahs.map((_, i) => i).filter((i) => s.ayahs[i].words.length >= 2);
  function buildMissingQ(s, a) {
    const ayah = s.ayahs[a];
    const blank = Math.floor(Math.random() * ayah.words.length);
    const correct = ayah.words[blank][0];
    // jangan pakai kata yang masih terlihat di ayat ini sebagai pengecoh
    const visible = ayah.words.map((w) => w[0]);
    const same = s.ayahs.flatMap((x) => x.words.map((w) => w[0])).filter((w) => !visible.includes(w));
    const others = otherSurahs(s).flatMap((x) => x.ayahs.flatMap((y) => y.words.map((w) => w[0])));
    const wrong = distractors(correct, same, others.filter((w) => !visible.includes(w)), 2);
    const ar = ayah.words.map((w, i) => i === blank ? '<span class="blank">؟</span>' : esc(w[0])).join(" ");
    const lt = ayah.words.map((w, i) => i === blank ? '<span class="blank">___</span>' : esc(w[2])).join(" ");
    const reveal = () => {
      $("#q-ar").textContent = arText(ayah);
      $("#q-lt").textContent = latin(ayah);
      $("#q-tr").textContent = ayah.tr;
      $("#q-tr").classList.add("show");
    };
    return {
      label: `Ayat ${a + 1}`,
      prompt: `<p class="q-label">Ayat ${a + 1}: kata apa yang hilang?</p>
        <p class="arabic" id="q-ar">${ar}</p>
        <p class="latin" id="q-lt">${lt}</p>
        <p class="translation" id="q-tr">🔒 Arti ayat muncul setelah jawabanmu benar</p>`,
      audio: ayahUrl(s.id, a + 1),
      autoplay: false,
      arabicOptions: true,
      options: [{ html: esc(correct), correct: true }].concat(wrong.map((w) => ({ html: esc(w), correct: false }))),
      reveal,
      onCorrect: () => { reveal(); play(wordUrl(s.id, a + 1, blank + 1)); }
    };
  }
  function quizMissingWord(ses) {
    const { s } = ses;
    const qs = pickIdx(candsMultiWord(s), quizCount(ses, "missing")).map((a) => buildMissingQ(s, a));
    mcQuiz(ses, 6, "Lengkapi ayatnya", qs, 0, () => go(ses, 6, () => startArrange(ses)));
  }

  // ---- 7. Kuis Susun Ayat ----
  function startArrange(ses) {
    const { s } = ses;
    arrange(ses, pickIdx(candsMultiWord(s), quizCount(ses, "arrange")), 0);
  }
  function arrange(ses, picks, q) {
    const { s } = ses;
    const a = picks[q];
    const ayah = s.ayahs[a];
    let order = shuffle(ayah.words.map((_, i) => i));
    // hindari urutan acak yang kebetulan sudah benar
    if (order.length > 1 && order.every((v, i) => v === i)) order.reverse();
    let bank = "";
    order.forEach((i) => { bank += `<button class="chip" data-w="${i}">${esc(ayah.words[i][0])}</button>`; });

    render(`${topbar(stageLabel(7, s), `Susun ayat ${a + 1}`, `${q + 1}/${picks.length}`)}
      ${progressBar(picks.length, q)}
      <p class="translation show">Artinya: ${esc(ayah.tr)}</p>
      <div class="slots" id="slots"></div>
      <p class="translation">Ketuk kata sesuai urutan bacaan (mulai dari kanan ➜ kiri)</p>
      <div class="bank">${bank}</div>
      <div class="spacer"></div>
      <div class="row">
        <button class="btn secondary" id="listen">▶ Contoh bacaan</button>
        <button class="btn" id="next" disabled>Lanjut ›</button>
      </div>`, () => {
      bindBack(() => exit(ses));
      on("#listen", () => play(ayahUrl(s.id, a + 1)));
      const rec = beginQ(ses, 7, `Ayat ${a + 1}`);
      let pos = 0;
      $$(".chip").forEach((el) => el.addEventListener("click", () => {
        if (el.classList.contains("used") || pos >= ayah.words.length) return;
        const i = Number(el.dataset.w);
        // bandingkan teks, karena satu ayat bisa memuat kata yang sama dua kali
        if (ayah.words[i][0] === ayah.words[pos][0]) {
          el.classList.add("used");
          $("#slots").insertAdjacentHTML("beforeend", `<span class="placed">${esc(ayah.words[pos][0])}</span>`);
          pos++;
          if (pos === ayah.words.length) {
            $("#next").disabled = false;
            toast("🎉 Ayatnya tersusun rapi!");
            play(ayahUrl(s.id, a + 1));
          }
        } else {
          wrongQ(ses, 7, rec);
          el.classList.remove("wrong"); void el.offsetWidth; el.classList.add("wrong");
        }
      }));
      on("#next", () => q < picks.length - 1 ? arrange(ses, picks, q + 1) : go(ses, 7, () => quizMeaning(ses)));
    });
  }

  // ---- 8. Kuis Pahami Arti ----
  const candsAll = (s) => s.ayahs.map((_, i) => i);
  function buildMeaningQ(s, a) {
    // pengecoh dipilih per ayat dan dibedakan dengan coreText, supaya arti ayat (hampir)
    // kembar tidak muncul dua kali atau bersaing dengan jawaban (mis. Al-Insyirah 5 & 6)
    const correctAyah = s.ayahs[a];
    const same = s.ayahs.filter((x) => x !== correctAyah);
    const others = otherSurahs(s).flatMap((x) => x.ayahs);
    const wrong = distractors(correctAyah, same, others, 2, coreText).map((x) => x.tr);
    return {
      label: `Ayat ${a + 1}`,
      prompt: `<p class="q-label">Dengarkan, lalu pilih artinya</p>
        <p class="arabic">${esc(arText(correctAyah))}</p>`,
      audio: ayahUrl(s.id, a + 1),
      autoplay: true,
      options: [{ html: esc(correctAyah.tr), correct: true }].concat(wrong.map((w) => ({ html: esc(w), correct: false })))
    };
  }
  function quizMeaning(ses) {
    const { s } = ses;
    const qs = pickIdx(candsAll(s), quizCount(ses, "meaning")).map((a) => buildMeaningQ(s, a));
    mcQuiz(ses, 8, "Pilih arti yang benar", qs, 0, () => go(ses, 8, () => result(ses)));
  }

  // ---- 9. Laporan ----
  function result(ses) {
    const { s, mistakes, questions } = ses;
    // bintang berdasarkan rata-rata kesalahan per soal
    const ratio = mistakes / Math.max(1, questions);
    const stars = ratio <= 0.2 ? 3 : ratio <= 0.6 ? 2 : 1;
    const isNew = starsOf(s) === 0;
    progress[s.id] = { stars: Math.max(stars, starsOf(s)) };
    save(SAVE_KEY, progress);

    let starHtml = "";
    for (let i = 0; i < 3; i++) starHtml += `<span class="${i < stars ? "" : "off"}">⭐</span>`;
    const msg = stars === 3 ? "Sempurna! Masya Allah!" : stars === 2 ? "Bagus sekali! Ulangi lagi untuk 3 bintang." : "Sudah selesai! Yuk ulangi biar makin lancar.";

    render(`<section class="screen result">
      <small class="stage-tag">Tahap 9/9 · Laporan · ${esc(s.name)}</small>
      <h2>Pulau ${esc(s.place)} selesai!</h2>
      <div class="big-stars">${starHtml}</div>
      <p>${msg}<br><small>${questions} soal · ${mistakes}× salah</small></p>
      <h3 class="report-title">📊 Laporan kuis</h3>
      ${reportHtml(ses.stats, QUIZ_STAGES)}
      <div class="card reward">
        <small>${isNew ? "Harta laut baru!" : "Harta laut dari pulau ini"}</small>
        <div class="emo">${s.reward.emoji}</div>
        <b>${esc(s.reward.name)}</b>
        <p style="color:var(--muted)">${esc(s.reward.desc)}</p>
      </div>
      <div class="spacer"></div>
      <button class="btn" id="map">⛵ Lanjut berlayar</button>
      <button class="btn secondary" id="again">↻ Ulangi surat ini</button>
    </section>`, () => {
      on("#map", map);
      on("#again", () => startSurah(s));
    });
  }

  // =====================================================================
  // PENJELAJAHAN CERDAS
  // Pilih surat, jenis kuis, dan rentang ayat. Satu soal per ayat, berurutan.
  // Jawaban salah → jawaban benar ditunjukkan sebentar, ayat ditandai "belum bisa",
  // lalu langsung lanjut. Setelah ayat terakhir, ayat yang belum bisa diulang
  // (putaran berikutnya) sampai semuanya benar.
  // =====================================================================
  const SMART_KINDS = {
    next: { name: "Lanjut Ayat", emoji: "➡️", cands: candsNext, build: buildNextQ, title: "Pilih ayat berikutnya" },
    missing: { name: "Kata yang Hilang", emoji: "🧩", cands: candsMultiWord, build: buildMissingQ, title: "Lengkapi ayatnya" },
    arrange: { name: "Susun Ayat", emoji: "🔤", cands: candsMultiWord, build: null, title: "Susun ayatnya" },
    meaning: { name: "Pahami Arti", emoji: "💬", cands: candsAll, build: buildMeaningQ, title: "Pilih arti yang benar" }
  };
  const SMART_DELAY_RIGHT = 1000; // jeda sebelum soal berikutnya (ms)
  const SMART_DELAY_WRONG = 1800;
  /** Ayat (indeks) dalam rentang yang bisa dijadikan soal untuk jenis kuis ini. */
  const smartEligible = (s, kind, from, to) =>
    SMART_KINDS[kind].cands(s).filter((i) => i >= from - 1 && i <= to - 1);

  function smartSetup(prev) {
    const saved = prev || load(SMART_KEY, null) || {};
    let si = Math.max(0, SURAHS.findIndex((x) => x.id === saved.sid));
    const cfg = {
      kind: SMART_KINDS[saved.kind] ? saved.kind : "next",
      from: saved.from || 1,
      to: saved.to || SURAHS[si].ayahs.length
    };
    const clampRange = () => {
      const n = SURAHS[si].ayahs.length;
      cfg.from = Math.min(Math.max(1, cfg.from), n);
      cfg.to = Math.min(Math.max(cfg.from, cfg.to), n);
    };
    clampRange();

    let surahOpts = "";
    SURAHS.forEach((x, i) => { surahOpts += `<option value="${i}">${esc(x.name)} (${x.ayahs.length} ayat)</option>`; });
    let kindBtns = "";
    Object.keys(SMART_KINDS).forEach((k) => {
      kindBtns += `<button class="kind" data-kind="${k}"><span>${SMART_KINDS[k].emoji}</span>${esc(SMART_KINDS[k].name)}</button>`;
    });

    render(`${topbar("Penjelajahan Cerdas", "Atur penjelajahan")}
      <div class="story-talk"><div class="mascot">${MASCOT}</div>
        <div class="bubble">Pilih surat dan ayatnya. Ayat yang belum bisa akan kita ulang sampai benar semua!</div></div>
      <div class="card settings">
        <h3>📖 Surat</h3>
        <select id="surah" class="select">${surahOpts}</select>
        <h3>🎯 Jenis kuis</h3>
        <div class="kinds">${kindBtns}</div>
        <h3>🔢 Rentang ayat</h3>
        <div class="stepper"><span>Mulai ayat</span><div class="stepper-ctl">
          <button class="icon-btn" data-step="from" data-d="-1" aria-label="Kurangi">−</button>
          <select id="from" class="select small"></select>
          <button class="icon-btn" data-step="from" data-d="1" aria-label="Tambah">+</button></div></div>
        <div class="stepper"><span>Sampai ayat</span><div class="stepper-ctl">
          <button class="icon-btn" data-step="to" data-d="-1" aria-label="Kurangi">−</button>
          <select id="to" class="select small"></select>
          <button class="icon-btn" data-step="to" data-d="1" aria-label="Tambah">+</button></div></div>
        <p class="translation" id="summary"></p>
      </div>
      <div class="spacer"></div>
      <button class="btn smart" id="go">🧠 Mulai menjelajah</button>`, () => {
      bindBack(home);
      const sel = $("#surah");
      sel.value = String(si);
      const fillAyahSelects = () => {
        const n = SURAHS[si].ayahs.length;
        let o = "";
        for (let i = 1; i <= n; i++) o += `<option value="${i}">${i}</option>`;
        $("#from").innerHTML = o;
        $("#to").innerHTML = o;
      };
      const refresh = () => {
        clampRange();
        $("#from").value = String(cfg.from);
        $("#to").value = String(cfg.to);
        $$(".kind").forEach((b) => b.classList.toggle("on", b.dataset.kind === cfg.kind));
        const count = smartEligible(SURAHS[si], cfg.kind, cfg.from, cfg.to).length;
        const total = cfg.to - cfg.from + 1;
        let note = "";
        if (count < total) {
          note = cfg.kind === "next"
            ? " (ayat terakhir surat & ayat kembar tidak bisa ditanya lanjutannya)"
            : " (ayat yang hanya satu kata dilewati)";
        }
        $("#summary").textContent = count
          ? `${count} soal, satu untuk tiap ayat${note}.`
          : "Tidak ada ayat yang bisa dijadikan soal untuk jenis kuis ini. Coba ubah rentang ayatnya.";
        $("#go").disabled = count === 0;
      };
      fillAyahSelects();
      refresh();
      sel.addEventListener("change", () => {
        si = Number(sel.value);
        cfg.from = 1;
        cfg.to = SURAHS[si].ayahs.length;
        fillAyahSelects();
        refresh();
      });
      $("#from").addEventListener("change", () => {
        cfg.from = Number($("#from").value);
        if (cfg.to < cfg.from) cfg.to = cfg.from;
        refresh();
      });
      $("#to").addEventListener("change", () => {
        cfg.to = Number($("#to").value);
        if (cfg.from > cfg.to) cfg.from = cfg.to;
        refresh();
      });
      $$("[data-step]").forEach((b) => b.addEventListener("click", () => {
        const key = b.dataset.step;
        cfg[key] += Number(b.dataset.d);
        if (key === "from" && cfg.from > cfg.to) cfg.to = cfg.from;
        if (key === "to" && cfg.to < cfg.from) cfg.from = Math.max(1, cfg.to);
        refresh();
      }));
      $$(".kind").forEach((b) => b.addEventListener("click", () => { cfg.kind = b.dataset.kind; refresh(); }));
      on("#go", () => {
        const s = SURAHS[si];
        const saveCfg = { sid: s.id, kind: cfg.kind, from: cfg.from, to: cfg.to };
        save(SMART_KEY, saveCfg);
        smartStart(saveCfg);
      });
    });
  }

  function smartStart(cfg) {
    const s = SURAHS.find((x) => x.id === cfg.sid);
    const ayahs = smartEligible(s, cfg.kind, cfg.from, cfg.to);
    const st = {
      s, cfg, kind: cfg.kind, ayahs,
      status: {}, // indeks ayat → "todo" | "ok" | "bad"
      wrong: {}, // indeks ayat → berapa kali salah
      queue: ayahs.slice(), qi: 0, round: 1, answers: 0, mistakes: 0
    };
    ayahs.forEach((a) => { st.status[a] = "todo"; st.wrong[a] = 0; });
    smartQuestion(st);
  }

  /** Deretan nomor ayat: hijau = sudah bisa, merah = belum bisa, abu-abu = belum dicoba. */
  function smartTracker(st, current) {
    let h = '<div class="tracker" aria-label="Status ayat">';
    st.ayahs.forEach((a) => {
      h += `<span class="t-dot ${st.status[a]} ${a === current ? "now" : ""}">${a + 1}</span>`;
    });
    return h + "</div>";
  }

  function smartHeader(st, a) {
    const k = SMART_KINDS[st.kind];
    const okCount = st.ayahs.filter((x) => st.status[x] === "ok").length;
    return `${topbar(`Penjelajahan Cerdas · ${k.name} · ${st.s.name}`, `Putaran ${st.round} · Ayat ${a + 1}`, `${st.qi + 1}/${st.queue.length}`)}
      ${smartTracker(st, a)}
      <p class="status">✅ ${okCount} dari ${st.ayahs.length} ayat sudah bisa</p>`;
  }

  function smartAnswer(st, a, right) {
    st.answers++;
    if (right) {
      st.status[a] = "ok";
    } else {
      st.status[a] = "bad";
      st.wrong[a]++;
      st.mistakes++;
    }
    const myRun = runId;
    setTimeout(() => { if (myRun === runId) smartNext(st); }, right ? SMART_DELAY_RIGHT : SMART_DELAY_WRONG);
  }

  function smartNext(st) {
    st.qi++;
    if (st.qi < st.queue.length) { smartQuestion(st); return; }
    const left = st.ayahs.filter((a) => st.status[a] !== "ok");
    if (!left.length) { smartDone(st); return; }
    smartRoundBreak(st, left);
  }

  function smartQuestion(st) {
    if (st.kind === "arrange") { smartArrange(st); return; }
    const { s } = st;
    const a = st.queue[st.qi];
    const q = SMART_KINDS[st.kind].build(s, a);
    const opts = shuffle(q.options);
    render(`${smartHeader(st, a)}
      <div class="card question">
        ${q.prompt}
        ${q.audio ? '<button class="btn secondary small" id="listen">▶ Dengar ayatnya</button>' : ""}
      </div>
      <div class="options">${optionsHtml(q, opts)}</div>`, () => {
      bindBack(() => smartSetup());
      if (q.audio) {
        on("#listen", () => play(q.audio));
        if (q.autoplay) play(q.audio);
      }
      $$("[data-play]").forEach((b) => b.addEventListener("click", () => play(opts[Number(b.dataset.play)].audio)));
      let answered = false;
      $$(".option").forEach((el) => el.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const right = opts[Number(el.dataset.i)].correct;
        $$(".option").forEach((x) => { x.disabled = true; });
        if (right) {
          el.classList.add("right");
          toast("✅ Benar!");
        } else {
          el.classList.add("wrong");
          // tunjukkan jawaban yang benar, lalu langsung lanjut
          $$(".option").forEach((x) => { if (opts[Number(x.dataset.i)].correct) x.classList.add("right"); });
          toast("Belum tepat. Ayat ini kita ulang nanti 🔁");
        }
        if (q.reveal) q.reveal();
        smartAnswer(st, a, right);
      }));
    });
  }

  function smartArrange(st) {
    const { s } = st;
    const a = st.queue[st.qi];
    const ayah = s.ayahs[a];
    let order = shuffle(ayah.words.map((_, i) => i));
    if (order.length > 1 && order.every((v, i) => v === i)) order.reverse();
    let bank = "";
    order.forEach((i) => { bank += `<button class="chip" data-w="${i}">${esc(ayah.words[i][0])}</button>`; });
    render(`${smartHeader(st, a)}
      <p class="translation show">Artinya: ${esc(ayah.tr)}</p>
      <div class="slots" id="slots"></div>
      <p class="translation">Ketuk kata sesuai urutan bacaan (mulai dari kanan ➜ kiri)</p>
      <div class="bank">${bank}</div>
      <div class="spacer"></div>
      <button class="btn secondary" id="listen">▶ Contoh bacaan</button>`, () => {
      bindBack(() => smartSetup());
      on("#listen", () => play(ayahUrl(s.id, a + 1)));
      let pos = 0, finished = false;
      $$(".chip").forEach((el) => el.addEventListener("click", () => {
        if (finished || el.classList.contains("used")) return;
        const i = Number(el.dataset.w);
        if (ayah.words[i][0] === ayah.words[pos][0]) {
          el.classList.add("used");
          $("#slots").insertAdjacentHTML("beforeend", `<span class="placed">${esc(ayah.words[pos][0])}</span>`);
          pos++;
          if (pos === ayah.words.length) {
            finished = true;
            toast("✅ Benar!");
            smartAnswer(st, a, true);
          }
        } else {
          finished = true;
          el.classList.add("wrong");
          // tampilkan sisa ayat yang benar, lalu langsung lanjut
          ayah.words.slice(pos).forEach((w) => {
            $("#slots").insertAdjacentHTML("beforeend", `<span class="placed missed">${esc(w[0])}</span>`);
          });
          $$(".chip").forEach((x) => { x.disabled = true; });
          toast("Belum tepat. Ayat ini kita ulang nanti 🔁");
          smartAnswer(st, a, false);
        }
      }));
    });
  }

  function smartRoundBreak(st, left) {
    const okCount = st.ayahs.length - left.length;
    render(`${topbar(`Penjelajahan Cerdas · ${SMART_KINDS[st.kind].name} · ${st.s.name}`, `Putaran ${st.round} selesai`)}
      ${smartTracker(st, -1)}
      <div class="story-art small" aria-hidden="true">🔁</div>
      <div class="story-talk"><div class="mascot">${MASCOT}</div>
        <div class="bubble">${okCount ? `Hebat, ${okCount} ayat sudah bisa! ` : ""}Masih ada <b>${left.length} ayat</b> yang belum: ayat ${left.map((x) => x + 1).join(", ")}. Yuk, kita ulang sampai bisa!</div></div>
      <div class="spacer"></div>
      <button class="btn smart" id="go">Mulai putaran ${st.round + 1} ›</button>`, () => {
      bindBack(() => smartSetup());
      on("#go", () => {
        st.round++;
        st.queue = left;
        st.qi = 0;
        smartQuestion(st);
      });
    });
  }

  function smartDone(st) {
    const first = st.ayahs.filter((a) => st.wrong[a] === 0).length;
    let rows = "";
    st.ayahs.forEach((a) => {
      const w = st.wrong[a];
      rows += `<tr><td>Ayat ${a + 1}</td><td class="${w ? "bad" : "good"}">${w ? `salah ${w}×` : "✓"}</td><td>${w ? `putaran ${w + 1}` : "langsung bisa"}</td></tr>`;
    });
    render(`<section class="screen result">
      <small class="stage-tag">Penjelajahan Cerdas · ${esc(SMART_KINDS[st.kind].name)} · ${esc(st.s.name)}</small>
      <h2>Semua ayat sudah bisa! 🎉</h2>
      <div class="big-stars">🧠</div>
      <p>Ayat ${st.cfg.from}–${st.cfg.to} · ${st.round} putaran<br>
        <small>${st.answers} jawaban · ${first} ayat langsung bisa · ${st.mistakes}× salah</small></p>
      <div class="card report">
        <table>
          <thead><tr><th>Ayat</th><th>Salah</th><th>Bisa di</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="spacer"></div>
      <button class="btn smart" id="again">↻ Jelajahi lagi</button>
      <button class="btn secondary" id="setup">⚙️ Ubah pengaturan</button>
      <button class="btn secondary" id="home">🏠 Beranda</button>
    </section>`, () => {
      on("#again", () => smartStart(st.cfg));
      on("#setup", () => smartSetup(st.cfg));
      on("#home", home);
    });
  }

  // =====================================================================
  // KOLEKSI
  // =====================================================================
  function collection() {
    let cards = "";
    SURAHS.forEach((s) => {
      cards += starsOf(s)
        ? `<div class="card"><div class="emo">${s.reward.emoji}</div><b>${esc(s.reward.name)}</b><small>dari ${esc(s.place)}</small></div>`
        : `<div class="card locked"><div class="emo">❔</div><b>???</b><small>Selesaikan ${esc(s.name)}</small></div>`;
    });
    const owned = SURAHS.filter((s) => starsOf(s)).length;
    render(`${topbar("Koleksi", "Harta Laut", `${owned}/${SURAHS.length}`)}
      <p>Oleh-oleh dari setiap pulau yang sudah kamu selesaikan.</p>
      <div class="grid">${cards}</div>`, () => bindBack(home));
  }

  home();
})();
