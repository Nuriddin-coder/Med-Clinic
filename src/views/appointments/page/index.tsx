"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppointmentCard } from "@/components/clinic/appointment-card";
import { ConfirmDialog } from "@/components/clinic/confirm-dialog";
import { EmptyState } from "@/components/clinic/empty-state";
import { PageHero } from "@/components/clinic/page-hero";
import { Button } from "@/components/ui/button";
import { FieldShell, TextInput } from "@/components/ui/field";
import { PageLoader } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
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
  const { notify } = useToast();
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

  const onConfirmCancel = async () => {
    if (!cancelId) {
      return;
    }
    try {
      await cancel.mutateAsync({ id: cancelId, phone });
      notify("success", "Qabul bekor qilindi");
      setCancelId(null);
    } catch (error) {
      const message =
        error instanceof ClinicApiError ? error.message : "Bekor qilish amalga oshmadi";
      notify("error", message);
    }
  };

  return (
    <div>
      <PageHero
        eyebrow="Bemor zonasi"
        title="Mening qabullarim"
        description="Kirish yo'q. Telefon raqamingizni kiriting — shu raqamga yozilgan qabullar chiqadi."
      />
      <div className="container py-8">
        <form
          onSubmit={onLookup}
          className="mb-8 rounded-2xl border border-Input_border bg-white p-4"
        >
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <FieldShell
              label="Telefon raqam"
              hint="Demo raqam: +998 90 123 45 67"
              error={form.formState.errors.phone?.message}
            >
              <TextInput placeholder="+998 90 123 45 67" {...form.register("phone")} />
            </FieldShell>
            <div className="flex items-end gap-2">
              <Button type="submit" className="w-full md:w-auto">
                Qabullarni ko&apos;rish
              </Button>
              {enabled && (
                <Button type="button" variant="outline" onClick={onChangePhone}>
                  Boshqa raqam
                </Button>
              )}
            </div>
          </div>
        </form>

        {!enabled ? (
          <EmptyState
            title="Telefon raqamingizni kiriting"
            hint="Yozilgan qabullar faqat shu raqam egasiga ko'rinadi. Demo uchun: +998901234567"
          />
        ) : appointments.isLoading || doctors.isLoading || services.isLoading ? (
          <PageLoader label="Qabullar yuklanmoqda..." />
        ) : appointments.isError ? (
          <EmptyState
            title="Qabullarni yuklab bo'lmadi"
            hint={
              appointments.error instanceof Error
                ? appointments.error.message
                : "Qayta urinib ko'ring"
            }
          />
        ) : appointments.data && appointments.data.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {appointments.data.map((item) => (
              <AppointmentCard
                key={item.id}
                appointment={item}
                doctor={doctorMap[item.doctorId]}
                service={serviceMap[item.serviceId]}
                onCancel={setCancelId}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Qabul topilmadi"
            hint="Boshqa raqam yoki avval yozilishni sinab ko'ring."
          />
        )}
      </div>

      <ConfirmDialog
        open={Boolean(cancelId)}
        title="Qabulni bekor qilasizmi?"
        description="Faqat kutilayotgan yoki tasdiqlangan qabulni bekor qilish mumkin. Bu amalni administrator emas, siz bajarasiz."
        confirmLabel="Ha, bekor qilish"
        loading={cancel.isPending}
        onClose={() => setCancelId(null)}
        onConfirm={onConfirmCancel}
      />
    </div>
  );
};
