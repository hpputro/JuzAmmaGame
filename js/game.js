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
    "Kuis Lanjut Ayat", "Kuis Kata yang Hilang", "Kuis Susun Ayat", "Kuis Pahami Arti"];

  // ---------- penyimpanan (aman bila storage diblokir) ----------
  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* abaikan */ }
  }
  const progress = load(SAVE_KEY, {}); // { [surahId]: { stars: n } }
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
  const latin = (ayah) => ayah.words.map((w) => w[2]).join(" ");

  /** Jumlah soal kuis = separuh jumlah ayat (dibulatkan ke atas), minimal 2, maksimal 10. */
  const quizCount = (ayahCount) => Math.min(10, Math.max(2, Math.ceil(ayahCount / 2)));
  /** Kuis Lanjut Ayat dipecah menjadi beberapa bagian bila surat lebih dari 20 ayat.
   *  Bagian dibuat sama rata (mis. 36 ayat → ayat 1–18 dan 19–36). */
  function nextAyahParts(s) {
    const n = s.ayahs.length;
    const count = Math.ceil(n / 20);
    const size = Math.ceil(n / count);
    const parts = [];
    for (let from = 1; from <= n; from += size) parts.push({ from, to: Math.min(n, from + size - 1) });
    return parts;
  }
  /** Ambil n indeks acak dari kandidat, lalu urutkan sesuai urutan ayat. */
  const pickIdx = (candidates, n) => shuffle(candidates).slice(0, n).sort((x, y) => x - y);
  /** Pengecoh unik: utamakan dari surat yang sama, bila kurang ambil dari surat lain. */
  function distractors(correct, samePool, otherPool, k) {
    const out = [];
    for (const v of shuffle(samePool).concat(shuffle(otherPool))) {
      if (out.length >= k) break;
      if (v !== correct && !out.includes(v)) out.push(v);
    }
    return out;
  }
  const otherSurahs = (s) => SURAHS.filter((x) => x !== s);

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
  const stageLabel = (k, s, name) => `Tahap ${k}/${STAGES.length} · ${name || STAGES[k - 1]} · ${s.name}`;
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
      <button class="btn menu" id="start">⛵ Mulai Berlayar<small>Jelajahi pulau satu per satu</small></button>
      <button class="btn coral menu" id="free">🧭 Pelayaran Mandiri<small>Semua surat &amp; aktivitas terbuka</small></button>
      <button class="btn secondary menu" id="coll">🧺 Harta Laut<small>Koleksi oleh-oleh dari tiap pulau</small></button>
    </section>`, () => {
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

  /** Daftar aktivitas sebuah surat; Kuis Lanjut Ayat dipecah per bagian bila > 20 ayat. */
  function activitiesFor(s) {
    const list = [];
    ACTIVITIES.forEach((a, i) => {
      const stage = i + 1;
      const parts = stage === 5 ? nextAyahParts(s) : [null];
      parts.forEach((pt, pi) => {
        const name = parts.length > 1 ? `${STAGES[i]} (${pi + 1})` : STAGES[i];
        list.push({
          emoji: a.emoji,
          name,
          label: `${stage}. ${name}`,
          desc: parts.length > 1 ? `Ayat ${pt.from}–${pt.to} · ${a.desc}` : a.desc,
          start: parts.length > 1 ? (ses) => quizNextAyah(ses, pi) : a.start
        });
      });
    });
    return list;
  }
  function startActivity(s, act) {
    act.start({ s, mistakes: 0, questions: 0, free: true, activity: act });
  }

  function activityMenu(s) {
    const acts = activitiesFor(s);
    let list = "";
    acts.forEach((a, i) => {
      list += `<button class="activity" data-i="${i}">
        <span class="emo">${a.emoji}</span>
        <span><b>${esc(a.label)}</b><small>${esc(a.desc)}</small></span>
      </button>`;
    });
    render(`${topbar("Pelayaran Mandiri", `Surat ${s.name}`)}
      <p>Pilih aktivitas. Tidak harus berurutan!</p>
      <div class="free-list">${list}</div>`, () => {
      bindBack(freeMap);
      $$(".activity").forEach((el) => el.addEventListener("click", () => startActivity(s, acts[Number(el.dataset.i)])));
    });
  }

  /** Pindah ke tahap berikutnya (mode berlayar) atau selesaikan aktivitas (mode mandiri). */
  function go(ses, finishedStage, nextFn) {
    if (!ses.free) { nextFn(); return; }
    if (finishedStage >= 5) { freeQuizDone(ses); return; }
    activityMenu(ses.s);
    toast(`✅ ${ses.activity.name} selesai!`);
  }
  /** Label tombol penutup aktivitas: di mode mandiri menjadi "Selesai". */
  const endLabel = (ses, text, freeText) => ses.free ? (freeText || "Selesai ✓") : text;
  /** Tombol kembali: ke peta (mode berlayar) atau ke menu aktivitas (mode mandiri). */
  function exit(ses) { return ses.free ? activityMenu(ses.s) : map(); }

  function freeQuizDone(ses) {
    const { s, mistakes, questions, activity } = ses;
    render(`<section class="screen result">
      <h2>${esc(activity.name)} selesai!</h2>
      <div class="big-stars">${mistakes === 0 ? "🏆" : "👍"}</div>
      <p>${mistakes === 0 ? "Tanpa kesalahan! Masya Allah!" : "Bagus! Terus berlatih ya."}<br>
        <small>Surat ${esc(s.name)} · ${questions} soal · ${mistakes} kesalahan</small></p>
      <div class="spacer"></div>
      <button class="btn" id="again">↻ Ulangi kuis ini</button>
      <button class="btn secondary" id="menu">Pilih aktivitas lain</button>
    </section>`, () => {
      on("#again", () => startActivity(s, activity));
      on("#menu", () => activityMenu(s));
    });
  }

  // =====================================================================
  // ALUR SATU SURAT
  // =====================================================================
  function startSurah(s) {
    const ses = { s, mistakes: 0, questions: 0 };
    story(ses, 0);
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
  function treasure(ses) {
    const { s } = ses;
    const t = s.treasure;
    let advice = "";
    t.advice.forEach((x) => { advice += `<li>${esc(x)}</li>`; });
    render(`${topbar(stageLabel(4, s), "Harta Terpendam")}
      <div class="chest" aria-hidden="true">💎</div>
      <div class="card treasure">
        <h3>📜 Pesan surat ${esc(s.name)}</h3>
        <p>${esc(t.message)}</p>
      </div>
      <div class="card treasure">
        <h3>💡 Nasihat untukmu</h3>
        <ul>${advice}</ul>
      </div>
      <div class="card treasure fact">
        <h3>🤔 Tahukah Kamu?</h3>
        <p>${esc(t.fact)}</p>
      </div>
      <div class="story-talk"><div class="mascot">${MASCOT}</div>
        <div class="bubble">${ses.free ? "Semoga bermanfaat! Simpan harta ini di hatimu ya." : "Sudah siap? Saatnya kuis! Ada 4 kuis menunggumu."}</div></div>
      <button class="btn coral" id="next">${ses.free ? "Selesai ✓" : "Mulai kuis ›"}</button>`, () => {
      bindBack(() => exit(ses));
      on("#next", () => go(ses, 4, () => quizNextAyah(ses)));
    });
  }

  // ---- Mesin kuis pilihan ganda (dipakai tahap 5, 6, 8) ----
  // q = { prompt, audio, autoplay, options: [{ html, correct }], arabicOptions, onCorrect }
  function mcQuiz(ses, stage, title, questions, qi, next, name) {
    const { s } = ses;
    const q = questions[qi];
    const opts = shuffle(q.options);
    let html = "";
    opts.forEach((o, i) => { html += `<button class="option ${q.arabicOptions ? "ar" : ""}" data-i="${i}">${o.html}</button>`; });

    render(`${topbar(stageLabel(stage, s, name), title, `${qi + 1}/${questions.length}`)}
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
      let solved = false;
      ses.questions++;
      $$(".option").forEach((el) => el.addEventListener("click", () => {
        if (solved) return;
        if (opts[Number(el.dataset.i)].correct) {
          solved = true;
          el.classList.add("right");
          $("#next").disabled = false;
          toast("✅ Benar! Masya Allah!");
          if (q.onCorrect) q.onCorrect();
        } else {
          ses.mistakes++;
          el.classList.remove("wrong"); void el.offsetWidth; el.classList.add("wrong");
          toast("Hampir! Coba lagi 🙂");
        }
      }));
      on("#next", () => qi < questions.length - 1 ? mcQuiz(ses, stage, title, questions, qi + 1, next, name) : next());
    });
  }

  // ---- 5. Kuis Lanjut Ayat ----
  function quizNextAyah(ses, part = 0) {
    const { s } = ses;
    const parts = nextAyahParts(s);
    const { from, to } = parts[part];
    const name = parts.length > 1 ? `${STAGES[4]} (${part + 1})` : STAGES[4];
    // hanya ayat di bagian ini; ayat terakhir surat tidak punya lanjutan; ayat kembar
    // (teks sama di tempat lain, mis. Al-Muthaffifin 9 & 20) dilewati karena lanjutannya ambigu
    const texts = s.ayahs.map(arText);
    const cands = s.ayahs.map((_, i) => i)
      .filter((i) => i >= from - 1 && i <= to - 1 && i < s.ayahs.length - 1)
      .filter((i) => texts.indexOf(texts[i]) === texts.lastIndexOf(texts[i]));
    const picks = pickIdx(cands, quizCount(to - from + 1));
    const qs = picks.map((a) => {
      const correct = arText(s.ayahs[a + 1]);
      const same = s.ayahs.filter((_, i) => i !== a && i !== a + 1).map(arText);
      const others = otherSurahs(s).flatMap((x) => x.ayahs.map(arText));
      const wrong = distractors(correct, same, others, 2);
      return {
        prompt: `<p class="q-label">Dengarkan ayat ${a + 1}. Ayat berikutnya adalah…</p>
          <p class="arabic">${esc(arText(s.ayahs[a]))}</p>
          <p class="latin">${esc(latin(s.ayahs[a]))}</p>`,
        audio: ayahUrl(s.id, a + 1),
        autoplay: true,
        arabicOptions: true,
        options: [{ html: esc(correct), correct: true }].concat(wrong.map((w) => ({ html: esc(w), correct: false }))),
        onCorrect: () => play(ayahUrl(s.id, a + 2))
      };
    });
    const title = parts.length > 1 ? `Pilih ayat berikutnya · ayat ${from}–${to}` : "Pilih ayat berikutnya";
    const next = part < parts.length - 1 ? () => quizNextAyah(ses, part + 1) : () => quizMissingWord(ses);
    mcQuiz(ses, 5, title, qs, 0, () => go(ses, 5, next), name);
  }

  // ---- 6. Kuis Kata yang Hilang ----
  function quizMissingWord(ses) {
    const { s } = ses;
    const cands = s.ayahs.map((_, i) => i).filter((i) => s.ayahs[i].words.length >= 2);
    const picks = pickIdx(cands, quizCount(s.ayahs.length));
    const qs = picks.map((a) => {
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
      return {
        prompt: `<p class="q-label">Ayat ${a + 1}: kata apa yang hilang?</p>
          <p class="arabic" id="q-ar">${ar}</p>
          <p class="latin" id="q-lt">${lt}</p>
          <p class="translation show">${esc(ayah.tr)}</p>`,
        audio: ayahUrl(s.id, a + 1),
        autoplay: false,
        arabicOptions: true,
        options: [{ html: esc(correct), correct: true }].concat(wrong.map((w) => ({ html: esc(w), correct: false }))),
        onCorrect: () => {
          $("#q-ar").textContent = arText(ayah);
          $("#q-lt").textContent = latin(ayah);
          play(wordUrl(s.id, a + 1, blank + 1));
        }
      };
    });
    mcQuiz(ses, 6, "Lengkapi ayatnya", qs, 0, () => go(ses, 6, () => startArrange(ses)));
  }

  // ---- 7. Kuis Susun Ayat ----
  function startArrange(ses) {
    const { s } = ses;
    const cands = s.ayahs.map((_, i) => i).filter((i) => s.ayahs[i].words.length >= 2);
    arrange(ses, pickIdx(cands, quizCount(s.ayahs.length)), 0);
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
      ses.questions++;
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
          ses.mistakes++;
          el.classList.remove("wrong"); void el.offsetWidth; el.classList.add("wrong");
        }
      }));
      on("#next", () => q < picks.length - 1 ? arrange(ses, picks, q + 1) : go(ses, 7, () => quizMeaning(ses)));
    });
  }

  // ---- 8. Kuis Pahami Arti ----
  function quizMeaning(ses) {
    const { s } = ses;
    const picks = pickIdx(s.ayahs.map((_, i) => i), quizCount(s.ayahs.length));
    const qs = picks.map((a) => {
      const correct = s.ayahs[a].tr;
      // jangan jadikan arti ayat kembar sebagai pengecoh (artinya sama)
      const same = s.ayahs.filter((x) => arText(x) !== arText(s.ayahs[a])).map((x) => x.tr);
      const others = otherSurahs(s).flatMap((x) => x.ayahs.map((y) => y.tr));
      const wrong = distractors(correct, same, others, 2);
      return {
        prompt: `<p class="q-label">Dengarkan, lalu pilih artinya</p>
          <p class="arabic">${esc(arText(s.ayahs[a]))}</p>`,
        audio: ayahUrl(s.id, a + 1),
        autoplay: true,
        options: [{ html: esc(correct), correct: true }].concat(wrong.map((w) => ({ html: esc(w), correct: false })))
      };
    });
    mcQuiz(ses, 8, "Pilih arti yang benar", qs, 0, () => go(ses, 8, () => result(ses)));
  }

  // ---- 9. Hasil ----
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
      <h2>Pulau ${esc(s.place)} selesai!</h2>
      <div class="big-stars">${starHtml}</div>
      <p>${msg}<br><small>${questions} soal · ${mistakes} kesalahan</small></p>
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
