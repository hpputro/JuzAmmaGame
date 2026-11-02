/* Pelayaran Juz Amma — prototipe sederhana.
 * Alur per surat: Kisah → Kenali Kata → Pahami Arti → Susun Ayat → Hasil.
 */
(function () {
  "use strict";

  const app = document.getElementById("app");
  const toastEl = document.getElementById("toast");
  const MASCOT = "🐢"; // Pipo si penyu
  const SAVE_KEY = "pelayaran-juz-amma-v1";

  // ---------- penyimpanan progres (aman bila storage diblokir) ----------
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveProgress() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(progress)); } catch (e) { /* abaikan */ }
  }
  let progress = loadProgress(); // { [surahId]: { stars: n } }

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
  const ayahText = (ayah) => ayah.words.map((w) => w[0]).join(" ");

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
  function play(url) {
    audio.pause();
    audio.src = url;
    return audio.play().catch(() => {
      if (!audioWarned) { toast("🔇 Audio belum bisa diputar. Cek koneksi internet."); audioWarned = true; }
    });
  }
  const ayahUrl = (s, a) => `https://everyayah.com/data/Alafasy_128kbps/${pad3(s)}${pad3(a)}.mp3`;
  const wordUrl = (s, a, w) => `https://audio.qurancdn.com/wbw/${pad3(s)}_${pad3(a)}_${pad3(w)}.mp3`;

  // ---------- render helper ----------
  function render(html, bind) {
    audio.pause();
    app.innerHTML = html;
    window.scrollTo(0, 0);
    if (bind) bind();
  }
  const $ = (sel) => app.querySelector(sel);
  const $$ = (sel) => Array.from(app.querySelectorAll(sel));
  const on = (sel, fn) => { const el = $(sel); if (el) el.addEventListener("click", fn); };

  function topbar(label, title, right, backFn) {
    return `<div class="topbar">
      <button class="icon-btn" id="back" aria-label="Kembali">←</button>
      <div class="title"><small>${esc(label)}</small><b>${esc(title)}</b></div>
      ${right ? `<span class="pill">${esc(right)}</span>` : ""}
    </div>`;
  }
  function progressBar(total, current) {
    let h = '<div class="progress">';
    for (let i = 0; i < total; i++) h += `<span class="${i < current ? "done" : i === current ? "now" : ""}"></span>`;
    return h + "</div>";
  }
  function bindBack(fn) { on("#back", fn); }

  // =====================================================================
  // BERANDA
  // =====================================================================
  function home() {
    render(`<section class="screen home">
      <div class="hero">⛵</div>
      <h1>Pelayaran<br>Juz Amma</h1>
      <p>Berlayar bersama Pipo si penyu ${MASCOT} dari pulau ke pulau. Tiap pulau menyimpan satu surat!</p>
      <div class="spacer"></div>
      <button class="btn" id="start">Mulai Berlayar</button>
      <button class="btn secondary" id="coll">🧺 Koleksi Harta Laut</button>
    </section>`, () => {
      on("#start", map);
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
  // ALUR SATU SURAT
  // =====================================================================
  function startSurah(s) {
    const session = { s, mistakes: 0 };
    story(session, 0);
  }

  // ---- 1. Kisah ----
  function story(ses, idx) {
    const { s } = ses;
    const slide = s.story[idx];
    let dots = "";
    s.story.forEach((_, i) => { dots += `<i class="${i === idx ? "on" : ""}"></i>`; });
    render(`${topbar("Kisah Pulau", `${s.place} · ${s.name}`, null)}
      <div class="story-art" aria-hidden="true">${slide.art}</div>
      <div class="story-talk">
        <div class="mascot">${MASCOT}</div>
        <div class="bubble"><div class="dots">${dots}</div>${esc(slide.text)}</div>
      </div>
      <div class="spacer"></div>
      <div class="row">
        <button class="btn secondary" id="skip">Lewati</button>
        <button class="btn" id="next">${idx < s.story.length - 1 ? "Lanjut" : "Mulai belajar!"}</button>
      </div>`, () => {
      bindBack(map);
      on("#skip", () => learnWords(ses, 0));
      on("#next", () => idx < s.story.length - 1 ? story(ses, idx + 1) : learnWords(ses, 0));
    });
  }

  // ---- 2. Kenali Kata ----
  function learnWords(ses, a) {
    const { s } = ses;
    const ayah = s.ayahs[a];
    const seen = new Set();
    let words = "";
    ayah.words.forEach((w, i) => { words += `<button class="word" data-w="${i}">${esc(w[0])}</button>`; });

    render(`${topbar(`Kenali Kata · ${s.name}`, "Ketuk tiap kata", `Ayat ${a + 1}/${s.ayahs.length}`)}
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
        <button class="btn" id="next" disabled>${a < s.ayahs.length - 1 ? "Ayat berikutnya ›" : "Uji pemahaman ›"}</button>
      </div>`, () => {
      bindBack(map);
      on("#listen", () => play(ayahUrl(s.id, a + 1)));
      $$(".word").forEach((el) => el.addEventListener("click", () => {
        const i = Number(el.dataset.w);
        $$(".word").forEach((x) => x.classList.remove("active"));
        el.classList.add("active", "seen");
        seen.add(i);
        $("#meaning").innerHTML = `<span class="tag">${esc(ayah.words[i][1])}</span>`;
        $("#count").textContent = `Kata yang sudah dikenal: ${seen.size}/${ayah.words.length}`;
        play(wordUrl(s.id, a + 1, i + 1));
        if (seen.size === ayah.words.length) {
          $("#next").disabled = false;
          const tr = $("#tr");
          tr.textContent = ayah.tr;
          tr.classList.add("show");
          $("#count").textContent = "Hebat! Semua kata sudah kamu kenal 🎉";
        }
      }));
      on("#next", () => a < s.ayahs.length - 1 ? learnWords(ses, a + 1) : startQuiz(ses));
    });
  }

  // ---- 3. Pahami Arti (dengar ayat → pilih arti) ----
  function startQuiz(ses) {
    const picks = shuffle(ses.s.ayahs.map((_, i) => i)).slice(0, 3).sort((x, y) => x - y);
    quiz(ses, picks, 0);
  }
  function quiz(ses, picks, q) {
    const { s } = ses;
    const a = picks[q];
    const others = shuffle(s.ayahs.map((_, i) => i).filter((i) => i !== a)).slice(0, 2);
    const opts = shuffle([a, ...others]);
    let html = "";
    opts.forEach((i) => { html += `<button class="option" data-i="${i}">${esc(s.ayahs[i].tr)}</button>`; });

    render(`${topbar(`Pahami Arti · ${s.name}`, "Dengar, lalu pilih artinya", `${q + 1}/${picks.length}`)}
      ${progressBar(picks.length, q)}
      <div class="card" style="text-align:center">
        <button class="btn secondary" id="listen">▶ Dengar ayatnya</button>
        <p class="arabic" style="margin-top:8px">${esc(ayahText(s.ayahs[a]))}</p>
      </div>
      <div class="options">${html}</div>
      <div class="spacer"></div>
      <button class="btn" id="next" disabled>Lanjut ›</button>`, () => {
      bindBack(map);
      on("#listen", () => play(ayahUrl(s.id, a + 1)));
      play(ayahUrl(s.id, a + 1));
      let solved = false;
      $$(".option").forEach((el) => el.addEventListener("click", () => {
        if (solved) return;
        if (Number(el.dataset.i) === a) {
          solved = true;
          el.classList.add("right");
          $("#next").disabled = false;
          toast("✅ Benar! Masya Allah!");
        } else {
          ses.mistakes++;
          el.classList.remove("wrong"); void el.offsetWidth; el.classList.add("wrong");
          toast("Hampir! Coba dengarkan lagi 🙂");
        }
      }));
      on("#next", () => q < picks.length - 1 ? quiz(ses, picks, q + 1) : startArrange(ses));
    });
  }

  // ---- 4. Susun Ayat (uji hafalan urutan kata) ----
  function startArrange(ses) {
    const candidates = ses.s.ayahs.map((ay, i) => i).filter((i) => ses.s.ayahs[i].words.length >= 2);
    const picks = shuffle(candidates).slice(0, 3).sort((x, y) => x - y);
    arrange(ses, picks, 0);
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

    render(`${topbar(`Susun Ayat · ${s.name}`, `Susun ayat ${a + 1} dengan urutan benar`, `${q + 1}/${picks.length}`)}
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
      bindBack(map);
      on("#listen", () => play(ayahUrl(s.id, a + 1)));
      let pos = 0;
      $$(".chip").forEach((el) => el.addEventListener("click", () => {
        if (el.classList.contains("used")) return;
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
      on("#next", () => q < picks.length - 1 ? arrange(ses, picks, q + 1) : result(ses));
    });
  }

  // ---- 5. Hasil ----
  function result(ses) {
    const { s, mistakes } = ses;
    const stars = mistakes <= 1 ? 3 : mistakes <= 4 ? 2 : 1;
    const isNew = starsOf(s) === 0;
    progress[s.id] = { stars: Math.max(stars, starsOf(s)) };
    saveProgress();

    let starHtml = "";
    for (let i = 0; i < 3; i++) starHtml += `<span class="${i < stars ? "" : "off"}">⭐</span>`;
    const msg = stars === 3 ? "Sempurna! Masya Allah!" : stars === 2 ? "Bagus sekali! Ulangi lagi untuk 3 bintang." : "Sudah selesai! Yuk ulangi biar makin lancar.";

    render(`<section class="screen result">
      <h2>Pulau ${esc(s.place)} selesai!</h2>
      <div class="big-stars">${starHtml}</div>
      <p>${msg}<br><small>Kesalahan: ${mistakes}</small></p>
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
