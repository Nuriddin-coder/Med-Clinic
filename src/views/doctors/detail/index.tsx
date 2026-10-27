"use client";

import { useMemo, useState } from "react";
import { Calendar, Star } from "lucide-react";
import { Link } from "@/components";
import { InitialsAvatar } from "@/components/clinic/avatar";
import { PageHero } from "@/components/clinic/page-hero";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/field";
import { PageLoader } from "@/components/ui/skeleton";
import { useDoctor, useServices, useSlots, useSpecialties } from "@/hooks/clinic/use-clinic-query";
import { todayIsoDate, weekdayFromDate } from "@/lib/clinic-api/time";
import { formatSom, WEEKDAY_LABELS, WEEKDAY_ORDER } from "@/lib/format";

export const DoctorDetailPage = ({ doctorId }: { doctorId: string }) => {
  const doctorQuery = useDoctor(doctorId);
  const specialties = useSpecialties();
  const services = useServices();
  const [selectedDate, setSelectedDate] = useState(todayIsoDate());

  const doctor = doctorQuery.data;

  // Find a matching service for slot calculation
  const primaryService = useMemo(() => {
    if (!doctor || !services.data) return undefined;
    return (
      services.data.find((srv) => doctor.specialtyIds.includes(srv.specialtyId)) ??
      services.data[0]
    );
  }, [doctor, services.data]);

  const slots = useSlots(
    {
      doctorId,
      date: selectedDate,
      serviceId: primaryService?.id ?? "srv-consult-therapy",
    },
    Boolean(doctor && selectedDate && primaryService)
  );

  const isWorking = useMemo(() => {
    if (!doctor || !selectedDate) return false;
    const weekday = weekdayFromDate(selectedDate);
    return Boolean(doctor.schedule[weekday]);
  }, [doctor, selectedDate]);

  if (doctorQuery.isLoading || specialties.isLoading || services.isLoading) {
    return <PageLoader label="Shifokor profili yuklanmoqda..." />;
  }

  if (doctorQuery.isError || !doctor) {
    return (
      <div className="container py-16">
        <h1 className="text-2xl font-bold">Shifokor topilmadi</h1>
        <Button asChild className="mt-4">
          <Link href="/doctors">Ro‘yxatga qaytish</Link>
        </Button>
      </div>
    );
  }

  const names = (specialties.data ?? [])
    .filter((item) => doctor.specialtyIds.includes(item.id))
    .map((item) => item.name);

  return (
    <div>
      <PageHero eyebrow="Shifokor" title={doctor.fullName} description={doctor.title} />
      <div className="container grid gap-8 py-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl border border-Input_border bg-white p-6 shadow-cardShadow">
          <div className="flex flex-col gap-5 sm:flex-row">
            <InitialsAvatar initials={doctor.photoInitials} hue={doctor.photoHue} size="lg" />
            <div>
              <p className="text-sm text-Primary_app">{names.join(" • ")}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-1 font-medium">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {doctor.rating.toFixed(1)} ({doctor.reviewCount} ta fikr)
                </span>
                <span>{doctor.experienceYears} yil tajriba</span>
                <span className="font-semibold">{formatSom(doctor.consultationPrice)}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-Bodytext_color">{doctor.bio}</p>
            </div>
          </div>

          <h2 className="mt-8 text-lg font-semibold">Ta’lim</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-Navbar_Color">
            {doctor.education.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className="mt-6 text-lg font-semibold">Tillar</h2>
          <p className="mt-1 text-sm text-Navbar_Color">{doctor.languages.join(", ")}</p>

          <h2 className="mt-8 text-lg font-semibold">Bemorlar fikri</h2>
          <div className="mt-3 space-y-3">
            {doctor.reviews.map((review) => (
              <blockquote key={review.id} className="rounded-xl bg-Light_background p-4">
                <p className="text-sm text-blackColor">{review.comment}</p>
                <footer className="mt-2 text-xs text-Navbar_Color">
                  {review.authorName} • {review.rating}/5 • {review.date}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-Input_border bg-white p-6 shadow-cardShadow">
            <h2 className="text-lg font-semibold">Ish grafigi</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {WEEKDAY_ORDER.map((day) => {
                const hours = doctor.schedule[day];
                return (
                  <li key={day} className="flex items-center justify-between gap-3">
                    <span className="text-Navbar_Color">{WEEKDAY_LABELS[day]}</span>
                    <span className="font-medium text-blackColor">
                      {hours ? `${hours.start}–${hours.end}` : "Dam olish"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl border border-Input_border bg-white p-6 shadow-cardShadow">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-Primary_app" />
              <h2 className="text-lg font-semibold text-blackColor">Bo&apos;sh vaqtlar</h2>
            </div>
            <p className="mt-1 text-xs text-Navbar_Color">
              Sanani tanlab, shifokorning bo&apos;sh slotlarini ko&apos;ring
            </p>

            <div className="mt-4">
              <TextInput
                type="date"
                min={todayIsoDate()}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                aria-label="Sana tanlang"
              />
            </div>

            <div className="mt-4">
              {!isWorking ? (
                <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                  Bu kunda shifokor dam oladi. Boshqa ish kunini tanlang.
                </p>
              ) : slots.isLoading ? (
                <p className="text-xs text-Navbar_Color">Vaqtlar yuklanmoqda...</p>
              ) : slots.data && slots.data.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs font-medium text-Navbar_Color">Mavjud slotlar:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {slots.data.map((slot) =>
                      slot.available ? (
                        <Link
                          key={slot.time}
                          href={`/book?doctorId=${doctor.id}&date=${selectedDate}&time=${slot.time}`}
                          className="rounded-lg border border-Input_border bg-white py-1.5 text-center text-xs font-semibold text-blackColor transition hover:border-Primary_app hover:bg-Secondary hover:text-Primary_app"
                        >
                          {slot.time}
                        </Link>
                      ) : (
                        <span
                          key={slot.time}
                          className="cursor-not-allowed rounded-lg border border-Input_border bg-ClrEEE py-1.5 text-center text-xs text-Navbar_Color line-through opacity-60"
                        >
                          {slot.time}
                        </span>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                  Bu kunda bo&apos;sh vaqt qolmagan.
                </p>
              )}
            </div>

            <Button asChild className="mt-6 w-full">
              <Link href={`/book?doctorId=${doctor.id}`}>Qabulga yozilish</Link>
            </Button>
            <p className="mt-3 text-xs text-Navbar_Color">
              Holatlar admin tizimida boshqariladi. Siz faqat yozila olasiz yoki o&apos;z qabulingizni bekor qila olasiz.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
