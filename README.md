This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

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
 │   └── Sidebar.tsx          # Sidebar Component
 │
 │
 ├── lib/
 │   └── db.ts                # Database Connection
 │
 │
 │
 └── public/
```

---

## API Endpoints Role Admin

| Endpoint                             | Method              | Function                                                                      |
| ------------------------------------ | ------------------- | ----------------------------------------------------------------------------- |
| `/api/admin/area-parkir`             | POST & GET          | Add Area Parkir & Get Area Parkir                                             |
| `/api/admin/area-parkir/[id_area]`   | GET, DELETE & PATCH | Get Area Parkir by ID, Delete Area Parkir by ID & Update Area Parkir by ID    |
| `/api/admin/tarif-parkir`            | POST & GET          | Add Tarif Parkir & Get Tarif Parkir                                           |
| `/api/admin/tarif-parkir/[id_tarif]` | GET, DELETE & PATCH | Get Tarif Parkir by ID, Delete Tarif Parkir by ID & Update Tarif Parkir by ID |
| `/api/admin/user`                    | POST & GET          | Add User & Get User                                                           |
| `/api/admin/user/[id_user]`          | GET, DELETE & PATCH | Get User by ID, Delete User by ID & Update User by ID                         |



## API Endpoints Role On Boarding

| Endpoint                      | Method | Function      |
| ----------------------------- | ------ | ------------- |
| `/api/on-boarding/login`      | POST   | Login user    |
| `/api/on-boarding/registrasi` | POST   | Register user |
