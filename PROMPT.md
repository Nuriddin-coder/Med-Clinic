You are a senior frontend engineer. I already have a Next.js template in this repo. Build the PUBLIC patient-facing website "MED Clinic" (online medical services) on top of it as a fully working MVP with MOCK data, architected so a real REST API can be plugged in later by changing ONE env variable, without touching UI code.

SCOPE (important):
- This is ONLY the public website for patients. The admin panel is a SEPARATE project built by someone else. Do NOT build any admin panel, admin routes, login/register pages, roles, sessions, protected routes, or middleware auth.
- No authentication at all. Patients are identified only by the phone number they enter.
- Doctors are READ-ONLY in this project (no create/update/delete). Appointment statuses are managed by the admin project; here the patient can only create an appointment and cancel their own.

This is NOT a mockup or landing page. Every button, form, search, filter, sort and action must really work. UI language: Uzbek (Latin script). Code, comments, identifiers: English.

## STEP 0 — INSPECT FIRST (before writing code)
1. Read package.json, next.config, tsconfig, tailwind config, folder structure, existing components, layout, styles.
2. Detect: App Router vs Pages Router, Tailwind version, existing UI components, ESLint/Prettier config, path aliases.
3. Reuse the template's conventions, components and design tokens. Do NOT delete working template parts without reason. Install only missing packages.
4. Print a short summary of findings and your plan, then proceed.

## TECH STACK
- Next.js (template's router; prefer App Router), React, TypeScript strict (no `any`)
- Tailwind CSS (no other UI kit)
- React Hook Form + Zod + @hookform/resolvers
- Next.js file-based routing (replaces React Router; same routes)
- Mock DB: localStorage, accessed ONLY inside the mock adapter
- Deployable to Vercel

## CRITICAL: SSR / HYDRATION RULES
- localStorage exists only in the browser. Pages/components reading mock data are Client Components ("use client") and load data in hooks/effects, never during server render.
- No hydration mismatches: render loading state first, then data.
- Components using useSearchParams must be wrapped in <Suspense>.
- Never access `window`/`localStorage` at module top level.

## DATA LAYER — API-READY ARCHITECTURE (most important part)
UI components → hooks (useDoctors, useDoctor, useAppointments, useBookedSlots) → services (repository interfaces) → adapter (mock | api)

src/
  types/            domain types + DTOs
  lib/
    config.ts       reads NEXT_PUBLIC_DATA_SOURCE ("mock" | "api") and NEXT_PUBLIC_API_URL
    date.ts phone.ts format.ts
    http.ts         tiny fetch wrapper (base URL, JSON, error normalization -> ApiError)
  services/
    contracts.ts    DoctorRepository, AppointmentRepository interfaces
    index.ts        factory exporting active repositories based on config
    mock/           mockDoctorRepository, mockAppointmentRepository, storage.ts, seed.ts
    api/            apiDoctorRepository, apiAppointmentRepository, mappers.ts
  features/ doctors / appointments  (components, hooks, schemas)
  components/ ui/ layout/

Rules:
- Interfaces are the contract; all methods async (Promises). UI and hooks import ONLY from `services/index.ts`, never from `mock/` or `api/`, and never touch localStorage directly.
- Interfaces:
  - DoctorRepository: list(params?: {search?, specialty?, sort?}), getById(id), listSpecialties()
  - AppointmentRepository: listByPhone(phone), create(input), cancel(id), getBookedSlots(doctorId, date)
- `api/` adapters must be REAL, complete implementations (not empty stubs) using lib/http.ts against documented assumed endpoints:
  GET /doctors, GET /doctors/:id, GET /specialties, POST /appointments, GET /appointments?phone=, PATCH /appointments/:id/cancel, GET /appointments/booked-slots?doctorId&date
  Put the endpoint + DTO table in the README. Use mappers.ts to convert API DTOs ↔ domain types so backend field names change in ONE place.
- Standardized errors: `AppError` with `code` (SLOT_TAKEN, NOT_FOUND, VALIDATION, NETWORK, UNKNOWN) and an Uzbek `message`. Both adapters throw the same shapes so UI error handling is identical.
- `NEXT_PUBLIC_DATA_SOURCE=mock` (default) or `api`. Provide `.env.example`.
- Mock adapter: simulate 400–700ms latency, versioned seed (`medclinic:version`), keys prefixed `medclinic:`, safe JSON parse with try/catch and fallback to seed on corrupted data.
- Double-booking prevention is enforced inside the service at write time (re-check right before saving), not only in the UI. Cancelled appointments free the slot. Throw SLOT_TAKEN on conflict.
- Hooks expose `{ data, isLoading, error, refetch }`; mutations expose `{ mutate, isPending, error }`. Handle loading/error for every async call. (Use TanStack Query ONLY if already in the template; otherwise write small custom hooks.)

## PATIENT IDENTIFICATION (no auth)
- No login pages, no session, no roles.
- Phone number is the only identifier. Normalize to `+998XXXXXXXXX` everywhere.
- After a successful booking, save the phone in localStorage (`medclinic:lastPhone`) purely as a convenience so /my-appointments can auto-load. This is NOT security; document it as a known limitation (anyone knowing a phone number could look up its appointments; real API should add OTP/verification later).

## ROUTES
- `/` Home
- `/doctors` list
- `/doctors/[id]` profile (show "Shifokor topilmadi" for invalid id)
- `/appointment` booking (support `?doctorId=` prefill)
- `/my-appointments`
- `not-found` page
(No /login, no /admin.)

## PAGE REQUIREMENTS

### Home
Inline SVG MED Clinic logo; responsive navbar (hamburger on mobile, active link state; links: Bosh sahifa, Shifokorlar, Mening qabullarim, Qabulga yozilish); hero with doctor search input (submits to `/doctors?search=...`); specialties grid (click → `/doctors?specialty=...`); featured doctors (top-rated, 4 cards); "Qabulga yozilish" CTA; footer with phone, email, address, working hours.

### Doctors
- Cards: photo, full name, specialty, experience (years), price formatted "150 000 so'm".
- Search by name (debounced 300ms, case-insensitive), specialty filter (select), sort by experience asc/desc, price asc/desc, default.
- Filters synced with URL query params (refresh/share preserves state). "Tozalash" reset button.
- Empty state "Hech narsa topilmadi" + reset action.
- Card click → profile; each card has a "Qabulga yozilish" button.

### Doctor profile
Full name, photo, specialty, experience, bio/education, price, working days + time slots for a chosen date (already booked slots shown disabled; past slots disabled if today), "Qabulga yozilish" → `/appointment?doctorId=:id`.

### Appointment
Fields: first name, last name, phone, doctor (select), date, time slot (buttons), comment (optional).
Zod validation with Uzbek messages:
- required fields not empty
- phone `+998 XX XXX XX XX`: input mask/auto-format, accept spaces/dashes, normalize to `+998XXXXXXXXX`
- date not in the past; if today, past time slots disabled
- date must be one of the doctor's working days
- slot must not be booked for doctor+date (disabled in UI AND re-validated in service on submit)
- time resets when doctor/date changes; slots update reactively
On success: save with status `pending`, show confirmation modal (summary + link to /my-appointments), reset form. Loading state on submit button. Handle SLOT_TAKEN gracefully (message + refresh slots).

### My appointments
- If a stored phone exists, auto-load; otherwise show a phone lookup form (same phone validation). Provide "Boshqa raqam bilan qidirish" to change phone.
- List: doctor name, date, time, status badge (Pending=yellow, Confirmed=green, Cancelled=red). Sorted upcoming first.
- "Bekor qilish" only for non-cancelled future appointments → confirmation modal → status becomes `cancelled` (record kept, slot freed).
- Data persists on refresh. Empty state with CTA to book. Loading and error states.

## DATA MODEL
type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';
interface Doctor { id: string; firstName: string; lastName: string; specialty: string; experienceYears: number; price: number; photoUrl: string; bio: string; rating: number; workingDays: number[]; /* 0-6 */ timeSlots: string[]; /* "09:00" */ }
interface Appointment { id: string; patientName: string; phone: string; doctorId: string; date: string; /* YYYY-MM-DD */ time: string; comment?: string; status: AppointmentStatus; createdAt: string; }

Seed 10–12 realistic doctors (Uzbek names; specialties: Kardiolog, Nevrolog, Pediatr, Terapevt, Stomatolog, Oftalmolog, Dermatolog, Ginekolog, Ortoped, LOR) and several sample appointments covering all three statuses (so badges are testable) for a demo phone number — show that demo phone as a hint on /my-appointments. Photos: inline SVG/initials avatar fallback (no broken images, no external dependency).

## UI / DESIGN
- Modern, clean, professional medical design. Palette: white, blue (primary blue-600/700), light gray backgrounds (gray-50/100). Status colors only for badges.
- Reusable UI kit: Button (primary/secondary/danger/ghost, sizes, disabled, loading), Input/Select/Textarea (label, error, focus ring), Card, Modal (focus trap, ESC, backdrop click), Badge, Spinner/Skeleton, EmptyState, ErrorMessage, ConfirmDialog, Toast. Reuse the template's components if they exist. Consistent styles everywhere.
- Fully responsive (375 / 768 / 1280px), no horizontal scroll.
- Loading skeletons, inline errors, empty states, toasts for success/error.
- Accessibility: semantic HTML, labels bound to inputs, aria on modals/errors, keyboard navigation, visible focus.
- Use `next/link`, `next/navigation`, `next/dynamic` (for heavy modals), `loading.tsx` / `error.tsx` where it fits.

## EDGE CASES (must handle)
Invalid doctor id; corrupted localStorage; doctor with no slots; timezone-safe dates (compare YYYY-MM-DD / local dates, never UTC-parse date strings); double booking across two tabs; refresh keeps data; SSR/hydration safety; API/network failure (error state with retry).

## QUALITY BAR
- No dead buttons or placeholder links. No leftover admin/login code or links.
- `npm run build` and `npm run lint` pass with no errors.
- No component imports from `services/mock` or `services/api` directly.
- Switching `NEXT_PUBLIC_DATA_SOURCE` to `api` requires ZERO changes in components/hooks.

## DELIVERABLES
1. Complete working codebase integrated into the existing template.
2. `.env.example` (NEXT_PUBLIC_DATA_SOURCE, NEXT_PUBLIC_API_URL).
3. README.md: setup, scripts, folder structure, demo phone, features checklist, "How to connect a real API" (step-by-step + endpoint/DTO table + where to edit mappers), known limitations (phone-based lookup is not secure; admin is a separate project), Vercel deploy steps.

## WORKFLOW (confirm each step builds before moving on)
1. Inspect template, print findings + plan.
2. Types, config, contracts, errors, mock adapter + seed, api adapter, services/index.
3. UI kit + layout (Navbar, Footer).
4. Home, Doctors, Doctor profile.
5. Appointment form: validation + slot logic.
6. My appointments.
7. Polish: responsive pass, loading/error/empty states, a11y, README.
Finally, go through every requirement, verify each works, and report anything incomplete or any assumption you made.