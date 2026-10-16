// Presenter mode (laptop): controls the lesson and sends the state to the audience screen.
(function () {
  const { App, Lesson } = window;
  const STATION_MS = 10 * 60 * 1000;
  const $ = (id) => document.getElementById(id);

  const store = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode: keep going */ }
    },
  };

  function freshState(group, lang) {
    const quiz = App.buildQuiz({ hard: 2, medium: 2, easy: 1 });
    const used = quiz.map((q) => q.word);
    const warm = App.buildQuiz({ easy: 3 }, used);
    return {
      group, lang, step: 0, sub: 0, reveal: false, hint: false,
      warm, quiz, marks: {},
      timer: { running: false, end: null, left: STATION_MS },
    };
  }

  let state = store.get("stw-state", null);
  if (!state || !state.quiz) state = freshState(1, "th");
  let results = store.get("stw-results", []);
  let stageWin = null;

  // ---------- sending the state to the screens ----------
  function broadcast() {
    store.set("stw-state", state);
    const msg = { type: "state", state };
    $("preview").contentWindow?.postMessage(msg, "*");
    if (stageWin && !stageWin.closed) stageWin.postMessage(msg, "*");
    render();
  }

  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "hello") e.source?.postMessage({ type: "state", state }, "*");
  });

  // ---------- navigation ----------
  const stepId = () => Lesson.STEPS[state.step].id;
  const count = () => Lesson.itemCount(state, stepId());

  function go(step, sub) {
    state.step = step;
    state.sub = sub;
    state.reveal = false;
    state.hint = false;
    broadcast();
  }

  function next() {
    if (!state.timer.running && state.step === 0) startTimer();
    if (state.sub < count() - 1) go(state.step, state.sub + 1);
    else if (state.step < Lesson.STEPS.length - 1) go(state.step + 1, 0);
  }

  function prev() {
    if (state.sub > 0) go(state.step, state.sub - 1);
    else if (state.step > 0) {
      const s = state.step - 1;
      go(s, Lesson.itemCount(state, Lesson.STEPS[s].id) - 1);
    }
  }

  function questionKey() {
    const id = stepId();
    if (id === "warmup") return "w" + state.sub;
    if (id === "quiz") return "q" + state.sub;
    return null;
  }

  function mark(ok) {
    const key = questionKey();
    if (!key) return;
    state.marks[key] = ok;
    state.reveal = true;
    broadcast();
  }

  // ---------- groups and results ----------
  function saveResult() {
    if (!Object.keys(state.marks).length) return;
    results = results.filter((r) => r.group !== state.group);
    results.push({ group: state.group, lang: state.lang, score: Lesson.score(state), total: state.warm.length + state.quiz.length });
    store.set("stw-results", results);
  }

  function newGroup() {
    if (state.step > 0 && !confirm("เริ่มกลุ่มใหม่? (คะแนนกลุ่มนี้จะถูกบันทึก)")) return;
    saveResult();
    stopAudio();
    state = freshState(state.group + 1, state.lang);
    broadcast();
  }

  function setLang(lang) {
    state.lang = lang;
    if (stepId() === "song") state.sub = Math.min(state.sub, count() - 1);
    stopAudio();
    broadcast();
  }

  // ---------- timer ----------
  function timeLeft() {
    const t = state.timer;
    return t.running ? t.end - Date.now() : t.left;
  }
  function startTimer() {
    state.timer = { running: true, end: Date.now() + state.timer.left, left: state.timer.left };
  }
  function toggleTimer() {
    if (state.timer.running) state.timer = { running: false, end: null, left: timeLeft() };
    else startTimer();
    broadcast();
  }
  function resetTimer() {
    state.timer = { running: false, end: null, left: STATION_MS };
    broadcast();
  }
  function fmt(ms) {
    const neg = ms < 0;
    const s = Math.floor(Math.abs(ms) / 1000);
    return (neg ? "-" : "") + Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }
  function tick() {
    const left = timeLeft();
    const el = $("timer");
    el.textContent = fmt(left);
    el.className = "timer" + (left < 0 ? " over" : left < 60000 ? " warn" : "");
    const elapsed = STATION_MS - left;
    let planned = Lesson.STEPS[0];
    for (const s of Lesson.STEPS) {
      const [m, sec] = s.minute.split(":").map(Number);
      if (elapsed >= (m * 60 + sec) * 1000) planned = s;
    }
    $("plan-hint").textContent = state.timer.running || left < STATION_MS ? "ตามแผนควรอยู่ช่วง: " + planned.th : "เริ่มนับเมื่อกด ถัดไป ครั้งแรก";
  }

  // ---------- audio ----------
  const audio = $("audio");
  function stopAudio() { audio.pause(); }
  function toggleAudio() {
    const src = window.SONGS[state.lang].audio;
    if (!audio.src.endsWith(src)) audio.src = src;
    if (audio.paused) audio.play().catch(() => { $("audio-status").textContent = "ยังไม่มีไฟล์เพลง: " + src; });
    else audio.pause();
  }
  audio.addEventListener("play", () => { $("play").textContent = "⏸ หยุดเพลง (P)"; $("audio-status").textContent = ""; });
  audio.addEventListener("pause", () => { $("play").textContent = "▶ เล่นเพลง (P)"; });
  audio.addEventListener("error", () => { $("audio-status").textContent = "ยังไม่มีไฟล์เพลง: " + window.SONGS[state.lang].audio; });

  // ---------- presenter UI ----------
  function render() {
    $("group-label").textContent = "กลุ่มที่ " + state.group;
    $("lang-th").classList.toggle("on", state.lang === "th");
    $("lang-en").classList.toggle("on", state.lang === "en");

    $("steps").innerHTML = Lesson.STEPS.map((s, i) =>
      `<button data-step="${i}" class="${i === state.step ? "on" : ""}">${App.esc(s.minute)} ${App.esc(s.th)}</button>`).join("");

    const n = count();
    const step = Lesson.STEPS[state.step];
    $("step-title").textContent = `${step.th}${n > 1 ? ` (${state.sub + 1}/${n})` : ""}`;
    const info = Lesson.presenterInfo(state);
    $("notes").textContent = info.notes || "";
    $("answer").textContent = info.answer ? "เฉลย: " + info.answer : "";
    $("question-btns").style.display = info.question ? "" : "none";
    $("song-btns").style.display = info.song ? "" : "none";
    $("reveal").classList.toggle("on", state.reveal);
    $("hint").classList.toggle("on", state.hint);
    const key = questionKey();
    $("mark-ok").classList.toggle("on", key != null && state.marks[key] === true);
    $("mark-no").classList.toggle("on", key != null && state.marks[key] === false);

    $("score").textContent = `${Lesson.score(state)} / ${state.warm.length + state.quiz.length}`;
    $("results").innerHTML = results.slice().sort((a, b) => a.group - b.group).map((r) =>
      `<tr><td>${r.group}</td><td>${r.lang === "th" ? "ไทย" : "EN"}</td><td>${r.score}/${r.total}</td></tr>`).join("") ||
      '<tr><td colspan="3" class="kbd">ยังไม่มี</td></tr>';

    const open = stageWin && !stageWin.closed;
    $("stage-status").textContent = open ? "🟢 จอผู้เรียนเปิดอยู่" : "⚪ ยังไม่เปิดจอผู้เรียน";
    $("prev").disabled = state.step === 0 && state.sub === 0;
    $("next").disabled = state.step === Lesson.STEPS.length - 1;
    tick();
  }

  // ---------- events ----------
  $("next").onclick = next;
  $("prev").onclick = prev;
  $("steps").onclick = (e) => { const b = e.target.closest("button"); if (b) go(Number(b.dataset.step), 0); };
  $("lang-th").onclick = () => setLang("th");
  $("lang-en").onclick = () => setLang("en");
  $("new-group").onclick = newGroup;
  $("reveal").onclick = () => { state.reveal = !state.reveal; broadcast(); };
  $("hint").onclick = () => { state.hint = !state.hint; broadcast(); };
  $("mark-ok").onclick = () => mark(true);
  $("mark-no").onclick = () => mark(false);
  $("play").onclick = toggleAudio;
  $("timer-toggle").onclick = toggleTimer;
  $("timer-reset").onclick = resetTimer;
  $("clear-results").onclick = () => {
    if (!confirm("ล้างคะแนนทุกกลุ่ม?")) return;
    results = [];
    store.set("stw-results", results);
    render();
  };
  $("open-stage").onclick = () => {
    stageWin = window.open("stage.html", "stw-stage", "popup,width=1280,height=720");
    render();
  };
  $("preview").addEventListener("load", broadcast);

  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea")) return;
    const k = e.key.toLowerCase();
    if (k === "arrowright" || k === " " || k === "pagedown") { e.preventDefault(); next(); }
    else if (k === "arrowleft" || k === "pageup") { e.preventDefault(); prev(); }
    else if (k === "r") { state.reveal = !state.reveal; broadcast(); }
    else if (k === "h") { state.hint = !state.hint; broadcast(); }
    else if (k === "c") mark(true);
    else if (k === "x") mark(false);
    else if (k === "p") toggleAudio();
  });

  setInterval(() => {
    tick();
    $("timer-toggle").textContent = state.timer.running ? "⏸ หยุด" : "▶ เริ่ม";
    const open = stageWin && !stageWin.closed;
    $("stage-status").textContent = open ? "🟢 จอผู้เรียนเปิดอยู่" : "⚪ ยังไม่เปิดจอผู้เรียน";
  }, 500);

  broadcast();
})();
