"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppointmentCard } from "@/components/clinic/appointment-card";
import { ConfirmDialog } from "@/components/clinic/confirm-dialog";
import { EmptyState } from "@/components/clinic/empty-state";
import { PageHero } from "@/components/clinic/page-hero";
import { PrimaryButton, SecondaryButton } from "@/components/ui/button";
import { FieldShell, TextInput } from "@/components/ui/field";
import { AppointmentsSkeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  useAppointments,
  useCancelAppointment,
  useDoctors,
  useServices,
} from "@/hooks/clinic/use-clinic-query";
import { useMounted } from "@/hooks/use-mounted";
import { ClinicApiError } from "@/lib/clinic-api/errors";
import { normalizePhone } from "@/lib/clinic-api/phone";
import { lookupSchema, LookupFormValues } from "@/lib/validations/schemas";

const LAST_PHONE_KEY = "medclinic:lastPhone";

export const AppointmentsPage = () => {
  const searchParams = useSearchParams();
  const preset = searchParams.get("phone") ?? "";
  const mounted = useMounted();

  const [phone, setPhone] = useState(preset ? normalizePhone(preset) : "");
  const [enabled, setEnabled] = useState(Boolean(preset));
  const [cancelId, setCancelId] = useState<string | null>(null);

  const form = useForm<LookupFormValues>({
    resolver: zodResolver(lookupSchema),
    defaultValues: { phone: preset || "+998" },
  });

  // On mount: if no URL preset, read saved phone from localStorage
  useEffect(() => {
    if (mounted && !preset) {
      try {
        const saved = window.localStorage.getItem(LAST_PHONE_KEY);
        if (saved && saved.startsWith("+998")) {
          setPhone(saved);
          setEnabled(true);
          form.setValue("phone", saved);
        }
      } catch {
        // ignore localStorage errors
      }
    }
  }, [mounted, preset, form]);

  const appointments = useAppointments({ phone }, enabled);
  const doctors = useDoctors({ sort: "name-asc" });
  const services = useServices({ sort: "name-asc" });
  const cancel = useCancelAppointment();

  // Persist phone to localStorage after successful lookup
  useEffect(() => {
    if (enabled && phone && appointments.data) {
      try {
        window.localStorage.setItem(LAST_PHONE_KEY, phone);
      } catch {
        // ignore localStorage errors
      }
    }
  }, [enabled, phone, appointments.data]);

  const doctorMap = useMemo(
    () => Object.fromEntries((doctors.data ?? []).map((item) => [item.id, item])),
    [doctors.data]
  );
  const serviceMap = useMemo(
    () => Object.fromEntries((services.data ?? []).map((item) => [item.id, item])),
    [services.data]
  );

  const onLookup = form.handleSubmit((values) => {
    const parsed = lookupSchema.parse(values);
    setPhone(parsed.phone);
    setEnabled(true);
  });

  const onChangePhone = () => {
    setPhone("");
    setEnabled(false);
    form.setValue("phone", "+998");
    try {
      window.localStorage.removeItem(LAST_PHONE_KEY);
    } catch {
      // ignore
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelId) return;
    try {
      await cancel.mutateAsync({ id: cancelId, phone });
      toast.success("Qabul muvaffaqiyatli bekor qilindi");
      setCancelId(null);
      void appointments.refetch();
    } catch (error) {
      const message =
        error instanceof ClinicApiError ? error.message : "Bekor qilishda xatolik yuz berdi";
      toast.error(message);
    }
  };

  const appointmentToCancel = (appointments.data ?? []).find((item) => item.id === cancelId);

  if (!mounted || doctors.isLoading || services.isLoading) {
    return <AppointmentsSkeleton />;
  }

  return (
    <div className="min-h-[calc(100vh-72px-300px)]">
      <PageHero
        eyebrow="Bemor zonasi"
        title="Mening qabullarim"
        description="Telefon raqamingiz orqali barcha faol va o‘tgan qabullaringizni kuzating hamda zarur bo‘lsa bekor qiling."
      />

      <div className="container max-w-4xl py-10 px-4 sm:px-6 lg:px-8">
        {!enabled ? (
          <form
            onSubmit={onLookup}
            className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4"
          >
            <h2 className="text-lg font-bold text-slate-900">
              Qabullarni topish
            </h2>
            <p className="text-xs text-slate-500">
              Qabulga yozilishda ko‘rsatgan telefon raqamingizni kiriting (+998XXXXXXXXX).
            </p>
            <FieldShell
              label="Telefon raqam"
              error={form.formState.errors.phone?.message}
            >
              <TextInput
                placeholder="+998901234567"
                {...form.register("phone")}
                autoFocus
              />
            </FieldShell>
            <PrimaryButton
              type="submit"
              size="lg"
              className="rounded-2xl px-6 shrink-0 whitespace-nowrap"
            >
              Qabullarni ko‘rish →
            </PrimaryButton>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Qidirilgan raqam:</p>
                <p className="font-mono text-base font-bold text-slate-900">{phone}</p>
              </div>
              <SecondaryButton
                size="sm"
                onClick={onChangePhone}
                className="rounded-xl shrink-0 whitespace-nowrap"
              >
                Boshqa raqam kiritish
              </SecondaryButton>
            </div>

            {appointments.isLoading ? (
              <div className="py-12 text-center text-sm text-slate-500 animate-pulse">
                Qabullar yuklanmoqda...
              </div>
            ) : (appointments.data ?? []).length === 0 ? (
              <EmptyState
                title="Qabullar topilmadi"
                description="Ushbu telefon raqamiga biriktirilgan faol qabullar mavjud emas."
                actionLabel="Qabulga yozilish"
                onAction={() => {
                  window.location.href = "/book";
                }}
              />
            ) : (
              <div className="space-y-4">
                {(appointments.data ?? []).map((apt) => (
                  <AppointmentCard
                    key={apt.id}
                    appointment={apt}
                    doctor={doctorMap[apt.doctorId]}
                    service={serviceMap[apt.serviceId]}
                    onCancel={(id) => setCancelId(id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(cancelId)}
        onClose={() => setCancelId(null)}
        onConfirm={handleConfirmCancel}
        loading={cancel.isPending}
        confirmLabel="Bekor qilish"
        title="Qabulni bekor qilish"
        description={
          appointmentToCancel
            ? `${appointmentToCancel.date} soat ${appointmentToCancel.time} dagi qabulni bekor qilishni tasdiqlaysizmi?`
            : "Qabulni bekor qilishni tasdiqlaysizmi?"
        }
      />
    </div>
  );
};
