// Song lyrics shown line by line in Presenter mode and on the study page.
// There is no audio: the presenter reads each line to a beat and the group repeats it.
// The lines themselves live in vocab.js (`lyric_th` = Thai version, `lyric` = English version),
// one line per hard word, so the song, the picture cards and the quiz always match.
(function () {
  const hard = (window.VOCAB || []).filter((v) => v.level === "hard" && v.lyric_th);
  const byChapter = (ch) => hard.filter((v) => v.chapter === ch);
  const lines = (lang, words) => words.map((v) => ({ text: lang === "th" ? v.lyric_th : v.lyric, word: v.word }));
  const sections = (lang, label) => [1, 2, 3]
    .map((ch) => ({ label: label(ch), lines: lines(lang, byChapter(ch)) }))
    .filter((s) => s.lines.length);

  window.SONGS = {
    th: {
      title: "ศัพท์ยากไม่ยากถ้าร้องเป็นเพลง",
      sections: sections("th", (ch) => "บทที่ " + ch),
    },
    en: {
      title: "Say It, Mean It!",
      sections: sections("en", (ch) => "Chapter " + ch),
    },
  };

  // Word families used in the "Word family" step.
  window.FAMILIES = [
    ["enthusiasm", "enthusiastic", "enthusiastically"],
    ["assign", "assignment"],
    ["instruct", "instructions"],
  ];
})();
