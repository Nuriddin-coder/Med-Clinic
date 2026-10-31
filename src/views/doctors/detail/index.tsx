"use client";

import { useMemo, useState } from "react";
import { Calendar, Star } from "lucide-react";
import { Link } from "@/components";
import { InitialsAvatar } from "@/components/clinic/avatar";
import { PageHero } from "@/components/clinic/page-hero";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/field";
import { DoctorDetailSkeleton, SlotSkeleton } from "@/components/ui/skeleton";
import { useDoctor, useServices, useSlots, useSpecialties } from "@/hooks/clinic/use-clinic-query";
import { todayIsoDate, weekdayFromDate } from "@/lib/clinic-api/time";
import { formatClinicDate } from "@/lib/date";
import { formatSom, WEEKDAY_LABELS, WEEKDAY_ORDER } from "@/lib/format";

export const DoctorDetailPage = ({ doctorId }: { doctorId: string }) => {
  const doctorQuery = useDoctor(doctorId);
  const specialties = useSpecialties();
  const services = useServices();
  const [selectedDate, setSelectedDate] = useState(todayIsoDate());

  const doctor = doctorQuery.data;

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
    return <DoctorDetailSkeleton />;
  }

  if (doctorQuery.isError || !doctor) {
    return (
      <div className="container min-h-[calc(100vh-72px-300px)] py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Shifokor topilmadi</h1>
        <p className="mt-2 text-sm text-slate-500">
          Ushbu ID ga ega shifokor profili mavjud emas yoki o‘chirilgan.
        </p>
        <Button asChild className="mt-6 rounded-2xl">
          <Link href="/doctors">Ro‘yxatga qaytish</Link>
        </Button>
      </div>
    );
  }

  const names = (specialties.data ?? [])
    .filter((item) => doctor.specialtyIds.includes(item.id))
    .map((item) => item.name);

  return (
    <div className="min-h-[calc(100vh-72px-300px)]">
      <PageHero eyebrow="Shifokor" title={doctor.fullName} description={doctor.title} />

      <div className="container grid gap-8 py-10 lg:grid-cols-[1.4fr_0.8fr] px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row items-start">
            <InitialsAvatar initials={doctor.photoInitials} hue={doctor.photoHue} size="lg" />
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-Primary_app">
                {names.join(" • ")}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900">{doctor.fullName}</h2>
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="h-4 w-4 fill-amber-400" />
                  {doctor.rating.toFixed(1)} ({doctor.reviewCount} ta fikr)
                </span>
                <span>{doctor.experienceYears} yil staj</span>
                <span className="font-bold text-slate-900">
                  Konsultatsiya: {formatSom(doctor.consultationPrice)}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{doctor.bio}</p>
            </div>
          </div>

          <h3 className="mt-8 text-base font-bold text-slate-900 border-t border-slate-100 pt-6">
            Ta’lim va malaka oshirish
          </h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-600">
            {doctor.education.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="mt-6 text-base font-bold text-slate-900 border-t border-slate-100 pt-6">
            Muloqot tillari
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {doctor.languages.map((lang) => (
              <span
                key={lang}
                className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {lang}
              </span>
            ))}
          </div>

          <h3 className="mt-8 text-base font-bold text-slate-900 border-t border-slate-100 pt-6">
            Bemorlar fikri va sharhlar
          </h3>
          <div className="mt-4 space-y-3">
            {doctor.reviews.length === 0 ? (
              <p className="text-xs text-slate-400">Hozircha sharhlar mavjud emas.</p>
            ) : (
              doctor.reviews.map((review) => (
                <blockquote
                  key={review.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                >
                  <p className="text-sm text-slate-800 leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
                  <footer className="mt-2 text-xs font-semibold text-slate-500 flex items-center gap-2">
                    <span>{review.authorName}</span>
                    <span>•</span>
                    <span className="text-amber-500">★ {review.rating}/5</span>
                    <span>•</span>
                    <span>{review.date}</span>
                  </footer>
                </blockquote>
              ))
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Haftalik ish grafigi</h3>
            <ul className="mt-4 space-y-2 text-xs">
              {WEEKDAY_ORDER.map((day) => {
                const hours = doctor.schedule[day];
                return (
                  <li key={day} className="flex items-center justify-between gap-3 py-1 border-b border-slate-50 last:border-0">
                    <span className="font-medium text-slate-500">{WEEKDAY_LABELS[day]}</span>
                    <span className="font-bold text-slate-800">
                      {hours ? `${hours.start}–${hours.end}` : "Dam olish kuni"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-Primary_app" />
              <h3 className="text-base font-bold text-slate-900">Bo‘sh vaqtlar</h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Sanani tanlab, shifokorning bo‘sh slotlarini ko‘ring
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
                <p className="rounded-2xl bg-amber-50 p-3.5 text-xs text-amber-800 font-medium">
                  Bu kunda shifokor dam oladi. Boshqa ish kunini tanlang.
                </p>
              ) : slots.isLoading ? (
                <SlotSkeleton />
              ) : slots.data && slots.data.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-600">Mavjud slotlar:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {slots.data.map((slot) =>
                      slot.available ? (
                        <Link
                          key={slot.time}
                          href={`/book?doctorId=${doctor.id}&date=${selectedDate}&time=${slot.time}`}
                          className="rounded-xl border border-slate-200 bg-white py-2 text-center text-xs font-bold text-slate-800 transition hover:border-Primary_app hover:bg-Primary_app/10 hover:text-Primary_app whitespace-nowrap"
                        >
                          {slot.time}
                        </Link>
                      ) : (
                        <span
                          key={slot.time}
                          className="cursor-not-allowed rounded-xl border border-slate-100 bg-slate-100 py-2 text-center text-xs text-slate-400 line-through opacity-50 whitespace-nowrap"
                        >
                          {slot.time}
                        </span>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <p className="rounded-2xl bg-amber-50 p-3.5 text-xs text-amber-800 font-medium">
                  Bu kunda bo‘sh vaqt qolmagan.
                </p>
              )}
            </div>

            <Button asChild className="mt-6 w-full rounded-2xl shadow-md shadow-Primary_app/20 shrink-0 whitespace-nowrap">
              <Link href={`/book?doctorId=${doctor.id}&date=${selectedDate}`}>
                Qabulga yozilish →
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};
