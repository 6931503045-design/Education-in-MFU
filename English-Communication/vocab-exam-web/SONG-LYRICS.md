# เนื้อเพลงท่องศัพท์ (เวอร์ชันสุดท้าย)

- **ไม่มีไฟล์เสียง** ผู้สอนอ่านท่อนบนจอเป็นจังหวะ (ปรบมือ 4 จังหวะ) แล้วให้กลุ่มพูดตาม พร้อมทำท่ามือของคำนั้น
- มี **18 ท่อน 1 ท่อนต่อ 1 คำยาก** เรียงตามบทเรียน ใช้เวลาประมาณ 10 วินาทีต่อท่อน รวมประมาณ 3 นาที
- กลุ่มไทยใช้ **🇹🇭 เวอร์ชันไทย** กลุ่มต่างชาติใช้ **🌏 English** (หน้า Presenter สลับให้อัตโนมัติตามปุ่มภาษา)
- เวอร์ชันอังกฤษย่อเหลือ 3–5 คำต่อท่อน ท่อนเดียวกันนี้ใช้เป็นเนื้อเพลงใต้ภาพในควิซด้วย เช่น "_____, cut the tie!"
- ข้อมูลจริงที่เว็บใช้อยู่ใน `data/vocab.js` (ฟิลด์ `lyric_th` = ไทย, `lyric` = อังกฤษ) ถ้าจะแก้เนื้อเพลง ให้แก้ที่นั่น

| # | คำ | 🇹🇭 เวอร์ชันไทย | 🌏 English |
|---|---|---|---|
| | **บทที่ 1** | | |
| 1 | alleviate | ยาบรรเทา Alleviate ลดเจ็บลดไข้ | Alleviate, ease the pain! |
| 2 | attentively | Attentively ตั้งใจฟัง ครูสอนทุกครั้งจำได้ไว | Attentively, listen carefully! |
| 3 | constructive | Constructive ติเพื่อก่อ ช่วยให้ดีขึ้นทุกวัน | Constructive, helpful advice! |
| 4 | diligently | Diligently ขยันทำ ตั้งใจจำทุกคืนวัน | Diligently, work hard every day! |
| 5 | enhance | Enhance เพิ่มให้ดี เก่งขึ้นทุกที เย้ เย้ เย้ | Enhance, make it better! |
| 6 | enthusiastically | Enthusiastically ไฟแรงจัง กระตือรือร้นมีพลัง | Enthusiastically, full of energy! |
| 7 | extracurricular | Extracurricular หลังเลิกเรียน กิจกรรมสนุกวนเวียน | Extracurricular, fun after school! |
| 8 | pandemic | Pandemic โรคระบาด แพร่หลายชาติทั่วโลกเลย | Pandemic, sickness worldwide! |
| 9 | proofread | Proofread ตรวจคำผิด เช็กอีกนิดก่อนส่งไป | Proofread, check before you send! |
| | **บทที่ 2** | | |
| 10 | intruder | Intruder ผู้บุกรุก เข้ามาบุกไม่เชิญเลย | Intruder, go away! |
| | **บทที่ 3** | | |
| 11 | assortment | Assortment ของหลากหลาย รวมกันไว้หลายชนิด | Assortment, a mix of things! |
| 12 | etiquette | Etiquette มารยาทดี พูดจาดีมีน้ำใจ | Etiquette, be polite! |
| 13 | minimise | Minimise ลดให้น้อย ลดอีกหน่อยจนเหลือนิด | Minimise, make it small! |
| 14 | misperception | Misperception เข้าใจผิด คิดอีกนิดก่อนตัดสิน | Misperception, got it wrong! |
| 15 | obscene | Obscene คำหยาบคาย ไม่สุภาพไม่ควรใช้ | Obscene, rude, not clean! |
| 16 | reciprocal | Reciprocal เธอให้ฉัน ฉันให้เธอ ตอบแทนกัน | Reciprocal, give and take! |
| 17 | remarkably | Remarkably น่าทึ่งจัง โดดเด่นปังเกินคาดเลย | Remarkably, wow, amazing! |
| 18 | severance | Severance การตัดขาด แยกทางกันจบสัมพันธ์ | Severance, cut the tie! |

> ท่อนไทยของ *constructive* ปรับจาก "คิดสร้างสรรค์ ช่วยกันพัฒนาทุกวัน" เป็น "ติเพื่อก่อ ช่วยให้ดีขึ้นทุกวัน" เพราะในบทเรียน constructive แปลว่า "ช่วยให้ดีขึ้น" (constructive feedback = คำติชมที่ช่วยปรับปรุง) ไม่ใช่ "สร้างสรรค์" แบบ creative

## ท่ามือประกอบ
ท่ามือของแต่ละคำจะขึ้นในโน้ตผู้สอนของหน้า Presenter (ช่วงการ์ดภาพ) เก็บอยู่ในฟิลด์ `gesture` ของ `data/vocab.js` เช่น
- *minimise* = บีบนิ้วโป้งกับนิ้วชี้เข้าหากัน "นิดเดียว"
- *reciprocal* = ชี้ไปที่เพื่อน แล้วชี้กลับมาที่ตัวเอง
- *severance* = ทำนิ้วเป็นกรรไกร ตัดระหว่างสองมือ
