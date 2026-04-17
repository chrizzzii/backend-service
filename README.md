# 📊 HR Monitoring & WFH Attendance System (Backend)

Sistem backend berbasis **Microservices** yang dibangun menggunakan **NestJS** untuk mengelola data master karyawan dan absensi Work-From-Home (WFH) dengan verifikasi foto.

Arsitektur aplikasi memisahkan layanan menjadi beberapa service independen yang saling berkomunikasi menggunakan protokol **HTTP** dan **TCP**.

---

## 🚀 Arsitektur Microservices

Aplikasi ini terdiri dari 3 layanan utama:

### 🔐 Auth Service

**HTTP:** `3001`  
**TCP:** `8001`

- Menangani autentikasi (Login) & otorisasi menggunakan JWT
- Mendengarkan event TCP:
  - `employee_created`
  - `employee_deleted`
- Otomatis membuat/menghapus akun user berdasarkan perubahan data karyawan

---

### 👨‍💼 Employee Service

**HTTP:** `3002`

- Mengelola **CRUD Master Data Karyawan**
  - NIK
  - Nama
  - Posisi
- Dilindungi dengan **Role-Based Access Control (RBAC)**
- Hanya role **admin** yang dapat mengakses
- Mengirim event ke Auth Service melalui TCP

---

### 🕒 Attendance Service

**HTTP:** `3003`

- Menangani absensi WFH (check-in)
- Upload bukti foto menggunakan **Multer**
- Menyediakan data monitoring absensi untuk HRD

---

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database ORM**: Drizzle ORM
- **Database**: MySQL / MariaDB (`mysql2`)
- **Authentication**: Passport JWT
- **File Upload**: Multer
- **Communication**: NestJS Microservices (TCP)

---

## 📋 Prasyarat Sistem

- Node.js (v18 atau lebih baru)
- MySQL / MariaDB (port 3306)

---

## ⚙️ Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/chrizzzii/backend-service.git
cd backend-service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

Buat 3 database terpisah:

- absensi_auth_db
- absensi_employee_db
- absensi_attendance_db

---

### 4. Konfigurasi Database (Drizzle ORM)

```bash
npm run db:push:all
npm run seed:all
```

---

## ▶️ Menjalankan Aplikasi

Jalankan tiap service di terminal berbeda:

### Terminal 1 – Auth Service

```bash
nest start auth-service --watch
```

### Terminal 2 – Employee Service

```bash
nest start employee-service --watch
```

### Terminal 3 – Attendance Service

```bash
nest start attendance-service --watch
```

> ⚠️ Jalankan Auth Service terlebih dahulu karena service lain bergantung pada koneksi TCP.

---

## 📡 Dokumentasi API

### 1. Auth Service

Base URL: `http://localhost:3001`

| Method | Endpoint    | Akses  | Deskripsi               |
| ------ | ----------- | ------ | ----------------------- |
| POST   | /auth/login | Public | Login & mendapatkan JWT |

---

### 2. Employee Service

Base URL: `http://localhost:3002`

Semua endpoint membutuhkan:

```
Authorization: Bearer <token>
Role: admin
```

| Method | Endpoint       | Deskripsi                      |
| ------ | -------------- | ------------------------------ |
| GET    | /employees     | Ambil semua data karyawan      |
| POST   | /employees     | Tambah karyawan                |
| PUT    | /employees/:id | Update data karyawan           |
| DELETE | /employees/:id | Hapus karyawan & akun          |

---

### 3. Attendance Service

Base URL: `http://localhost:3003`

Semua endpoint membutuhkan JWT Token

| Method | Endpoint                   | Akses  | Deskripsi             |
| ------ | -------------------------- | ------ | --------------------- |
| POST   | /attendance/check-in       | Semua  | Upload absensi + foto |
| GET    | /attendance/monitoring     | Admin  | Semua data absensi    |
| GET    | /attendance/monitoring/:id | Admin  | Absensi per karyawan  |
| GET    | /uploads/attendance/:file  | Public | Akses gambar          |

---

## 🔐 Role-Based Access Control (RBAC)

Aplikasi menggunakan JWT Strategy dan RolesGuard dari NestJS.

### 👑 Admin

- CRUD data karyawan
- Monitoring seluruh absensi

### 👤 Employee

- Hanya bisa melakukan check-in absensi
