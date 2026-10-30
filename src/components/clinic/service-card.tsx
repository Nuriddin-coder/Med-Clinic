"use client";

import { Link } from "@/components";
import { SpecialtyIcon } from "@/components/clinic/specialty-icon";
import { Button } from "@/components/ui/button";
import { formatSom } from "@/lib/format";
import { ServiceItem, Specialty } from "@/types/clinic";
import { Clock } from "lucide-react";

export const ServiceCard = ({
  service,
  specialty,
  specialties,
}: {
  service: ServiceItem;
  specialty?: Specialty;
  specialties?: Specialty[];
}) => {
  const currentSpecialty =
    specialty || (specialties ?? []).find((s) => s.id === service.specialtyId);

  return (
    <article className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-Primary_app/10 text-Primary_app shrink-0">
            <SpecialtyIcon
              id={service.specialtyId}
              name={currentSpecialty?.name}
              className="h-4 w-4"
            />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-Primary_app line-clamp-1">
            {currentSpecialty?.name || "Xizmat"}
          </span>
        </div>
        <h3 className="mt-3 text-base font-bold text-slate-900 line-clamp-2">{service.name}</h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-3">
          {service.description}
        </p>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-500 whitespace-nowrap">
            <Clock className="h-4 w-4 text-slate-400" />
            {service.durationMinutes} daqiqa
          </span>
          <span className="font-extrabold text-base text-slate-900 whitespace-nowrap">
            {formatSom(service.price)}
          </span>
        </div>
        <Button asChild className="mt-4 w-full rounded-xl shrink-0 whitespace-nowrap shadow-sm shadow-Primary_app/20">
          <Link href={`/book?serviceId=${service.id}`}>Qabulga yozilish →</Link>
        </Button>
      </div>
    </article>
  );
};
