# ♻️ Recycle-Bin App

Aplikasi web berbasis **AI + Web Modern** untuk pengelolaan dan analisis data terkait Recycle-Bin.  
Project ini menggunakan **Next.js 16**, **Prisma ORM**, dan **FastAPI** untuk model AI/ML.

---

## 🚀 Tech Stack

### Frontend & Backend (Web)
- **Next.js**: v16 (App Router)
- **React**: v19
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **lucide-react (icons)**
- **Framer Motion (animation)**

### Database
- **Prisma ORM**: v5+
- **Database**: PostgreSQL

### Artificial Intelligence
- **Python**: 3.10+
- **FastAPI**
- **TensorFlow / PyTorch** (opsional, sesuai model)
- **Uvicorn**

---

## 📂 Struktur Repository
- `app/` - halaman UI dan API routes (Next.js App Router)
- `components/` - komponen UI reusable
- `lib/` - auth, prisma, dan utilitas
- `prisma/` - schema, migrations, dan seeder
- `public/` - aset statis

## Dokumentasi

### 1) Instalasi Project
Prasyarat:
- Node.js 18+ (disarankan 20+)
- PostgreSQL 14+
- Python 3.10+ (untuk AI service)

Langkah instalasi:
1. Clone repository.
2. Install dependencies:
	```bash
	npm install
	```
3. Salin file environment:
	- Windows: `copy .env.example .env.local`
	- macOS/Linux: `cp .env.example .env.local`

### 2) Setup Frontend & Backend (Next.js)
Konfigurasi `.env.local` (sesuaikan nilai):
```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/eco_recycle?schema=public"
SHADOW_DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/eco_recycle_shadow?schema=public"
NEXTAUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
AI_MODEL_URL="http://localhost:8000/predict"
# Opsional (disarankan untuk production):
# NEXTAUTH_URL="https://your-domain.com"
```

Jalankan server pengembangan:
```bash
npm run dev
```
Buka `http://localhost:3000` di browser.

### 3) Setup Database PostgreSQL
1. Buat database PostgreSQL sesuai nama pada `DATABASE_URL`.
2. Jalankan migrasi Prisma:
	```bash
	npx prisma migrate dev --name init
	```
3. (Opsional) Seed data:
	```bash
	npx prisma db seed
	```
	Untuk seed admin + quiz secara lengkap:
	```bash
	npx tsx prisma/seed-all.ts
	```

### 4) Menjalankan FastAPI AI Service
Secara default, aplikasi akan memakai endpoint AI dari `AI_MODEL_URL` (lihat `.env.example`).
Jika ingin menjalankan FastAPI sendiri:
1. Jalankan service FastAPI di repo/service AI Anda.
	```bash
	pip install -r requirements.txt
	uvicorn main:app --reload --host 0.0.0.0 --port 8000
	```
2. Pastikan `.env.local` berisi:
	```bash
	AI_MODEL_URL="http://localhost:8000/predict"
	```
3. Endpoint FastAPI harus menerima `POST` multipart `file` dan mengembalikan JSON berisi `label` dan `confidence` (atau format `data` yang setara).

### 5) Deployment Aplikasi
**Opsi A: Vercel**
1. Hubungkan repository ke Vercel.
2. Set environment variables (DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AI_MODEL_URL, dan NEXTAUTH_URL).
3. Jalankan migrasi di proses deploy/CI:
	```bash
	npx prisma migrate deploy
	```

**Opsi B: Self-host (Node.js server)**
1. Build aplikasi:
	```bash
	npm run build
	```
2. Jalankan migrasi production:
	```bash
	npx prisma migrate deploy
	```
3. Start server:
	```bash
	npm run start
	```
4. Pastikan AI service sudah ter-deploy dan `AI_MODEL_URL` menunjuk ke URL produksi.
