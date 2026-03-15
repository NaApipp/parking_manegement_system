```markdown
# ParkingLogic

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-Framework-black)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue)
![Maintained](https://img.shields.io/badge/maintained-yes-success)

ParkingLogic adalah sebuah **Web Application** yang dirancang untuk membantu pengelolaan sistem parkir secara terorganisir dan efisien. Aplikasi ini menyediakan sistem manajemen parkir yang terstruktur dengan dukungan **multi-role user**, sehingga setiap pengguna memiliki hak akses dan kemampuan yang berbeda sesuai dengan perannya.

ParkingLogic dibangun menggunakan **Next.js** sebagai framework utama untuk pengembangan aplikasi web modern dan **MySQL** sebagai sistem manajemen basis data yang stabil dan scalable.

---

# 1. Deskripsi & Fitur Utama

ParkingLogic dikembangkan untuk mempermudah operasional parkir dengan sistem yang terintegrasi dan mudah digunakan oleh berbagai jenis pengguna dalam satu platform.

## Sistem Multi Role

Aplikasi menyediakan tiga role utama:

### 1. Admin
Memiliki akses penuh terhadap sistem.

Fitur:
- Mengelola pengguna
- Mengelola area parkir
- Mengatur tarif parkir
- Melihat laporan transaksi
- Monitoring aktivitas sistem

### 2. Petugas Parkir
Digunakan oleh operator parkir di lapangan.

Fitur:
- Mencatat kendaraan masuk
- Mencatat kendaraan keluar
- Menghitung biaya parkir otomatis
- Melihat status slot 
- Cetak Transaksi

### 3. Supervisor / Manajer / Owner 
Digunakan untuk monitoring operasional.

Fitur:
- Melihat laporan transaksi

## Manajemen Parkir

Sistem mendukung pengelolaan parkir secara lengkap:

- Pencatatan kendaraan masuk
- Pencatatan kendaraan keluar
- Perhitungan tarif parkir otomatis
- Monitoring slot parkir
- Riwayat kendaraan

## Dashboard Monitoring

Dashboard menyediakan informasi penting seperti:

- Total kendaraan aktif
- Total kendaraan masuk dan keluar
- Slot parkir tersedia
- Ringkasan transaksi parkir

## Keamanan Sistem

ParkingLogic menerapkan sistem keamanan dasar seperti:

- Authentication login
- Authorization berbasis role
- Validasi input data
- Proteksi API endpoint

---

# 3. Tech Stack

ParkingLogic menggunakan teknologi modern untuk memastikan performa dan maintainability aplikasi.

## Frontend

* Next.js
* React.js
* Tailwind CSS atau CSS Modules

## Backend

* Next.js API Routes
* Node.js

## Database

* MySQL

## Development Tools

* npm
* dotenv
* ESLint
* Prettier

---

# 6. Cara Penggunaan (Usage)

Berikut alur penggunaan utama sistem.

## Login

1. Buka aplikasi melalui browser
2. Masukkan username dan password
3. Sistem akan mengarahkan ke dashboard sesuai role

## Kendaraan Masuk

Petugas parkir melakukan:

1. Membuka menu kendaraan masuk
2. Menginput data kendaraan:

   * Nomor kendaraan
   * Jenis kendaraan
   * Area parkir
3. Sistem otomatis mencatat waktu masuk

## Kendaraan Keluar

1. Petugas memilih kendaraan aktif
2. Sistem menghitung:

   * Durasi parkir
   * Tarif parkir
3. Petugas mengkonfirmasi transaksi

## Monitoring Parkir

Admin dan supervisor dapat:

* Melihat kendaraan aktif
* Melihat slot parkir tersedia
* Melihat laporan transaksi


# 9. Roadmap & Fitur Mendatang

Beberapa fitur yang direncanakan untuk pengembangan selanjutnya:

* Integrasi QR Code untuk tiket parkir
* Integrasi barcode scanner kendaraan
* Integrasi payment gateway
* Dashboard analitik lebih lengkap
* Notifikasi real-time
* Multi-location parking management
* Integrasi sensor parkir berbasis IoT
* Mobile responsive improvement
* Export laporan (PDF / Excel)

---
```

---

ParkingLogic dibuat untuk memberikan solusi sistem parkir yang terorganisir, efisien, dan mudah dikembangkan untuk berbagai kebutuhan operasional parkir modern.


## Hidden Link (For Register)
[parkinglogic.vercel.app/a7k9q2m5x1b8r4t6z3l](http://parkinglogic.vercel.app/a7k9q2m5x1b8r4t6z3l)

## Commit Convention

We follow a strict commit message format to ensure a clean and searchable git history.

**Format:** `type (scope/page) : Description`

| Type       | Description                                           |
| :--------- | :---------------------------------------------------- |
| `feat`     | Adding a new feature                                  |
| `fix`      | Fixing a bug                                          |
| `docs`     | Documentation updates                                 |
| `style`    | Formatting or style changes (no logic changes)        |
| `refactor` | Code changes that neither fix a bug nor add a feature |
| `test`     | Adding or correcting tests                            |
| `chore`    | Task updates or configuration changes                 |

**Examples:**

- `feat (navbar): add dropdown menu`
- `fix (auth): resolve login redirect issue`
- `refactor: simplified the data fetching logic`

## User For Testing and Demo
**Role Admin:**
- Username: user_admin
- Password: [user_admin]

**Role Petugas:**
- Username: user_petugas
- Password: [user_petugas]

**Role Owner:**
- Username: user_owner
- Password: [user_owner]


## API Endpoints Role Admin

| Endpoint                             | Method              | Function                                                                      |
| ------------------------------------ | ------------------- | ----------------------------------------------------------------------------- |
| `/api/admin/area-parkir`             | POST & GET          | Add Area Parkir & Get Area Parkir                                             |
| `/api/admin/area-parkir/[id_area]`   | GET, DELETE & PATCH | Get Area Parkir by ID, Delete Area Parkir by ID & Update Area Parkir by ID    |
| `/api/admin/tarif-parkir`            | POST & GET          | Add Tarif Parkir & Get Tarif Parkir                                           |
| `/api/admin/tarif-parkir/[id_tarif]` | GET, DELETE & PATCH | Get Tarif Parkir by ID, Delete Tarif Parkir by ID & Update Tarif Parkir by ID |
| `/api/admin/user`                    | POST & GET          | Add User & Get User                                                           |
| `/api/admin/user/[id_user]`          | GET, DELETE & PATCH | Get User by ID, Delete User by ID & Update User by ID                         |

## API Endpoints Role Petugas

| Endpoint                                | Method      | Function                                      |
| --------------------------------------- | ----------- | --------------------------------------------- |
| `/api/petugas/area`                     | GET         | GET Overall data Area                         |
| `/api/petugas/kendaraan`                | GET         | GET Overall data Kendaraan                    |
| `/api/petugas/tarif`                    | GET         | GET Overall data Tarif                        |
| `/api/petugas/transaksi`                | GET & POST  | GET Overall data Transaksi & Add Transaksi    |
| `/api/petugas/transaksi/[id_parkir]`    | GET & PATCH | GET Detail Transaksi & Update Transaksi by ID |
| `/api/petugas/transaksi/[id_parkir]/pdf`| GET         | GET Detail Transaksi for export to PDF |

## API Endpoints On Boarding

| Endpoint                      | Method | Function      |
| ----------------------------- | ------ | ------------- |
| `/api/on-boarding/login`      | POST   | Login user    |


## Folder Structure (Simple Explanation)

```
src/
 ├── app/
 │   |
 │   │
 │   ├── (OnBoarding)/
 │   │   └── login/
 │   │       └── page.tsx             # Login Form
 │   │   └── registrasi/
 │   │       └── page.tsx             # Registrasi Form
 │   │
 │   ├── api/
 │   │   └── admin  /
 │   │   │    └── area-parkir/
 │   │   │    |   └── [id_area]/
 │   │   │    |   |   └── route.ts     # API for Area Parkir
 │   │   │    |   └── route.ts         # API for Area Parkir
 │   │   │    │
 │   │   │    │
 │   │   │    └── tarif-parkir /
 │   │   │    |   └── [id_tarif]/      # API for Tarif Parkir
 │   │   │    |   |   └── route.ts     # API for Tarif Parkir
 │   │   │    |   └── route.ts         # API for Area Parkir
 │   │   │    │
 │   │   │    │
 │   │   │    └── user /
 │   │   │    |   └── [id_user]/      # API for User
 │   │   │    |   |   └── route.ts     # API for User
 │   │   │    |   └── route.ts         # API for Area Parkir
 │   │   │    │
 │   │   │    │
 │   │   └── on-boarding  /
 │   │       └── login/
 │   │       |   └── page.tsx         # Login Form
 │   │       └── registrasi/
 │   │          └── page.tsx         # Registrasi Form
 │   │
 │   │
 │   │
 ├── components/
 │   ├── Sidebar.tsx          # Sidebar Component
 │   ├── ButtonCopy.tsx       # Button Copy Component
 │   └── ButtonLogout.tsx     # Button Logout Component
 │
 │
 ├── lib/
 │   ├── db.ts                # Database Connection
 │
 │
 │
 └── public/
```

---
