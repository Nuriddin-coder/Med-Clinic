"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { Link, useRouter } from "@/components";
import { PageHero } from "@/components/clinic/page-hero";
import { StatusBadge } from "@/components/clinic/status-badge";
import { Button } from "@/components/ui/button";
import { FieldShell, TextArea, TextInput } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageLoader } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import {
  useCreateAppointment,
  useDoctors,
  useServices,
  useSlots,
} from "@/hooks/clinic/use-clinic-query";
import { ClinicApiError } from "@/lib/clinic-api/errors";
import { formatDateUz, todayIsoDate, weekdayFromDate } from "@/lib/clinic-api/time";
import { formatSom } from "@/lib/format";
import { appointmentSchema, AppointmentFormValues } from "@/lib/validations/schemas";
import { Appointment } from "@/types/clinic";

export const BookPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { notify } = useToast();
  const presetDoctorId = searchParams.get("doctorId") ?? "";
  const presetServiceId = searchParams.get("serviceId") ?? "";

  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  const doctors = useDoctors({ sort: "name-asc" });
  const services = useServices({ sort: "name-asc" });
  const createAppointment = useCreateAppointment();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctorId: presetDoctorId,
      serviceId: presetServiceId,
      date: "",
      time: "",
      patientName: "",
      patientPhone: "+998",
      notes: "",
    },
  });

  const doctorId = form.watch("doctorId");
  const serviceId = form.watch("serviceId");
  const date = form.watch("date");

  const selectedDoctor = useMemo(
    () => (doctors.data ?? []).find((item) => item.id === doctorId),
    [doctors.data, doctorId]
  );

  const isWorkingDay = useMemo(() => {
    if (!selectedDoctor || !date) return true;
    const weekday = weekdayFromDate(date);
    return Boolean(selectedDoctor.schedule[weekday]);
  }, [selectedDoctor, date]);

  const matchingServices = useMemo(() => {
    const all = services.data ?? [];
    if (!selectedDoctor) {
      return all;
    }
    return all.filter((item) => selectedDoctor.specialtyIds.includes(item.specialtyId));
  }, [services.data, selectedDoctor]);

  const slots = useSlots(
    { doctorId, date, serviceId },
    Boolean(doctorId && date && serviceId)
  );

  useEffect(() => {
    if (presetDoctorId) {
      form.setValue("doctorId", presetDoctorId, { shouldValidate: true });
    }
  }, [presetDoctorId, form]);

  useEffect(() => {
    if (presetServiceId) {
      form.setValue("serviceId", presetServiceId, { shouldValidate: true });
    }
  }, [presetServiceId, form]);

  useEffect(() => {
    if (serviceId && matchingServices.length > 0) {
      const exists = matchingServices.some((item) => item.id === serviceId);
      if (!exists) {
        form.setValue("serviceId", "");
        form.setValue("time", "");
      }
    }
  }, [matchingServices, serviceId, form]);

  useEffect(() => {
    form.setValue("time", "");
  }, [date, doctorId, serviceId, form]);

  const minDate = todayIsoDate();

  if (doctors.isLoading || services.isLoading) {
    return <PageLoader label="Yozilish formasi yuklanmoqda..." />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const parsed = appointmentSchema.parse(values);
      const appointment = await createAppointment.mutateAsync({
        doctorId: parsed.doctorId,
        serviceId: parsed.serviceId,
        date: parsed.date,
        time: parsed.time,
        patientName: parsed.patientName,
        patientPhone: parsed.patientPhone,
        notes: parsed.notes,
      });

      // Save phone to localStorage for convenience
      try {
        window.localStorage.setItem("medclinic:lastPhone", appointment.patientPhone);
      } catch {
        // ignore
      }

      notify("success", "Qabul muvaffaqiyatli yaratildi!");
      setConfirmedAppointment(appointment);
      form.reset({
        doctorId: "",
        serviceId: "",
        date: "",
        time: "",
        patientName: "",
        patientPhone: appointment.patientPhone,
        notes: "",
      });
    } catch (error) {
      const message = error instanceof ClinicApiError ? error.message : "Yozilish amalga oshmadi";
      notify("error", message);
      void slots.refetch();
    }
  });

  const selectedService = matchingServices.find((item) => item.id === serviceId);

  return (
    <div>
      <PageHero
        eyebrow="Online navbat"
        title="Qabulga yozilish"
        description="Shifokor, xizmat va bo'sh vaqtni tanlang. Tasdiqlashni klinika administratori qiladi."
      />
      <div className="container grid gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-Input_border bg-white p-6 shadow-cardShadow">
          <FieldShell label="Shifokor" error={form.formState.errors.doctorId?.message}>
            <Select
              value={doctorId}
              onValueChange={(val) => {
                form.setValue("doctorId", val, { shouldValidate: true });
              }}
            >
              <SelectTrigger className="w-full" aria-label="Shifokor">
                <SelectValue placeholder="Shifokorni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {(doctors.data ?? []).map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.fullName} — {doctor.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldShell>

          <FieldShell label="Xizmat" error={form.formState.errors.serviceId?.message}>
            <Select
              value={serviceId}
              disabled={!doctorId}
              onValueChange={(val) => {
                form.setValue("serviceId", val, { shouldValidate: true });
              }}
            >
              <SelectTrigger className="w-full" aria-label="Xizmat">
                <SelectValue placeholder={doctorId ? "Xizmatni tanlang" : "Avval shifokorni tanlang"} />
              </SelectTrigger>
              <SelectContent>
                {matchingServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} ({formatSom(service.price)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldShell>

          <div className="grid gap-4 md:grid-cols-2">
            <FieldShell
              label="Sana"
              error={form.formState.errors.date?.message}
              hint={!isWorkingDay ? "Diqqat: Shifokor ushbu kunda qabul qilmaydi" : undefined}
            >
              <TextInput type="date" min={minDate} {...form.register("date")} />
            </FieldShell>
            <FieldShell
              label="Ism familiya"
              error={form.formState.errors.patientName?.message}
            >
              <TextInput placeholder="Ali Valiyev" {...form.register("patientName")} />
            </FieldShell>
          </div>

          <FieldShell
            label="Telefon"
            hint="Qabullaringiz shu raqam orqali topiladi"
            error={form.formState.errors.patientPhone?.message}
          >
            <TextInput placeholder="+998 90 123 45 67" {...form.register("patientPhone")} />
          </FieldShell>

          <FieldShell label="Bo'sh vaqt" error={form.formState.errors.time?.message}>
            {!doctorId || !serviceId || !date ? (
              <p className="rounded-xl bg-Light_background px-3 py-3 text-sm text-Navbar_Color">
                Shifokor, xizmat va sanani tanlang — slotlar shu yerda chiqadi.
              </p>
            ) : !isWorkingDay ? (
              <p className="rounded-xl bg-amber-50 px-3 py-3 text-sm text-amber-800">
                Tanlangan kunda shifokor ishlamaydi. Iltimos, boshqa ish kunini tanlang.
              </p>
            ) : slots.isLoading ? (
              <p className="text-sm text-Navbar_Color">Slotlar yuklanmoqda...</p>
            ) : slots.data && slots.data.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.data.map((slot) => {
                  const selected = form.watch("time") === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => form.setValue("time", slot.time, { shouldValidate: true })}
                      className={`rounded-xl border px-2 py-2 text-sm font-medium transition ${
                        !slot.available
                          ? "cursor-not-allowed border-Input_border bg-ClrEEE text-Navbar_Color"
                          : selected
                            ? "border-Primary_app bg-Secondary text-Primary_app"
                            : "border-Input_border bg-white hover:border-Primary_app"
                      }`}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-xl bg-amber-50 px-3 py-3 text-sm text-amber-800">
                Bu kunda bo'sh vaqt yo'q. Boshqa sana tanlang.
              </p>
            )}
          </FieldShell>

          <FieldShell label="Izoh (ixtiyoriy)" error={form.formState.errors.notes?.message}>
            <TextArea placeholder="Asosiy shikoyat" {...form.register("notes")} />
          </FieldShell>

          <Button type="submit" className="w-full" disabled={createAppointment.isPending}>
            {createAppointment.isPending ? "Yuborilmoqda..." : "Qabulni yaratish"}
          </Button>
        </form>

        <aside className="h-fit rounded-2xl border border-Input_border bg-white p-6 shadow-cardShadow">
          <h2 className="text-lg font-semibold">Xulosa</h2>
          <ul className="mt-4 space-y-3 text-sm text-Navbar_Color">
            <li>
              <span className="block text-xs uppercase">Shifokor</span>
              <strong className="text-blackColor">{selectedDoctor?.fullName ?? "Tanlanmagan"}</strong>
            </li>
            <li>
              <span className="block text-xs uppercase">Xizmat</span>
              <strong className="text-blackColor">{selectedService?.name ?? "Tanlanmagan"}</strong>
            </li>
            <li>
              <span className="block text-xs uppercase">Davomiylik / narx</span>
              <strong className="text-blackColor">
                {selectedService
                  ? `${selectedService.durationMinutes} daqiqa • ${formatSom(selectedService.price)}`
                  : "—"}
              </strong>
            </li>
          </ul>
        </aside>
      </div>

      {/* Confirmation Modal */}
      {confirmedAppointment ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
              <h2 className="text-2xl font-bold text-blackColor">Qabul yaratildi!</h2>
            </div>
            <p className="mt-2 text-sm text-Navbar_Color">
              Sizning qabulingiz muvaffaqiyatli saqlandi va administrator tasdig&apos;ini kutmoqda.
            </p>

            <div className="mt-6 space-y-3 rounded-2xl bg-Light_background p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-Navbar_Color">Holat:</span>
                <StatusBadge status={confirmedAppointment.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-Navbar_Color">Sana:</span>
                <span className="font-semibold text-blackColor">
                  {formatDateUz(confirmedAppointment.date)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-Navbar_Color">Vaqt:</span>
                <span className="font-semibold text-blackColor">{confirmedAppointment.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-Navbar_Color">Bemor:</span>
                <span className="font-semibold text-blackColor">{confirmedAppointment.patientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-Navbar_Color">Telefon:</span>
                <span className="font-semibold text-blackColor">{confirmedAppointment.patientPhone}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                onClick={() => {
                  router.push(
                    `/appointments?phone=${encodeURIComponent(confirmedAppointment.patientPhone)}`
                  );
                }}
              >
                Mening qabullarimga o&apos;tish
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setConfirmedAppointment(null)}
              >
                Yana qabulga yozilish
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
