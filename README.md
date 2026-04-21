# Temp Mail App ✉️

Welcome to the **Temp Mail App**, a minimalistic, modern, and high-performance temporary email web application built with [Next.js](https://nextjs.org/) and the [Mail.tm API](https://mail.tm/en/).

---

## 🇬🇧 English

### Overview
This project provides an instant, disposable email service originally created to efficiently bypass email verification hurdles when registering for games. It helps users protect their primary email addresses from spam, promotional emails, and potential data leaks. With a sleek "Light Glassmorphism" UI, the app offers a smooth and intuitive user experience.

### Key Features
- **Instant Email Generation:** Automatically generates a random temporary email address upon loading.
- **Auto-Refresh Inbox:** Continually checks for new emails every few seconds (polling/SSE).
- **Copy to Clipboard:** Easily copy the generated email address with a single click.
- **Message Details:** Read incoming emails seamlessly within the app.
- **Modern UI/UX:** Features a beautiful Light Glassmorphism aesthetic, smooth animations using `framer-motion`, and a responsive design powered by `tailwindcss`.
- **Built-in Carousel:** A banner carousel showcasing app features.

### Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + PostCSS
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **API:** Mail.tm API via Axios

### Getting Started (How to run this project on your computer)
To run this project on your own computer, you will need to open your terminal (or Command Prompt) and follow these exact steps:

1. **Download the code to your machine:**
   ```bash
   git clone <repository-url>
   ```
   *(Note: replace `<repository-url>` with the actual link to this GitHub project).*

2. **Install the required packages:**
   ```bash
   npm install
   ```
   *(This downloads Next.js, React, and all the tools needed to run the app).*

3. **Start the local server:**
   ```bash
   npm run dev
   ```
   *(This starts the app on your computer so you can use it or edit it).*

4. **Open the app:** Open your web browser (like Chrome, Edge, or Safari) and go to [http://localhost:3000](http://localhost:3000).

---

## 🇹🇭 ภาษาไทย (Thai)

### ภาพรวม
โปรเจกต์นี้คือแอปพลิเคชันให้บริการอีเมลชั่วคราว (Temporary Email) แบบใช้งานได้ทันที ซึ่งตอนแรกสร้างขึ้นมาเพื่อแก้ปัญหาตอนสมัครไอดีเกมที่ต้องใช้อีเมลยืนยันตัวตน นอกจากนี้ยังเพื่อช่วยหลีกเลี่ยงสแปม (Spam) อีเมลโฆษณา และการรั่วไหลของข้อมูลส่วนตัว ตัวแอปได้รับการออกแบบด้วยสไตล์ "Light Glassmorphism" ที่ดูสะอาดตา ทันสมัย และใช้งานง่าย

### ฟีเจอร์หลัก
- **สร้างอีเมลอัตโนมัติ:** สร้างที่อยู่อีเมลชั่วคราวแบบสุ่มให้ทันทีเมื่อเข้าสู่เว็บไซต์
- **อัปเดตกล่องจดหมายอัตโนมัติ:** คอยตรวจสอบและดึงอีเมลใหม่เข้ามาแสดงผลอัตโนมัติ 
- **คัดลอกอีเมลง่ายดาย:** คัดลอกที่อยู่อีเมลไปใช้งานต่อได้ทันทีด้วยการคลิกเพียงครั้งเดียว
- **อ่านรายละเอียดอีเมล:** สามารถเปิดอ่านเนื้อหาจดหมายที่เข้ามาจากภายในแอปได้เลย
- **ดีไซน์ทันสมัย (Modern UI/UX):** สวยงามด้วย Light Glassmorphism, มีลากลูกเล่นแอนิเมชันที่ลื่นไหลจาก `framer-motion` และรองรับการแสดงผลทุกหน้าจอด้วย `tailwindcss`
- **ลูกเล่นแบนเนอร์ค่ายกล:** มี Banner Carousel ที่คอยแนะนำฟีเจอร์ต่างๆ 

### เทคโนโลยีที่ใช้
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + PostCSS
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **API:** เรียกใช้งาน Mail.tm API ผ่าน Axios

### วิธีการติดตั้งและเริ่มใช้งาน (สำหรับรันบนเครื่องตัวเอง)
หากคุณต้องการหน้าเว็บนี้ไปรันบนคอมพิวเตอร์ของคุณเอง ให้เปิดโปรแกรม Terminal (หรือ Command Prompt) แล้วทำตามขั้นตอนต่อไปนี้ทีละขั้นตอน:

1. **ดาวน์โหลดโค้ดโปรเจกต์ลงเครื่อง:**
   ```bash
   git clone <repository-url>
   ```
   *(หมายเหตุ: อย่าลืมเปลี่ยน `<repository-url>` เป็นลิงก์ที่แท้จริงของโปรเจกต์ GitHub นี้)*

2. **ติดตั้งไลบรารีและเครื่องมือที่จำเป็น:**
   ```bash
   npm install
   ```
   *(คำสั่งนี้จะทำการดาวน์โหลด Next.js, React และไฟล์ต่างๆ ที่จำเป็นทั้งหมดสำหรับการทำงาน)*

3. **เปิดเซิร์ฟเวอร์รันแอปบนเครื่อง:**
   ```bash
   npm run dev
   ```
   *(คำสั่งนี้จะเปิดการทำงานของแอปบนคอมพิวเตอร์ของคุณ เพื่อให้คุณใช้งานหรือแก้ไขโค้ดได้)*

4. **เปิดเข้าไปใช้งาน:** ให้เปิดโปรแกรมเว็บเบราว์เซอร์ (เช่น Google Chrome) แล้วเข้าไปที่ [http://localhost:3000](http://localhost:3000)

---
*Created with ❤️ by the open-source community.*
