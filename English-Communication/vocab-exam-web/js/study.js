// Practice page for students: flashcards and a random 5-question quiz.
(function () {
  const { VOCAB, byWord, TEXT, esc, shuffle, posLabel, buildQuiz, blankLyric, picture, speak } = window.App;
  const $ = (id) => document.getElementById(id);
  const view = $("view");

  let lang = "th";
  let mode = "cards";
  let level = "";
  let deck = [];
  let pos = 0;
  let flipped = false;
  let quiz = [];
  let answers = [];

  try { lang = localStorage.getItem("stw-study-lang") || "th"; } catch (e) { /* ignore */ }

  function makeDeck() {
    deck = shuffle(VOCAB.filter((v) => !level || v.level === level));
    pos = 0;
    flipped = false;
  }

  function newQuiz() {
    quiz = level ? buildQuiz({ [level]: 5 }) : buildQuiz({ hard: 2, medium: 2, easy: 1 });
    answers = quiz.map(() => null);
  }

  function renderCards() {
    const v = deck[pos];
    const T = TEXT[lang];
    const back = lang === "th"
      ? `<p class="meaning-th">${esc(v.meaning_th)}</p>${v.read_th ? `<p>${esc(v.read_th)}</p>` : ""}<p>${esc(posLabel(v, "th"))}</p>${v.memory_trick ? `<p>💡 ${esc(v.memory_trick)}</p>` : ""}`
      : `<p>${esc(posLabel(v, "en"))}</p><p>${esc(v.meaning)}</p>`;
    view.innerHTML = `
      <div class="flash" id="card">
        <span class="pill ${v.level}">${esc(T[v.level])} · ${esc(T.chapter)} ${v.chapter}</span>
        ${picture(v)}
        <p class="word">${esc(v.word)}</p>
        ${flipped ? back + (v.lyric ? `<p>🎵 ${esc(v.lyric)}</p>` : "") : `<p class="tap">${lang === "th" ? "แตะเพื่อดูความหมาย" : "Tap to see the meaning"}</p>`}
      </div>
      <p class="counter">${pos + 1} / ${deck.length}</p>
      <div class="toolbar" style="justify-content:center">
        <button id="c-prev">◀</button>
        <button id="c-say">🔊 ${lang === "th" ? "ฟังเสียง" : "Listen"}</button>
        <button id="c-shuffle">🔀</button>
        <button id="c-next" class="primary">▶</button>
      </div>`;
    $("card").onclick = () => { flipped = !flipped; render(); };
    $("c-prev").onclick = () => { pos = (pos - 1 + deck.length) % deck.length; flipped = false; render(); };
    $("c-next").onclick = () => { pos = (pos + 1) % deck.length; flipped = false; render(); };
    $("c-say").onclick = () => speak(v.word);
    $("c-shuffle").onclick = () => { makeDeck(); render(); };
  }

  function renderQuiz() {
    const done = answers.every((a) => a !== null);
    const right = answers.filter((a, i) => a === quiz[i].answer).length;
    view.innerHTML = quiz.map((q, i) => {
      const v = byWord[q.word];
      const a = answers[i];
      const opts = q.choices.map((c, j) => {
        let cls = "opt";
        if (a !== null) cls += j === q.answer ? " correct" : j === a ? " wrong" : " faded";
        return `<button class="${cls}" data-q="${i}" data-c="${j}" ${a !== null ? "disabled" : ""}><b>${"ABCD"[j]}</b>${esc(c)}</button>`;
      }).join("");
      const after = a !== null ? `<p style="text-align:center">${esc(v.word)} = ${esc(lang === "th" ? v.meaning_th : v.meaning)}</p>` : "";
      return `<div class="q-card"><p class="counter">${lang === "th" ? "ข้อ" : "Question"} ${i + 1}/${quiz.length}</p>
        ${picture(v)}<p class="lyric">🎵 ${esc(blankLyric(v))}</p><div class="opts">${opts}</div>${after}</div>`;
    }).join("") + `<div class="q-card" style="text-align:center">
        ${done ? `<p style="font-size:28px">${lang === "th" ? "ได้" : "Score"} ${right} / ${quiz.length}</p>` : ""}
        <button id="q-new" class="primary">🔀 ${lang === "th" ? "สุ่มชุดใหม่" : "New random quiz"}</button></div>`;
    view.querySelectorAll("button.opt").forEach((b) => {
      b.onclick = () => { answers[Number(b.dataset.q)] = Number(b.dataset.c); render(); };
    });
    $("q-new").onclick = () => { newQuiz(); render(); window.scrollTo(0, 0); };
  }

  // Lyrics of the song, one line per hard word, with its picture. Tap a line to hear the word.
  function renderSong() {
    const song = window.SONGS[lang];
    view.innerHTML = `<div class="q-card"><p class="lyric">🎵 ${esc(song.title)}</p>
      <p class="counter">${lang === "th" ? "แตะแต่ละท่อนเพื่อฟังเสียงคำศัพท์" : "Tap a line to hear the word"}</p></div>` +
      song.sections.map((s) => `<div class="q-card"><h2 style="font-size:20px">${esc(s.label)}</h2>` +
        s.lines.map((l) => `<button class="song-line" data-word="${esc(l.word)}">${picture(byWord[l.word])}<span>${esc(l.text)}</span></button>`).join("") +
        "</div>").join("");
    view.querySelectorAll(".song-line").forEach((b) => { b.onclick = () => speak(b.dataset.word); });
  }

  function render() {
    $("lang-th").classList.toggle("on", lang === "th");
    $("lang-en").classList.toggle("on", lang === "en");
    $("mode-cards").classList.toggle("on", mode === "cards");
    $("mode-quiz").classList.toggle("on", mode === "quiz");
    $("mode-song").classList.toggle("on", mode === "song");
    $("levels").style.display = mode === "song" ? "none" : "";
    document.querySelectorAll("#levels button").forEach((b) => b.classList.toggle("on", b.dataset.level === level));
    if (mode === "cards") renderCards();
    else if (mode === "song") renderSong();
    else renderQuiz();
  }

  function setLang(l) {
    lang = l;
    try { localStorage.setItem("stw-study-lang", l); } catch (e) { /* ignore */ }
    render();
  }

  $("lang-th").onclick = () => setLang("th");
  $("lang-en").onclick = () => setLang("en");
  $("mode-cards").onclick = () => { mode = "cards"; render(); };
  $("mode-quiz").onclick = () => { mode = "quiz"; newQuiz(); render(); };
  $("mode-song").onclick = () => { mode = "song"; render(); };
  $("levels").onclick = (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    level = b.dataset.level;
    makeDeck();
    newQuiz();
    render();
  };

  makeDeck();
  newQuiz();
  render();
})();
