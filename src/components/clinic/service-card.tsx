"use client";

import { Link } from "@/components";
import { Button } from "@/components/ui/button";
import { formatSom } from "@/lib/format";
import { ServiceItem, Specialty } from "@/types/clinic";
import { Clock } from "lucide-react";

export const ServiceCard = ({
  service,
  specialty,
}: {
  service: ServiceItem;
  specialty?: Specialty;
}) => (
  <article className="flex h-full flex-col rounded-2xl border border-Input_border bg-white p-5 shadow-cardShadow">
    <p className="text-xs font-semibold uppercase tracking-wide text-Primary_app">
      {specialty?.name}
    </p>
    <h3 className="mt-1 text-lg font-semibold text-blackColor">{service.name}</h3>
    <p className="mt-2 flex-1 text-sm text-Bodytext_color">{service.description}</p>
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="inline-flex items-center gap-1 text-Navbar_Color">
        <Clock className="h-4 w-4" />
        {service.durationMinutes} daqiqa
      </span>
      <span className="font-semibold text-blackColor">{formatSom(service.price)}</span>
    </div>
    <Button asChild className="mt-4 w-full">
      <Link href={`/book?serviceId=${service.id}`}>Qabulga yozilish</Link>
    </Button>
  </article>
);
