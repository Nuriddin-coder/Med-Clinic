"use client";

import { useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import { Link, useRouter } from "@/components";
import { DoctorCard } from "@/components/clinic/doctor-card";
import { SpecialtyIcon } from "@/components/clinic/specialty-icon";
import { Button, PrimaryButton, SecondaryButton } from "@/components/ui/button";
import { HomeSkeleton } from "@/components/ui/skeleton";
import {
  useClinicInfo,
  useDoctors,
  useServices,
  useSpecialties,
} from "@/hooks/clinic/use-clinic-query";
import { formatSom } from "@/lib/format";

const processSteps = [
  {
    icon: Search,
    step: "01",
    title: "Shifokor yoki xizmatni tanlang",
    text: "Mutaxassislik, toifa va narx bo‘yicha kerakli shifokorni osongina qidiring.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Bo‘sh vaqt slotini belgilang",
    text: "Real vaqtda shifokorning aynan bo‘sh vaqtini tanlang va navbatsiz qabulga yoziling.",
  },
  {
    icon: HeartPulse,
    step: "03",
    title: "Telefon orqali tasdiqlang",
    text: "Ortiqcha ro‘yxatdan o‘tish shart emas. Qabulingizni telefon raqamingiz orqali boshqaring.",
  },
];

export const HomePage = () => {
  const router = useRouter();
  const info = useClinicInfo();
  const doctors = useDoctors({ sort: "rating-desc" });
  const specialties = useSpecialties();
  const services = useServices({ sort: "price-asc" });
  const [searchQuery, setSearchQuery] = useState("");

  if (info.isLoading || doctors.isLoading || specialties.isLoading) {
    return <HomeSkeleton />;
  }

  const clinic = info.data;
  const topDoctors = (doctors.data ?? []).slice(0, 3);
  const featuredServices = (services.data ?? []).slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/doctors?q=${encodeURIComponent(q)}` : "/doctors");
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-72px-300px)]">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50/70 via-white to-emerald-50/50 py-16 lg:py-24">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-Primary_app/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="container relative z-10 grid items-center gap-12 lg:grid-cols-12 px-4 sm:px-6 lg:px-8">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-Primary_app/20 bg-white/80 px-4 py-1.5 text-xs font-semibold text-Primary_app shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              <span>Zamonaviy tibbiy xizmatlar markazi</span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Salomatligingiz —{" "}
              <span className="bg-gradient-to-r from-Primary_app to-teal-600 bg-clip-text text-transparent">
                bizning oliy maqsadimiz
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-slate-600 sm:text-xl">
              {clinic?.tagline || "Onlayn yozilish. Tirik navbatsiz yuqori darajadagi tibbiy qabul."}
            </p>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
              {clinic?.about}
            </p>

            <form onSubmit={handleSearchSubmit} className="mt-8 flex max-w-xl gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Shifokor ismi yoki mutaxassislikni qidiring..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-Primary_app focus:ring-4 focus:ring-Primary_app/15"
                />
              </div>
              <PrimaryButton type="submit" size="lg" className="rounded-2xl px-6 shrink-0 whitespace-nowrap">
                Qidirish
              </PrimaryButton>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <PrimaryButton asChild size="lg" className="rounded-2xl shrink-0 whitespace-nowrap">
                <Link href="/book">Qabulga yozilish</Link>
              </PrimaryButton>
              <SecondaryButton asChild size="lg" className="rounded-2xl shrink-0 whitespace-nowrap">
                <Link href="/doctors">Shifokorlar bilan tanishish</Link>
              </SecondaryButton>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                Tirik navbatsiz
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                Onlayn qabul tasdig‘i
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                Xalqaro standartlar
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-xl shadow-slate-200/50 backdrop-blur transition hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-Primary_app">
                  <Clock className="h-6 w-6" />
                </div>
                <p className="mt-4 text-3xl font-extrabold text-slate-900">
                  {clinic?.years ?? 12}+
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">Yillik tajriba</p>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-xl shadow-slate-200/50 backdrop-blur transition hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <p className="mt-4 text-3xl font-extrabold text-slate-900">
                  {clinic?.doctorCount ?? 10}+
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">Tajribali shifokorlar</p>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-xl shadow-slate-200/50 backdrop-blur transition hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Users className="h-6 w-6" />
                </div>
                <p className="mt-4 text-3xl font-extrabold text-slate-900">
                  {clinic?.patientCount ? `${clinic.patientCount.toLocaleString()}+` : "19 500+"}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">Mamnun bemorlar</p>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-xl shadow-slate-200/50 backdrop-blur transition hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <p className="mt-4 text-xl font-extrabold text-slate-900">
                  08:00–20:00
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">Har kuni siz uchun</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-Primary_app">
            Qulay va sodda
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Qabulga yozilish qanday ishlaydi?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
            Klinikamizda navbatda turishga hojat yo‘q — bir necha tugma orqali o‘z vaqtingizni tejang.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {processSteps.map((item) => (
            <div
              key={item.step}
              className="relative rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-Primary_app">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-3xl font-extrabold text-slate-200">{item.step}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50/60 py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-Primary_app">
                Yo‘nalishlar
              </p>
              <h2 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
                Ommabop mutaxassisliklar
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Tashxislash va davolash bo‘yicha ixtisoslashgan shifokorlarimiz
              </p>
            </div>
            <SecondaryButton asChild className="rounded-xl shrink-0 whitespace-nowrap">
              <Link href="/services">Barcha xizmatlar</Link>
            </SecondaryButton>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {(specialties.data ?? []).map((item) => (
              <Link
                key={item.id}
                href={`/doctors?specialty=${item.id}`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-Primary_app hover:shadow-lg hover:shadow-Primary_app/10"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-Primary_app/10 text-Primary_app transition group-hover:bg-Primary_app group-hover:text-white">
                    <SpecialtyIcon id={item.id} name={item.name} iconName={item.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-bold text-slate-900 group-hover:text-Primary_app">
                    {item.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {item.description}
                  </p>
                </div>
                <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-Primary_app">
                  Shifokorlarni ko‘rish →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-Primary_app">
              Professionallar
            </p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
              Eng yuqori reytingli shifokorlar
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Ko‘p yillik amaliy tajribaga ega bo‘lgan mutaxassislarimiz
            </p>
          </div>
          <SecondaryButton asChild className="rounded-xl shrink-0 whitespace-nowrap">
            <Link href="/doctors">Barcha shifokorlar ({doctors.data?.length ?? 0})</Link>
          </SecondaryButton>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {topDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              specialties={specialties.data ?? []}
            />
          ))}
        </div>
      </section>

      <section className="bg-slate-50/60 py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-Primary_app">
                Shaffof narxlar
              </p>
              <h2 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
                Ommabop klinika xizmatlari
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Aniq narxlar, belgilangan qabul vaqti va xizmat davomiyligi
              </p>
            </div>
            <SecondaryButton asChild className="rounded-xl shrink-0 whitespace-nowrap">
              <Link href="/services">To‘liq narxnoma</Link>
            </SecondaryButton>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <h3 className="font-bold text-slate-900">{service.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    {service.description}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {service.durationMinutes} daqiqa
                  </span>
                  <span className="text-base font-bold text-Primary_app whitespace-nowrap">
                    {formatSom(service.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100">
          <div className="grid lg:grid-cols-12">
            <div className="p-8 sm:p-10 lg:col-span-5 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-Primary_app">
                  Bog‘lanish
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                  Biz bilan bog‘laning
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Klinikamizga tashrif buyuring yoki telefon orqali ma’lumot oling.
                </p>

                <div className="mt-8 space-y-5">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-Primary_app">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Manzil</p>
                      <p className="text-sm font-medium text-slate-800">
                        {clinic?.address || "Toshkent shahar, Yunusobod tumani, Amir Temur ko‘chasi 108"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Telefonlar</p>
                      {(clinic?.phones ?? ["+998712000808", "+998901234567"]).map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone}`}
                          className="block text-sm font-medium text-slate-800 hover:text-Primary_app whitespace-nowrap"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Ish vaqti</p>
                      <p className="text-sm font-medium text-slate-800">
                        {clinic?.workingHoursLabel || "Dushanba–Shanba 08:00–20:00"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Email</p>
                      <a
                        href={`mailto:${clinic?.email || "info@medclinic.uz"}`}
                        className="text-sm font-medium text-slate-800 hover:text-Primary_app"
                      >
                        {clinic?.email || "info@medclinic.uz"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3">
                <PrimaryButton asChild className="rounded-xl flex-1 shrink-0 whitespace-nowrap">
                  <Link href="/book">Qabulga yozilish</Link>
                </PrimaryButton>
                <SecondaryButton asChild className="rounded-xl flex-1 shrink-0 whitespace-nowrap">
                  <Link href="/contact">Xabar qoldirish</Link>
                </SecondaryButton>
              </div>
            </div>

            <div className="relative min-h-[360px] bg-slate-100 lg:col-span-7">
              <iframe
                title="Clinic Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.845456247957!2d69.281895!3d41.333333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDIwJzAwLjAiTiA2OcKwMTYnNTQuOCJF!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                className="h-full w-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gradient-to-r from-Primary_app to-teal-700 p-8 text-white shadow-xl shadow-Primary_app/20 md:flex-row md:items-center md:p-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              100% maxfiylik va qulaylik kafolati
            </div>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              Salomatligingizni kechiktirmang
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/85">
              Bir necha daqiqa ichida o‘zingizga qulay vaqtga navbat oling va mutaxassis ko‘rigidan o‘ting.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="rounded-2xl bg-white text-Primary_app shadow-lg hover:bg-slate-100 shrink-0 whitespace-nowrap"
          >
            <Link href="/book">Hoziroq yozilish →</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};
