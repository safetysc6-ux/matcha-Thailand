# Matcha Thailand MVP

เว็บมัทฉะสไตล์มินิมอลญี่ปุ่นสำหรับผู้ใช้ทั่วไป (ไม่ต้องล็อกอิน) พร้อมหน้าแอดมินสำหรับจัดการสินค้าและบทความสูตร รวมถึงเครื่องมือคำนวณต้นทุนที่บันทึกลง Supabase ได้

## Pages
- `index.html` หน้าแรก + สินค้าแนะนำ + บทความสูตรแนะนำ
- `recipes.html` หน้าแสดงบทความสูตรมัทฉะทั้งหมด
- `calculator.html` หน้าคำนวณต้นทุนและบันทึกผลลง Supabase
- `admin.html` หน้าแอดมินสำหรับเพิ่ม/แก้ไข/ลบสินค้าและบทความสูตร

## Setup
1. ตั้งค่า `SUPABASE_URL` และ `SUPABASE_ANON_KEY` ใน `supabase-config.js`
2. รัน SQL ที่ `supabase/schema.sql`
3. เปิดเว็บด้วย static server
