"use client";

import { CalendarCheck, ClipboardList, Search, ShieldCheck } from "lucide-react";
import { Link, useRouter } from "@/components";
import { DoctorCard } from "@/components/clinic/doctor-card";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/skeleton";
import { useClinicInfo, useDoctors, useSpecialties } from "@/hooks/clinic/use-clinic-query";

const steps = [
  {
    icon: Search,
    title: "Shifokor yoki xizmatni tanlang",
    text: "Mutaxassislik, reyting va narx bo'yicha qidiring.",
  },
  {
    icon: CalendarCheck,
    title: "Bo'sh vaqtni belgilang",
    text: "Faqat haqiqiy bo'sh slotlar ko'rsatiladi.",
  },
  {
    icon: ClipboardList,
    title: "Telefon orqali tasdiqlang",
    text: "Akkaunt shart emas. Qabullaringizni shu raqam bilan topasiz.",
  },
];

export const HomePage = () => {
  const router = useRouter();
  const info = useClinicInfo();
  const doctors = useDoctors({ sort: "rating-desc" });
  const specialties = useSpecialties();

  if (info.isLoading || doctors.isLoading || specialties.isLoading) {
    return <PageLoader label="Klinika ma'lumotlari yuklanmoqda..." />;
  }

  const clinic = info.data;
  const featured = (doctors.data ?? []).slice(0, 3);

  return (
    <div>
      <section className="bg-gradient-to-br from-Secondary via-white to-Light_background">
        <div className="container grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-Primary_app">
              Onlayn tibbiy xizmatlar
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-blackColor md:text-5xl">
              {clinic?.name}: navbatsiz qabulga yoziling
            </h1>
            <p className="mt-4 max-w-xl text-lg text-Navbar_Color">{clinic?.tagline}</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-Bodytext_color">{clinic?.about}</p>

            {/* Hero search form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem("q") as HTMLInputElement;
                const q = input.value.trim();
                router.push(q ? `/doctors?q=${encodeURIComponent(q)}` : "/doctors");
              }}
              className="mt-7 flex max-w-lg gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-Navbar_Color" />
                <input
                  name="q"
                  type="search"
                  placeholder="Shifokor yoki yo'nalish qidiring..."
                  className="h-12 w-full rounded-xl border border-Input_border bg-white pl-9 pr-3 text-sm text-blackColor outline-none transition focus:border-Primary_app focus:ring-2 focus:ring-Primary_app/20"
                />
              </div>
              <Button type="submit" size="lg">
                Qidirish
              </Button>
            </form>

            <div className="mt-3 flex flex-wrap gap-3">
              <Button asChild variant="outline" size="lg">
                <Link href="/doctors">Barcha shifokorlar</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/book">Qabulga yozilish</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["12+", "yillik tajriba"],
              [String(clinic?.doctorCount ?? 10), "shifokor"],
              ["18 400+", "bemor"],
              ["08:00–20:00", "ish vaqti"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-Input_border bg-white p-6 shadow-cardShadow">
                <p className="text-2xl font-bold text-prm">{value}</p>
                <p className="mt-1 text-sm text-Navbar_Color">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14">
        <h2 className="text-2xl font-bold text-blackColor">Qanday ishlaydi</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-Input_border bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-Secondary text-Primary_app">
                <step.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold text-Primary_app">0{index + 1}</p>
              <h3 className="mt-1 font-semibold text-blackColor">{step.title}</h3>
              <p className="mt-2 text-sm text-Navbar_Color">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-blackColor">Yo'nalishlar</h2>
              <p className="mt-1 text-sm text-Navbar_Color">Kerakli mutaxassislikni tanlang</p>
            </div>
            <Link href="/services" className="text-sm font-semibold text-Primary_app">
              Barcha xizmatlar
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {(specialties.data ?? []).map((item) => (
              <Link
                key={item.id}
                href={`/doctors?specialty=${item.id}`}
                className="rounded-2xl border border-Input_border bg-Light_background p-4 transition hover:border-Primary_app hover:bg-Secondary"
              >
                <p className="font-semibold text-blackColor">{item.name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-Navbar_Color">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-blackColor">Eng yuqori baholangan shifokorlar</h2>
          <Link href="/doctors" className="text-sm font-semibold text-Primary_app">
            Barchasi
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} specialties={specialties.data ?? []} />
          ))}
        </div>
      </section>

      <section className="container pb-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-prm px-8 py-10 text-white md:flex-row md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
              <ShieldCheck className="h-4 w-4" />
              Ma&apos;lumotlaringiz faqat qabul uchun
            </div>
            <h2 className="text-2xl font-bold">Bugun qabulga yoziling</h2>
            <p className="mt-2 max-w-xl text-sm text-white/75">
              Qabullarni telefon raqamingiz orqali ko&apos;rasiz va kerak bo&apos;lsa bekor qilasiz.
            </p>
          </div>
          <Button asChild size="lg" className="bg-white text-prm hover:bg-Secondary">
            <Link href="/book">Boshlash</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};
