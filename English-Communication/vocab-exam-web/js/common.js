// Shared helpers: vocabulary lookup, random quiz builder, pictures, UI text.
(function () {
  const VOCAB = window.VOCAB || [];
  const byWord = Object.fromEntries(VOCAB.map((v) => [v.word, v]));

  const TEXT = {
    th: {
      hard: "ยาก", medium: "กลาง", easy: "ง่าย",
      chapter: "บทที่", welcome: "ร้องให้จำ ศัพท์ไม่ยาก", group: "กลุ่มที่",
      warmup: "อุ่นเครื่อง", quiz: "คำถามสุ่ม", question: "ข้อ",
      family: "ครอบครัวคำ", recap: "ฝึกต่อได้ที่เว็บของเรา", score: "คะแนนกลุ่ม",
      pos: { n: "คำนาม", v: "คำกริยา", adj: "คำคุณศัพท์", adv: "คำกริยาวิเศษณ์", prep: "คำบุพบท" },
    },
    en: {
      hard: "Hard", medium: "Medium", easy: "Easy",
      chapter: "Chapter", welcome: "Sing the Words!", group: "Group",
      warmup: "Warm-up", quiz: "Random quiz", question: "Question",
      family: "Word family", recap: "Keep practising on our website", score: "Group score",
      pos: { n: "noun", v: "verb", adj: "adjective", adv: "adverb", prep: "preposition" },
    },
  };

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // "n./v." -> "n"
  function posKey(v) {
    return v.pos.split(/[./]/)[0];
  }

  function posLabel(v, lang) {
    return v.pos.split("/").map((p) => TEXT[lang].pos[p.replace(".", "")] || p).join(" / ");
  }

  function quizWords(level) {
    return VOCAB.filter((v) => v.quiz && (!level || v.level === level));
  }

  // One multiple-choice question: picture + lyric with a blank, 4 choices of the same word type when possible.
  // `pool` = the words wrong choices may come from (default: every quiz word).
  function makeQuestion(v, pool) {
    // Skip words that already appear in this lyric line, so no wrong choice is printed in the question.
    const others = (pool || quizWords()).filter((o) => o.quiz && o.word !== v.word && !v.lyric.toLowerCase().includes(o.word.toLowerCase()));
    const samePos = shuffle(others.filter((o) => posKey(o) === posKey(v)));
    const rest = shuffle(others.filter((o) => posKey(o) !== posKey(v)));
    const wrong = samePos.concat(rest).slice(0, 3).map((o) => o.word);
    const choices = shuffle([v.word].concat(wrong));
    return { word: v.word, choices, answer: choices.indexOf(v.word) };
  }

  // Random quiz with a fixed mix of levels (default: 2 hard, 2 medium, 1 easy), no repeated words.
  function buildQuiz(counts, exclude) {
    const skip = new Set(exclude || []);
    const picked = [];
    for (const [level, n] of Object.entries(counts || { hard: 2, medium: 2, easy: 1 })) {
      picked.push(...shuffle(quizWords(level).filter((v) => !skip.has(v.word))).slice(0, n));
    }
    return shuffle(picked).map((v) => makeQuestion(v));
  }

  // Random quiz from fixed groups, e.g. [{ words: hardWords, n: 3 }, { words: familyWords, n: 2 }].
  // Wrong choices come from `pool`, so every choice is a word the group has seen.
  function buildQuizFrom(groups, pool) {
    const picked = [];
    for (const g of groups) {
      picked.push(...shuffle(g.words.filter((v) => v.quiz && !picked.includes(v))).slice(0, g.n));
    }
    return shuffle(picked).map((v) => makeQuestion(v, pool));
  }

  function blankLyric(v) {
    const re = new RegExp(v.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    return v.lyric.replace(re, "_____");
  }

  function slug(word) {
    return word.toLowerCase().replace(/\s+/g, "-");
  }

  // Shows images/<word>.png if it exists, otherwise the emoji and the picture idea.
  function picture(v, showIdea) {
    if (!v) return '<div class="pic"><span class="emoji">🎵</span></div>';
    return (
      '<div class="pic">' +
      `<img src="images/${esc(slug(v.word))}.png" alt="${esc(v.word)}" onerror="this.remove()">` +
      `<span class="emoji">${esc(v.emoji)}</span>` +
      (showIdea ? `<span class="idea">${esc(v.image_idea)}</span>` : "") +
      "</div>"
    );
  }

  function speak(word) {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "en-US";
    u.rate = 0.85;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }

  window.App = { VOCAB, byWord, TEXT, esc, shuffle, posLabel, quizWords, makeQuestion, buildQuiz, buildQuizFrom, blankLyric, picture, speak };
})();
