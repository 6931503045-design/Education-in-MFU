// Song lyrics shown line by line in Presenter mode. Full lyrics with notes: SONG-LYRICS.md.
// A line is either { text, word } or a call-and-response pair { lead, resp, word }.
// `word` links the line to its picture in vocab.js (null = no picture).
// Audio files are optional: drop them in audio/ with the names below.
(function () {
  const thHook = [
    { text: "Proofread ตรวจทานก่อนส่ง", word: "proofread" },
    { text: "Constructive ติเพื่อก่อ ไม่ได้ติเพื่อลง", word: "constructive" },
    { text: "Alleviate บรรเทา ให้ใจมันเบา", word: "alleviate" },
    { text: "Enhance ทำให้ดี ให้เด่นกว่าเก่า", word: "enhance" },
  ];
  const enHook = [
    { lead: "Alleviate!", resp: "Make the pain less severe!", word: "alleviate" },
    { lead: "Enhance!", resp: "Make it better, make it clear!", word: "enhance" },
    { lead: "Proofread!", resp: "Check it before you submit!", word: "proofread" },
    { lead: "Constructive!", resp: "Feedback that helps you get it!", word: "constructive" },
  ];

  window.SONGS = {
    th: {
      title: "ศัพท์ยากไม่ยากถ้าร้องเป็นเพลง",
      style: "ป๊อปลูกทุ่งแดนซ์ · 120 BPM",
      audio: "audio/song-th.mp3",
      sections: [
        { label: "ฮุก", lines: thHook },
        { label: "ท่อน 1 · ชีวิตในมหาวิทยาลัย", lines: [
          { text: "Diligently ขยันทุกวัน", word: "diligently" },
          { text: "Attentively ตั้งใจฟัง ไม่หลับฝัน", word: "attentively" },
          { text: "Enthusiastically กระตือรือร้นสุดใจ", word: "enthusiastically" },
          { text: "Extracurricular กิจกรรมนอกห้องไป", word: "extracurricular" },
          { text: "Pandemic โรคระบาดไปทั้งโลก", word: "pandemic" },
          { text: "Remarkably น่าทึ่ง เรายังยิ้มได้ไม่โศก", word: "remarkably" },
        ] },
        { label: "ฮุก", lines: thHook },
        { label: "ท่อน 2 · มารยาทและวัฒนธรรม", lines: [
          { text: "Etiquette มารยาทน่ารัก", word: "etiquette" },
          { text: "Reciprocal ซึ่งกันและกัน ให้ไปได้กลับมาเป็นหลัก", word: "reciprocal" },
          { text: "Severance ตัดขาดสะบั้น", word: "severance" },
          { text: "Misperception เข้าใจผิดกัน", word: "misperception" },
          { text: "Minimise ลดให้น้อยที่สุด", word: "minimise" },
          { text: "Assortment ของคละรวมมาเป็นชุด", word: "assortment" },
          { text: "Intruder ผู้บุกรุกตอนดึก", word: "intruder" },
          { text: "ร้องเพลงนี้ไว้ ศัพท์ติดหัวลึก ๆ", word: null },
        ] },
        { label: "ฮุก (ทุกคน)", lines: thHook },
      ],
    },
    en: {
      title: "Say It, Mean It!",
      style: "Hip-hop call & response · 95 BPM",
      audio: "audio/song-en.mp3",
      sections: [
        { label: "Hook", lines: enHook },
        { label: "Verse 1 · Campus Life", lines: [
          { text: "I study diligently, with effort every day,", word: "diligently" },
          { text: "I listen attentively to what my teachers say.", word: "attentively" },
          { text: "I join the club enthusiastically: hip hip hooray!", word: "enthusiastically" },
          { text: "Extracurricular: outside the class I play.", word: "extracurricular" },
          { text: "When the pandemic spread across the world so wide,", word: "pandemic" },
          { text: "Remarkably, we made it, learning side by side.", word: "remarkably" },
        ] },
        { label: "Hook", lines: enHook },
        { label: "Verse 2 · Culture & Manners", lines: [
          { text: "Etiquette: the rules of being polite,", word: "etiquette" },
          { text: "Reciprocal: you help me, I help you, that's right!", word: "reciprocal" },
          { text: "Severance: it's over, cut the tie,", word: "severance" },
          { text: "Misperception: a wrong idea in your mind.", word: "misperception" },
          { text: "Minimise the problem, make it small,", word: "minimise" },
          { text: "Assortment: a mix, a little bit of all.", word: "assortment" },
          { text: "Intruder at the window, sneaking in at night,", word: "intruder" },
          { text: "Learn these words with me, and you'll be doing right!", word: null },
        ] },
        { label: "Hook (everyone)", lines: enHook },
      ],
    },
  };

  // Word families used in the "Word family" step.
  window.FAMILIES = [
    ["enthusiasm", "enthusiastic", "enthusiastically"],
    ["assign", "assignment"],
    ["instruct", "instructions"],
  ];
})();
