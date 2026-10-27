"use client";

import { StatusBadge } from "@/components/clinic/status-badge";
import { Button } from "@/components/ui/button";
import { formatDateUz } from "@/lib/clinic-api/time";
import { formatSom } from "@/lib/format";
import { Appointment, Doctor, ServiceItem } from "@/types/clinic";

export const AppointmentCard = ({
  appointment,
  doctor,
  service,
  onCancel,
}: {
  appointment: Appointment;
  doctor?: Doctor;
  service?: ServiceItem;
  onCancel?: (id: string) => void;
}) => {
  const canCancel =
    (appointment.status === "pending" || appointment.status === "confirmed") &&
    Boolean(onCancel);

  return (
    <article className="rounded-2xl border border-Input_border bg-white p-5 shadow-cardShadow">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-blackColor">
            {doctor?.fullName ?? "Shifokor"}
          </h3>
          <p className="text-sm text-Primary_app">{service?.name}</p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>
      <dl className="mt-4 grid gap-2 text-sm text-Navbar_Color sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide">Sana</dt>
          <dd className="font-medium text-blackColor">{formatDateUz(appointment.date)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide">Vaqt</dt>
          <dd className="font-medium text-blackColor">
            {appointment.time} • {appointment.durationMinutes} daqiqa
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide">Bemor</dt>
          <dd className="font-medium text-blackColor">{appointment.patientName}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide">Narx</dt>
          <dd className="font-medium text-blackColor">
            {service ? formatSom(service.price) : "—"}
          </dd>
        </div>
      </dl>
      {appointment.notes ? (
        <p className="mt-3 rounded-xl bg-Light_background px-3 py-2 text-sm text-Bodytext_color">
          {appointment.notes}
        </p>
      ) : null}
      {canCancel ? (
        <Button variant="danger" className="mt-4" onClick={() => onCancel?.(appointment.id)}>
          Qabulni bekor qilish
        </Button>
      ) : null}
    </article>
  );
};
