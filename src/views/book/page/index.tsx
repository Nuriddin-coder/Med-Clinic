"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  HeartPulse,
  Phone,
  Printer,
  Sparkles,
  Star,
  Stethoscope,
  User,
} from "lucide-react";
import { Link, useRouter } from "@/components";
import { InitialsAvatar } from "@/components/clinic/avatar";
import { PageHero } from "@/components/clinic/page-hero";
import { SpecialtyIcon } from "@/components/clinic/specialty-icon";
import { Button } from "@/components/ui/button";
import { FieldShell, TextArea, TextInput } from "@/components/ui/field";
import { BookPageSkeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  useCreateAppointment,
  useDoctors,
  useServices,
  useSlots,
  useSpecialties,
} from "@/hooks/clinic/use-clinic-query";
import { normalizePhone } from "@/lib/clinic-api/phone";
import { todayIsoDate, weekdayFromDate } from "@/lib/clinic-api/time";
import { formatClinicDate } from "@/lib/date";
import { formatSom } from "@/lib/format";
import { Appointment } from "@/types/clinic";

type WizardStep = 1 | 2 | 3 | 4;

export const BookPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const presetDoctorId = searchParams.get("doctorId") ?? "";
  const presetServiceId = searchParams.get("serviceId") ?? "";
  const presetDate = searchParams.get("date") ?? "";
  const presetTime = searchParams.get("time") ?? "";

  const specialties = useSpecialties();
  const doctors = useDoctors({ sort: "rating-desc" });
  const services = useServices({ sort: "price-asc" });
  const createAppointment = useCreateAppointment();

  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>(presetServiceId);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(presetDoctorId);
  const [selectedDate, setSelectedDate] = useState<string>(presetDate || todayIsoDate());
  const [selectedTime, setSelectedTime] = useState<string>(presetTime);

  const [patientName, setPatientName] = useState<string>("" );
  const [patientPhone, setPatientPhone] = useState<string>("+998");
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  const selectedDoctor = useMemo(
    () => (doctors.data ?? []).find((d) => d.id === selectedDoctorId),
    [doctors.data, selectedDoctorId]
  );

  const selectedService = useMemo(
    () => (services.data ?? []).find((s) => s.id === selectedServiceId),
    [services.data, selectedServiceId]
  );

  const selectedSpecialty = useMemo(
    () => (specialties.data ?? []).find((sp) => sp.id === selectedSpecialtyId),
    [specialties.data, selectedSpecialtyId]
  );

  useEffect(() => {
    if (presetDoctorId && doctors.data) {
      const doc = doctors.data.find((d) => d.id === presetDoctorId);
      if (doc && doc.specialtyIds.length > 0) {
        setSelectedSpecialtyId(doc.specialtyIds[0]);
        setSelectedDoctorId(presetDoctorId);
      }
    }
  }, [presetDoctorId, doctors.data]);

  const availableServices = useMemo(() => {
    const all = services.data ?? [];
    if (!selectedSpecialtyId) return all;
    return all.filter((s) => s.specialtyId === selectedSpecialtyId);
  }, [services.data, selectedSpecialtyId]);

  const availableDoctors = useMemo(() => {
    const all = doctors.data ?? [];
    if (!selectedSpecialtyId) {
      if (selectedService && selectedService.specialtyId) {
        return all.filter((d) => d.specialtyIds.includes(selectedService.specialtyId));
      }
      return all;
    }
    return all.filter((d) => d.specialtyIds.includes(selectedSpecialtyId));
  }, [doctors.data, selectedSpecialtyId, selectedService]);

  const isDoctorWorkingToday = useMemo(() => {
    if (!selectedDoctor || !selectedDate) return false;
    const weekday = weekdayFromDate(selectedDate);
    const schedule = selectedDoctor.schedule[weekday];
    return Boolean(schedule && schedule.start && schedule.end);
  }, [selectedDoctor, selectedDate]);

  const slots = useSlots(
    {
      doctorId: selectedDoctorId,
      date: selectedDate,
      serviceId: selectedServiceId,
    },
    Boolean(selectedDoctorId && selectedDate && isDoctorWorkingToday)
  );

  const availableSlots = useMemo(() => {
    if (!slots.data) return [];
    return slots.data.filter((slot) => slot.available);
  }, [slots.data]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("medclinic:lastPhone");
      if (saved && saved.startsWith("+998")) {
        setPatientPhone(saved);
      }
    } catch {
    }
  }, []);

  if (specialties.isLoading || doctors.isLoading || services.isLoading) {
    return <BookPageSkeleton />;
  }

  const handleNextFromStep1 = () => {
    if (!selectedServiceId) {
      toast.error("Iltimos, avval kerakli xizmatni tanlang!");
      return;
    }
    setCurrentStep(2);
  };

  const handleNextFromStep2 = () => {
    if (!selectedDoctorId) {
      toast.error("Iltimos, shifokorni tanlang!");
      return;
    }
    setCurrentStep(3);
  };

  const handleNextFromStep3 = () => {
    if (!selectedDate) {
      toast.error("Iltimos, qabul sanasini tanlang!");
      return;
    }
    if (!selectedTime) {
      toast.error("Iltimos, qabul vaqtini (slotni) tanlang!");
      return;
    }
    setCurrentStep(4);
  };

  const validateStep4 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!patientName.trim()) {
      newErrors.name = "Ism familiyangizni kiritishingiz shart";
    } else if (patientName.trim().length < 3) {
      newErrors.name = "Ism kamida 3 ta harfdan iborat bo‘lishi kerak";
    }

    const cleanPhone = normalizePhone(patientPhone);
    if (!cleanPhone) {
      newErrors.phone = "Telefon raqami kiritilishi shart";
    } else if (!/^\+998\d{9}$/.test(cleanPhone)) {
      newErrors.phone = "Telefon raqami noto‘g‘ri (+998XXXXXXXXX formatida bo‘lishi kerak)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep4()) {
      toast.error("Iltimos, barcha maydonlarni to‘g‘ri to‘ldiring!");
      return;
    }

    try {
      const normPhone = normalizePhone(patientPhone);
      const res = await createAppointment.mutateAsync({
        doctorId: selectedDoctorId,
        serviceId: selectedServiceId,
        date: selectedDate,
        time: selectedTime,
        patientName: patientName.trim(),
        patientPhone: normPhone,
        notes: notes.trim(),
      });

      try {
        localStorage.setItem("medclinic:lastPhone", normPhone);
      } catch {
      }

      toast.success("Qabul muvaffaqiyatli rasmiylashtirildi!");
      setConfirmedAppointment(res);
    } catch (err: any) {
      toast.error(err?.message || "Qabulni rasmiylashtirishda xatolik yuz berdi");
    }
  };

  if (confirmedAppointment) {
    return (
      <div className="min-h-[calc(100vh-72px-300px)]">
        <PageHero
          eyebrow="Tasdiqnoma"
          title="Qabul muvaffaqiyatli band qilindi!"
          description="Sizning qabulingiz klinika tizimida ro‘yxatga olindi. Ma’lumotlarni saqlab qo‘ying."
        />
        <div className="container py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-Primary_app to-teal-600 px-8 py-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur shrink-0">
                    <CheckCircle2 className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">MED Clinic Kvitansiyasi</h2>
                    <p className="text-xs text-white/90">Onlayn qabul chiptasi</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded-full bg-emerald-500/30 px-3 py-1 text-xs font-semibold backdrop-blur whitespace-nowrap">
                    Tasdiqlangan
                  </span>
                  <p className="mt-1 font-mono text-xs text-white/90 whitespace-nowrap">
                    ID: {confirmedAppointment.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="text-xs font-bold uppercase text-slate-600">Bemor</p>
                  <p className="mt-1 font-bold text-slate-800">
                    {confirmedAppointment.patientName}
                  </p>
                  <p className="font-mono text-xs text-slate-600">
                    {confirmedAppointment.patientPhone}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="text-xs font-bold uppercase text-slate-600">Shifokor</p>
                  <p className="mt-1 font-bold text-slate-800">
                    {selectedDoctor?.fullName || "Mutaxassis shifokor"}
                  </p>
                  <p className="text-xs text-slate-600">
                    {selectedDoctor?.title}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="text-xs font-bold uppercase text-slate-600">Qabul sanasi va vaqti</p>
                  <p className="mt-1 font-bold text-Primary_app">
                    {formatClinicDate(confirmedAppointment.date)} ({confirmedAppointment.time})
                  </p>
                  <p className="text-xs text-slate-600">
                    Davomiyligi: ~{confirmedAppointment.durationMinutes} daqiqa
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="text-xs font-bold uppercase text-slate-600">Xizmat va to‘lov</p>
                  <p className="mt-1 font-bold text-slate-800">
                    {selectedService?.name || "Konsultatsiya"}
                  </p>
                  <p className="text-sm font-extrabold text-emerald-600">
                    {formatSom(selectedService?.price || selectedDoctor?.consultationPrice || 0)}
                  </p>
                </div>
              </div>

              {confirmedAppointment.notes ? (
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs">
                  <span className="font-semibold text-slate-700">Izoh: </span>
                  <span className="text-slate-600">{confirmedAppointment.notes}</span>
                </div>
              ) : null}

              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900">
                <p className="font-semibold">Eslatma:</p>
                <p className="mt-1 leading-relaxed text-blue-900">
                  Iltimos, qabul vaqtidan 10 daqiqa oldin klinikaga yetib keling. Qabulingizni o‘zgartirish yoki bekor qilish zarurati tug‘ilsa,
                  &ldquo;Mening qabullarim&rdquo; bo‘limidan telefon raqamingiz orqali amalga oshirishingiz mumkin.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="rounded-xl flex items-center gap-1.5 shrink-0 whitespace-nowrap"
                >
                  <Printer className="h-4 w-4" />
                  Kvitansiyani chop etish
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl shrink-0 whitespace-nowrap"
                    onClick={() => {
                      setConfirmedAppointment(null);
                      setCurrentStep(1);
                    }}
                  >
                    Yangi qabul
                  </Button>
                  <Button asChild size="sm" className="rounded-xl shrink-0 whitespace-nowrap">
                    <Link href={`/appointments?phone=${encodeURIComponent(confirmedAppointment.patientPhone)}`}>
                      Mening qabullarim
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stepLabels = [
    { number: 1, title: "Xizmat" },
    { number: 2, title: "Shifokor" },
    { number: 3, title: "Sana va Vaqt" },
    { number: 4, title: "Bemor ma'lumotlari" },
  ];

  return (
    <div className="min-h-[calc(100vh-72px-300px)]">
      <PageHero
        eyebrow="Onlayn navbat"
        title="Shifokor qabuliga yozilish"
        description="4 oddiy qadamda kerakli mutaxassis va qulay vaqtni tanlang."
      />

      <div className="container py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl">
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {stepLabels.map((s) => {
              const isPast = currentStep > s.number;
              const isCurrent = currentStep === s.number;
              return (
                <button
                  key={s.number}
                  type="button"
                  aria-label={`Qadam ${s.number}: ${s.title}`}
                  aria-current={isCurrent ? "step" : undefined}
                  disabled={!isPast && !isCurrent}
                  onClick={() => {
                    if (isPast) setCurrentStep(s.number as WizardStep);
                  }}
                  className={`flex flex-col items-center text-center transition ${
                    isCurrent
                      ? "text-Primary_app"
                      : isPast
                      ? "cursor-pointer text-emerald-600 hover:text-emerald-700"
                      : "cursor-not-allowed text-slate-500"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold transition shadow-sm ${
                      isPast
                        ? "bg-emerald-500 text-white"
                        : isCurrent
                        ? "bg-Primary_app text-white ring-4 ring-Primary_app/20"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {isPast ? <Check className="h-5 w-5" /> : s.number}
                  </div>
                  <span className="mt-2 hidden text-xs font-semibold sm:block whitespace-nowrap">
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-Primary_app transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {currentStep === 1 && (
                <div>
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-Primary_app">
                      1-qadam
                    </span>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      Mutaxassislik va Xizmatni tanlang
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Klinikamiz yo‘nalishini tanlang va kerakli xizmat turini belgilang.
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Mutaxassislik bo‘yicha saralash:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        aria-pressed={selectedSpecialtyId === ""}
                        onClick={() => setSelectedSpecialtyId("")}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition shrink-0 whitespace-nowrap ${
                          selectedSpecialtyId === ""
                            ? "bg-Primary_app text-white shadow-sm"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        Barchasi
                      </button>
                      {(specialties.data ?? []).map((sp) => (
                        <button
                          key={sp.id}
                          type="button"
                          aria-pressed={selectedSpecialtyId === sp.id}
                          onClick={() => setSelectedSpecialtyId(sp.id)}
                          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition shrink-0 whitespace-nowrap ${
                            selectedSpecialtyId === sp.id
                              ? "bg-Primary_app text-white shadow-sm"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          <SpecialtyIcon id={sp.id} name={sp.name} iconName={sp.icon} className="h-3.5 w-3.5" />
                          <span>{sp.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {availableServices.length === 0 ? (
                      <p className="py-8 text-center text-sm text-slate-500">
                        Tanlangan mutaxassislik bo‘yicha xizmatlar topilmadi.
                      </p>
                    ) : (
                      availableServices.map((service) => {
                        const isSelected = selectedServiceId === service.id;
                        return (
                          <button
                            key={service.id}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => {
                              setSelectedServiceId(service.id);
                              if (service.specialtyId && !selectedSpecialtyId) {
                                setSelectedSpecialtyId(service.specialtyId);
                              }
                            }}
                            className={`w-full text-left rounded-2xl border p-4 transition ${
                              isSelected
                                ? "border-Primary_app bg-blue-50/60 ring-2 ring-Primary_app/20"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div
                                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                                    isSelected
                                      ? "bg-Primary_app text-white"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {isSelected ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <SpecialtyIcon id={service.specialtyId} className="h-4 w-4" />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-bold text-slate-900">
                                    {service.name}
                                  </h3>
                                  <p className="mt-1 text-xs text-slate-600">
                                    {service.description}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-extrabold text-Primary_app whitespace-nowrap">
                                  {formatSom(service.price)}
                                </p>
                                <span className="text-[11px] font-semibold text-slate-600 whitespace-nowrap">
                                  ~{service.durationMinutes} daqiqa
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button
                      size="lg"
                      disabled={!selectedServiceId}
                      onClick={handleNextFromStep1}
                      className="rounded-2xl px-6 shrink-0 whitespace-nowrap"
                    >
                      Keyingi qadam →
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-Primary_app">
                      2-qadam
                    </span>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      Shifokorni tanlang
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Ushbu xizmat bo‘yicha qabul olib boruvchi malakali mutaxassislarimiz.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 max-h-[460px] overflow-y-auto pr-1">
                    {availableDoctors.length === 0 ? (
                      <div className="col-span-2 py-8 text-center text-sm text-slate-500">
                        Tanlangan xizmat bo‘yicha shifokor topilmadi.
                      </div>
                    ) : (
                      availableDoctors.map((doc) => {
                        const isSelected = selectedDoctorId === doc.id;
                        return (
                          <button
                            key={doc.id}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => setSelectedDoctorId(doc.id)}
                            className={`w-full text-left rounded-2xl border p-4 transition ${
                              isSelected
                                ? "border-Primary_app bg-blue-50/60 ring-2 ring-Primary_app/20"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <InitialsAvatar
                                initials={doc.photoInitials}
                                hue={doc.photoHue}
                                size="md"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className="truncate font-bold text-slate-900">
                                    {doc.fullName}
                                  </h3>
                                  {isSelected && (
                                    <span className="rounded-full bg-Primary_app p-1 text-white shrink-0">
                                      <Check className="h-3 w-3" />
                                    </span>
                                  )}
                                </div>
                                <p className="mt-0.5 line-clamp-1 text-xs text-slate-600">
                                  {doc.title}
                                </p>
                                <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
                                  <span className="flex items-center gap-1 font-semibold text-amber-600">
                                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                                    {doc.rating}
                                  </span>
                                  <span>{doc.experienceYears} yil staj</span>
                                </div>
                                <p className="mt-2 text-xs font-bold text-Primary_app whitespace-nowrap">
                                  Konsultatsiya: {formatSom(doc.consultationPrice)}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="rounded-2xl shrink-0 whitespace-nowrap"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Ortga
                    </Button>
                    <Button
                      size="lg"
                      disabled={!selectedDoctorId}
                      onClick={handleNextFromStep2}
                      className="rounded-2xl px-6 shrink-0 whitespace-nowrap"
                    >
                      Keyingi qadam →
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-Primary_app">
                      3-qadam
                    </span>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      Sana va bo‘sh vaqt slotini tanlang
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Faqat haqiqatda mavjud va bo‘sh bo‘lgan vaqt slotlari ko‘rsatiladi.
                    </p>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="appointment-date-input" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Qabul sanasi:
                    </label>
                    <div className="max-w-xs">
                      <TextInput
                        id="appointment-date-input"
                        aria-label="Qabul sanasi"
                        type="date"
                        min={todayIsoDate()}
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setSelectedTime("");
                        }}
                      />
                    </div>
                    {selectedDate && (
                      <p className="mt-2 text-xs font-medium text-Primary_app">
                        Tanlangan: {formatClinicDate(selectedDate, "EEEE, d-MMMM yyyy")}
                      </p>
                    )}
                  </div>

                  {!isDoctorWorkingToday ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                      Shifokor {selectedDoctor?.fullName} bu kunda qabul o‘tkazmaydi (dam olish kuni). Iltimos, boshqa sanani tanlang.
                    </div>
                  ) : slots.isLoading ? (
                    <div className="py-8 text-center text-sm text-slate-600 animate-pulse">
                      Shifokorning bo‘sh vaqtlari tekshirilmoqda...
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                      Ushbu sanada barcha vaqtlar band qilingan. Iltimos, boshqa kunni tanlang.
                    </div>
                  ) : (
                    <div>
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
                        Bo‘sh vaqt slotlari ({availableSlots.length} ta mavjud):
                      </p>
                      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5">
                        {slots.data?.map((slot) => {
                          const isAvailable = slot.available;
                          const isSelected = selectedTime === slot.time;
                          return isAvailable ? (
                            <button
                              key={slot.time}
                              type="button"
                              aria-label={`Vaqt: ${slot.time}`}
                              aria-pressed={isSelected}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`rounded-xl border py-2.5 text-center text-xs font-bold transition whitespace-nowrap ${
                                isSelected
                                  ? "border-Primary_app bg-Primary_app text-white shadow-md shadow-Primary_app/30"
                                  : "border-slate-200 bg-white text-slate-800 hover:border-Primary_app hover:bg-blue-50/50"
                              }`}
                            >
                              {slot.time}
                            </button>
                          ) : (
                            <div
                              key={slot.time}
                              title="Band qilingan"
                              aria-label={`Band qilingan vaqt: ${slot.time}`}
                              aria-disabled="true"
                              className="cursor-not-allowed rounded-xl border border-slate-100 bg-slate-100 py-2.5 text-center text-xs text-slate-500 line-through opacity-60 whitespace-nowrap"
                            >
                              {slot.time}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="rounded-2xl shrink-0 whitespace-nowrap"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Ortga
                    </Button>
                    <Button
                      size="lg"
                      disabled={!selectedDate || !selectedTime || !isDoctorWorkingToday}
                      onClick={handleNextFromStep3}
                      className="rounded-2xl px-6 shrink-0 whitespace-nowrap"
                    >
                      Keyingi qadam →
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <form onSubmit={handleSubmitBooking}>
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-Primary_app">
                      4-qadam
                    </span>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      Bemor ma&apos;lumotlari va tasdiqlash
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Ismingiz va telefoningizni kiriting. Navbat haqidagi SMS va tasdiqnoma shu raqamga bog‘lanadi.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FieldShell label="Bemorning to‘liq ismi" error={errors.name} htmlFor="patient-name">
                      <TextInput
                        id="patient-name"
                        aria-label="Bemorning to‘liq ismi"
                        placeholder="Masalan: Dilshod Rahimov"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        autoFocus
                      />
                    </FieldShell>

                    <FieldShell
                      label="Telefon raqami (+998XXXXXXXXX)"
                      error={errors.phone}
                      htmlFor="patient-phone"
                    >
                      <TextInput
                        id="patient-phone"
                        aria-label="Telefon raqami"
                        placeholder="+998901234567"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                      />
                    </FieldShell>

                    <FieldShell label="Shikoyat yoki qo‘shimcha izoh (ixtiyoriy)" htmlFor="patient-notes">
                      <TextArea
                        id="patient-notes"
                        aria-label="Shikoyat yoki qo‘shimcha izoh"
                        placeholder="Kasallik alomatlari, avvalgi tashxislar yoki xohishlaringiz..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </FieldShell>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(3)}
                      className="rounded-2xl shrink-0 whitespace-nowrap"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Ortga
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={createAppointment.isPending}
                      className="rounded-2xl px-8 shadow-lg shadow-Primary_app/25 shrink-0 whitespace-nowrap"
                    >
                      {createAppointment.isPending
                        ? "Band qilinmoqda..."
                        : "Qabulni tasdiqlash →"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <FileText className="h-5 w-5 text-Primary_app" />
                Qabul xulosasi
              </h3>

              <div className="mt-5 space-y-4 border-t border-slate-100 pt-4 text-sm">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-600">
                    Xizmat turi:
                  </span>
                  <p className="font-bold text-slate-800">
                    {selectedService?.name || "Tanlanmagan"}
                  </p>
                  {selectedService && (
                    <span className="text-xs font-semibold text-slate-600">
                      Davomiyligi: ~{selectedService.durationMinutes} daqiqa
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-xs font-bold uppercase text-slate-600">
                    Shifokor:
                  </span>
                  <p className="font-bold text-slate-800">
                    {selectedDoctor?.fullName || "Tanlanmagan"}
                  </p>
                  {selectedDoctor && (
                    <span className="text-xs text-slate-600">
                      {selectedDoctor.title}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-xs font-bold uppercase text-slate-600">
                    Sana va Vaqt:
                  </span>
                  <p className="font-bold text-Primary_app">
                    {selectedDate && selectedTime
                      ? `${formatClinicDate(selectedDate)} soat ${selectedTime}`
                      : selectedDate
                      ? `${formatClinicDate(selectedDate)} (vaqt tanlanmagan)`
                      : "Tanlanmagan"}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-700">
                      Konsultatsiya to‘lovi:
                    </span>
                    <span className="text-base font-extrabold text-emerald-600 whitespace-nowrap">
                      {formatSom(selectedService?.price || selectedDoctor?.consultationPrice || 0)}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600">
                    * To‘lov qabul vaqtida klinikada amalga oshiriladi (naqd yoki karta).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
