// The 10-minute station lesson: steps, what the monitor shows, and presenter notes.
(function () {
  const { VOCAB, byWord, TEXT, esc, posLabel, blankLyric, picture } = window.App;

  const HARD = VOCAB.filter((v) => v.level === "hard");
  // Words taught at the station: hard words (picture cards + song) and the word-family words.
  const FAMILY = window.FAMILIES.flat().map((w) => byWord[w]).filter((v) => v.level !== "hard");
  const TAUGHT = HARD.concat(FAMILY);

  const STEPS = [
    { id: "welcome", th: "ต้อนรับ", en: "Welcome", minute: "0:00" },
    { id: "warmup", th: "อุ่นเครื่อง", en: "Warm-up", minute: "0:30" },
    { id: "cards", th: "การ์ดภาพ", en: "Picture cards", minute: "1:15" },
    { id: "song", th: "เพลง", en: "Song", minute: "2:45" },
    { id: "family", th: "กลุ่มคำ", en: "Word family", minute: "5:45" },
    { id: "quiz", th: "ควิซสุ่ม 5 ข้อ", en: "Random quiz", minute: "7:15" },
    { id: "recap", th: "สรุป", en: "Recap", minute: "9:00" },
  ];

  function songLines(lang) {
    const out = [];
    for (const s of window.SONGS[lang].sections) for (const line of s.lines) out.push({ label: s.label, line });
    return out;
  }

  function itemCount(state, stepId) {
    switch (stepId) {
      case "warmup": return state.warm.length;
      case "cards": return HARD.length;
      case "song": return songLines(state.lang).length;
      case "family": return window.FAMILIES.length;
      case "quiz": return state.quiz.length;
      default: return 1;
    }
  }

  function score(state) {
    return Object.values(state.marks || {}).filter(Boolean).length;
  }

  function lineHTML(line, cls) {
    if (!line) return `<p class="line ${cls}">&nbsp;</p>`;
    if (line.lead) return `<p class="line ${cls}"><span class="lead">${esc(line.lead)}</span> ${esc(line.resp)}</p>`;
    return `<p class="line ${cls}">${esc(line.text)}</p>`;
  }

  function questionHTML(state, q, key) {
    const v = byWord[q.word];
    const T = TEXT[state.lang];
    const reveal = state.reveal;
    const opts = q.choices.map((c, i) => {
      let cls = "opt";
      if (reveal) cls += i === q.answer ? " correct" : " faded";
      return `<div class="${cls}"><b>${"ABCD"[i]}</b>${esc(c)}</div>`;
    }).join("");
    let hint = "";
    if (state.hint) hint = `<p class="hint">${esc(state.lang === "th" ? v.meaning_th : v.meaning)}</p>`;
    return `<div class="s-quiz">${picture(v)}<div>
      <span class="pill ${v.level}">${esc(T[v.level])}</span>
      <p class="lyric" style="margin-top:2vh">🎵 ${esc(blankLyric(v))}</p>${hint}
      <div class="opts">${opts}</div></div></div>`;
  }

  // What the audience monitor shows for the current state.
  function renderStage(state) {
    const T = TEXT[state.lang];
    const step = STEPS[state.step];
    const n = itemCount(state, step.id);
    const counter = n > 1 ? ` · ${state.sub + 1}/${n}` : "";
    let html = "";
    let dark = false;

    switch (step.id) {
      case "welcome":
        dark = true;
        html = `<div class="s-welcome"><h1>Sing the Words!</h1>
          <p class="sub">${esc(state.lang === "th" ? "ร้องให้จำ ศัพท์ไม่ยาก" : "Learn hard words with pictures and a song")}</p>
          <p class="group">${esc(T.group)} ${state.group}</p></div>`;
        break;
      case "warmup":
        html = questionHTML(state, state.warm[state.sub], "w" + state.sub);
        break;
      case "cards": {
        const v = HARD[state.sub];
        const details = state.lang === "th"
          ? `<p class="read">${esc(v.read_th || "")} · ${esc(posLabel(v, "th"))}</p>
             <p class="meaning-th">${esc(v.meaning_th)}</p>
             ${v.memory_trick ? `<p class="trick">💡 ${esc(v.memory_trick)}</p>` : ""}`
          : `<p class="read">${esc(posLabel(v, "en"))}</p>
             <p class="meaning">${esc(v.meaning)}</p>
             ${v.word !== "obscene" ? `<p class="trick">🎵 ${esc(v.lyric)}</p>` : ""}`;
        html = `<div class="s-card">${picture(v)}<div>
          <span class="pill hard">${esc(T.hard)} · ${esc(T.chapter)} ${v.chapter}</span>
          <h1 class="word">${esc(v.word)}</h1>${details}</div></div>`;
        break;
      }
      case "song": {
        dark = true;
        const lines = songLines(state.lang);
        const cur = lines[state.sub];
        const prev = lines[state.sub - 1];
        const next = lines[state.sub + 1];
        html = `<div class="s-song"><div>
          <p class="section-label">🎵 ${esc(window.SONGS[state.lang].title)} · ${esc(cur.label)}</p>
          ${lineHTML(prev && prev.line, "dim")}${lineHTML(cur.line, "")}${lineHTML(next && next.line, "dim")}
          </div>${picture(cur.line.word ? byWord[cur.line.word] : null)}</div>`;
        break;
      }
      case "family": {
        const fam = window.FAMILIES[state.sub];
        html = `<div class="s-family"><h2>${esc(T.family)}</h2>` + fam.map((w) => {
          const v = byWord[w];
          return `<div class="row"><span class="w">${esc(w)}</span><span class="pos">${esc(posLabel(v, state.lang))}</span>
            <span class="m">${esc(state.lang === "th" ? v.meaning_th : v.meaning)}</span></div>`;
        }).join("") + "</div>";
        break;
      }
      case "quiz":
        html = questionHTML(state, state.quiz[state.sub], "q" + state.sub);
        break;
      case "recap":
        dark = true;
        html = `<div class="s-recap"><h1>${esc(T.recap)}</h1>
          <p>${esc(T.score)}: <span class="score">${score(state)}/${state.warm.length + state.quiz.length}</span></p>
          <div class="qr-box"><img src="images/qr.png" alt="QR code" onerror="this.replaceWith('[QR code]')"></div></div>`;
        break;
    }
    const top = `<span>Sing the Words! · ${esc(T.group)} ${state.group}</span><span>${esc(step[state.lang])}${counter}</span>`;
    return { html, dark, top };
  }

  // What the presenter sees on the laptop: notes and the answer.
  function presenterInfo(state) {
    const step = STEPS[state.step];
    const th = state.lang === "th";
    switch (step.id) {
      case "welcome":
        return { notes: th ? "ทักทายกลุ่ม: สวัสดีครับ/ค่ะ วันนี้เราจะเรียนศัพท์ยากด้วยภาพและเพลง" : "Greet the group: Hello everyone! Today we learn hard words with pictures and a song." };
      case "warmup":
      case "quiz": {
        const q = (step.id === "warmup" ? state.warm : state.quiz)[state.sub];
        const v = byWord[q.word];
        return {
          answer: `${"ABCD"[q.answer]}. ${v.word} (${v.meaning_th})`,
          notes: "ให้กลุ่มตอบพร้อมกัน แล้วกด R เฉลย จากนั้นกด ✔ หรือ ✘\nH = แสดงความหมายเป็นคำใบ้",
          question: true,
        };
      }
      case "cards": {
        const v = HARD[state.sub];
        return { notes: `${v.word} · ${v.meaning_th}\nภาพ: ${v.image_idea}${v.memory_trick ? "\nช่วยจำ: " + v.memory_trick : ""}\nทำท่ามือประกอบ แล้วให้กลุ่มพูดตาม` };
      }
      case "song":
        return { notes: "กด P เล่น/หยุดเพลง แล้วกด → เลื่อนเนื้อเพลงตามจังหวะ\nท่อนฮุก: ให้ทั้งกลุ่มร้องตาม", song: true };
      case "family":
        return { notes: "ท่องพร้อมปรบมือ: noun (แปะ) adjective (แปะ) adverb!\nสังเกตท้ายคำ -ism / -ic / -ally, -ment, -ions" };
      case "recap":
        return { notes: "ประกาศคะแนน ร้องฮุกอีกครั้ง แล้วให้สแกน QR ไปฝึกต่อ\nเสร็จแล้วกด \"กลุ่มใหม่\"" };
    }
    return { notes: "" };
  }

  window.Lesson = { STEPS, HARD, FAMILY, TAUGHT, itemCount, renderStage, presenterInfo, score, songLines };
})();
