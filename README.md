# MED Clinic — Bemorlar uchun sayt (Patient Website)

Bemorlar shifokorlarni ko'rishi, profil va jadvalini o'rganishi, qabulga yozilishi va o'z qabullarini boshqarishi mumkin. **Kirish va parol talab qilinmaydi** — faqat telefon raqam.

> **Admin panel** alohida loyiha. Bu repo faqat bemor interfeysi.

---

## Tezkor ishga tushirish

```bash
yarn install
cp .env.example .env
yarn dev
```

[http://localhost:3000](http://localhost:3000) da oching.

---

## Skriptlar

| Buyruq | Tavsif |
|--------|--------|
| `yarn dev` | Development server |
| `yarn build` | Production build |
| `yarn start` | Production server (port 6565) |
| `yarn lint` | Kod tekshiruvi |

---

## Demo telefon raqami

**`+998 90 123 45 67`** raqamini "Mening qabullarim" sahifasiga kiriting. Barcha statuslardagi (kutilmoqda, tasdiqlangan, yakunlangan) qabullar ko'rinadi.

---

## Papka tuzilmasi

```
src/
  app/[locale]/          # Next.js App Router sahifalari
  components/
    clinic/              # Domain komponentlar (DoctorCard, AppointmentCard, ...)
    ui/                  # Design system (Button, Field, Skeleton, Toast, ...)
    header/ footer/      # Layout komponentlar
  hooks/clinic/          # TanStack Query hooklari
  lib/
    clinic-api/
      mock/              # Mock adapter (localStorage, seed ma'lumotlar)
      rest/              # REST adapter (haqiqiy API)
      index.ts           # Factory — NEXT_PUBLIC_API_MODE ga qarab adapter tanlaydi
  types/                 # Domain tiplari
  views/                 # Sahifa komponentlari
  lib/validations/       # Zod sxemalari
```

---

## Xususiyatlar

- [x] Shifokorlar ro'yxati: qidiruv (300ms debounce), mutaxassislik filtri, saralash — URL params bilan sinxron
- [x] Shifokor profil sahifasi: jadval, sharhlar, yozilish tugmasi
- [x] Qabulga yozilish formasi: Zod validatsiya (telefon format, sana, slot)
- [x] Mening qabullarim: telefon orqali qidiruv, localStorage auto-load, bekor qilish
- [x] Xizmatlar ro'yxati filtri bilan
- [x] Klinika haqida va Aloqa sahifalari
- [x] Responsive navbar (mobil hamburger) faol havola holati bilan
- [x] Toast bildirishnomalar, yuklash skeleti, bo'sh holatlar
- [x] SSR xavfsiz (localStorage faqat brauzerda)
- [x] To'liq mock rejimi — backend talab qilinmaydi
- [x] 404 not-found sahifasi
- [x] loading.tsx va error.tsx sahifalari

---

## Haqiqiy API ga ulash

### 1-qadam — env o'zgaruvchilarini o'rnating

```env
NEXT_PUBLIC_API_MODE=rest
NEXT_PUBLIC_API_URL=https://sizning-api.example.com/v1
```

### 2-qadam — REST adapter endpoint yo'llarini tekshiring

`src/lib/clinic-api/rest/adapter.ts` barcha API chaqiruvlarini boshqaradi:

| Metod | Endpoint | Tavsif |
|-------|----------|--------|
| GET | `/clinic` | Klinika ma'lumotlari |
| GET | `/specialties` | Barcha mutaxassisliklar |
| GET | `/doctors` | Shifokorlar ro'yxati (`?search`, `?specialtyId`, `?sort`) |
| GET | `/doctors/:id` | Bitta shifokor |
| GET | `/services` | Xizmatlar ro'yxati (`?search`, `?specialtyId`, `?sort`) |
| GET | `/services/:id` | Bitta xizmat |
| GET | `/slots` | Bo'sh vaqt slotlari (`?doctorId`, `?date`, `?serviceId`) |
| GET | `/appointments` | Bemor qabullari (`?phone`) |
| POST | `/appointments` | Qabul yaratish |
| PATCH | `/appointments/:id/cancel` | Qabulni bekor qilish |
| POST | `/contact` | Aloqa formasi |

### 3-qadam — Mapper maydon nomlarini moslashtiring

Backend maydon nomlari farq qilsa, faqat `src/lib/clinic-api/rest/adapter.ts` ni tahrirlang. Komponentlar hech qanday o'zgarishni talab qilmaydi.

---

## Ma'lum cheklovlar

- **Telefon orqali qidiruv xavfsiz emas**: Telefon raqamini bilgan har kim qabullarni ko'ra oladi. Ishlab chiqarishda API da OTP/SMS tasdiqni qo'shing.
- **Autentifikatsiya yo'q**: Bu loyiha doirasida ataylab. Admin panel (alohida loyiha) autentifikatsiyani boshqaradi.
- **Qabul holati boshqaruvi**: Tasdiqlash/yakunlash admin panelida bo'ladi. Bemorlar faqat o'z qabulini bekor qila oladi.

---

## Vercel ga deploy

1. GitHub ga push
2. Vercel da repo import qiling
3. Env variables o'rnating: `NEXT_PUBLIC_API_MODE`, `NEXT_PUBLIC_API_URL`
4. Deploy — Vercel Next.js ni avtomatik aniqlaydi

---

## Texnologiyalar

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui komponentlar
- **TanStack Query** ma'lumotlar olish uchun
- **React Hook Form** + **Zod** validatsiya uchun
- **next-intl** i18n routing uchun (default: `uz`)
- **Mock adapter**: localStorage, 10 ta shifokor va 3 ta namuna qabul bilan seeding
