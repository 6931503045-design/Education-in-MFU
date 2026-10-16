# English Communication (Eng Com)

งานของวิชา **1006134 English for Communication 1**: โปรเจกต์ **Sing the Words!** สอนคำศัพท์บทที่ 1–3 (67 คำ) ผ่านภาพและเพลง สอนแบบวนฐาน ฐานละ 10 นาที กลุ่มละ 5–6 คน กลุ่มคนไทยกับกลุ่มต่างชาติแยกกัน

## 🌐 เว็บไซต์ (ออนไลน์แล้ว)
| หน้า | ลิงก์ | ใช้ทำอะไร |
|---|---|---|
| 🏠 หน้าแรก | https://6931503045-design.github.io/Education-in-MFU/English-Communication/vocab-exam-web/ | เลือกได้ว่าจะเข้าหน้าฝึกเองหรือ Presenter mode |
| 🎤 Presenter mode | https://6931503045-design.github.io/Education-in-MFU/English-Communication/vocab-exam-web/presenter.html | **สำหรับผู้สอนที่ฐาน** เปิดบนโน้ตบุ๊ก ควบคุมบทเรียน มีเฉลย โน้ตผู้สอน ตัวจับเวลา 10 นาที และตารางคะแนนของทุกกลุ่ม |
| 🖥️ จอผู้เรียน | https://6931503045-design.github.io/Education-in-MFU/English-Communication/vocab-exam-web/stage.html | จอที่ผู้เรียนเห็นบน monitor **ให้เปิดผ่านปุ่ม "เปิดจอผู้เรียน" ในหน้า Presenter** ไม่ต้องเปิดลิงก์นี้ตรง ๆ |
| 📚 ฝึกเอง | https://6931503045-design.github.io/Education-in-MFU/English-Communication/vocab-exam-web/study.html | **สำหรับนักศึกษา** ใช้บนมือถือ มี Flashcards พร้อมเสียงอ่าน และควิซสุ่ม 5 ข้อ |
| 🔳 QR code | https://6931503045-design.github.io/Education-in-MFU/English-Communication/vocab-exam-web/images/qr.png | QR ไปหน้าฝึกเอง ใช้พิมพ์ติดที่ฐานหรือใส่ในใบสรุปศัพท์ |

วิธีใช้ Presenter mode ที่ฐาน (โน้ตบุ๊ก + monitor) อยู่ใน [vocab-exam-web/README.md](vocab-exam-web/README.md)

## 📄 เอกสารวางแผน
| ไฟล์ | เนื้อหา |
|---|---|
| [PLAN.md](vocab-exam-web/PLAN.md) | แผนรวมของโปรเจกต์และสิ่งที่ตกลงกันแล้ว (เป้าหมาย, ฟีเจอร์, คำถามสุ่ม, รูปแบบการวนฐาน) |
| [LESSON-PLAN.md](vocab-exam-web/LESSON-PLAN.md) | ลำดับการสอน 10 นาทีต่อฐาน และวิธีทำเพลง |
| [VOCAB-LEVELS.md](vocab-exam-web/VOCAB-LEVELS.md) | คำศัพท์ทั้ง 67 คำ เรียงจากยากไปง่าย (ยาก 18 · กลาง 34 · ง่าย 15) |
| [SONG-LYRICS.md](vocab-exam-web/SONG-LYRICS.md) | เนื้อเพลง 3 เวอร์ชัน: 🇹🇭 ไทย (ใช้กับกลุ่มไทย), 🌏 English (ใช้กับกลุ่มต่างชาติ), ผสม (ใช้ตอนรวมทุกกลุ่ม) พร้อม style prompt สำหรับ Suno |
| [VISUAL-IDEAS.md](vocab-exam-web/VISUAL-IDEAS.md) | ไอเดียภาพประกอบและตัวช่วยจำของทุกคำ |
| [vocab-exam-web/README.md](vocab-exam-web/README.md) | คู่มือใช้งานเว็บ, วิธีแก้เนื้อหา, วิธีเปลี่ยนโทนเว็บ |

## 🎞️ สไลด์ตัวอย่าง
https://claude.ai/artifact/84aWHxqLp8mgfcYBZNFAFv

มี 26 สไลด์ ได้แก่ ลำดับการสอน, ควิซอุ่นเครื่อง, การ์ดภาพคำยากครบ 18 ใบ (มีท่ามือและประโยคตัวอย่างในโน้ตผู้สอน), เนื้อเพลง, กลุ่มคำ, ควิซภาพ และหน้าสรุปพร้อม QR
> 🔒 ลิงก์นี้เป็นส่วนตัว คนอื่นจะเปิดได้ต่อเมื่อเจ้าของกด **Share** ที่หน้าสไลด์ก่อน

## ✏️ แก้ไขอะไรที่ไหน
| อยากแก้ | ไฟล์ |
|---|---|
| โทนสี / ฟอนต์ | [`vocab-exam-web/css/theme.css`](vocab-exam-web/css/theme.css) |
| คำศัพท์ ความหมาย เนื้อเพลงสำหรับควิซ | [`vocab-exam-web/data/vocab.js`](vocab-exam-web/data/vocab.js) |
| เนื้อเพลงที่ขึ้นจอ, กลุ่มคำ | [`vocab-exam-web/data/songs.js`](vocab-exam-web/data/songs.js) |
| ภาพประกอบ | ใส่ไฟล์ใน [`vocab-exam-web/images/`](vocab-exam-web/images/) |
| ไฟล์เพลง | ใส่ไฟล์ใน [`vocab-exam-web/audio/`](vocab-exam-web/audio/) |

แก้ไฟล์แล้วรวมเข้า branch `main` เว็บจะอัปเดตเองภายในประมาณ 1 นาที

## ✅ สถานะ
- [x] แยกคำศัพท์ตามระดับ, แผนการสอน, เนื้อเพลง 3 เวอร์ชัน, ไอเดียภาพ
- [x] เว็บต้นแบบ + Presenter mode + QR code (ออนไลน์แล้ว)
- [x] สไลด์ตัวอย่างพร้อมการ์ดคำยาก 18 ใบ
- [ ] โทนและการตกแต่งเว็บ (รอทีม)
- [ ] ภาพประกอบจริง (ตอนนี้ใช้อีโมจิแทน)
- [ ] ไฟล์เพลง `song-th.mp3` / `song-en.mp3`
