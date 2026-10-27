"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/clinic/empty-state";
import { PageHero } from "@/components/clinic/page-hero";
import { ServiceCard } from "@/components/clinic/service-card";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageLoader } from "@/components/ui/skeleton";
import { useQueryParams } from "@/hooks";
import { useServices, useSpecialties } from "@/hooks/clinic/use-clinic-query";
import { ServiceSort } from "@/types/clinic";

const sortOptions: { value: ServiceSort; label: string }[] = [
  { value: "name-asc", label: "Nomi A–Z" },
  { value: "price-asc", label: "Narx: arzonroq" },
  { value: "price-desc", label: "Narx: qimmatroq" },
  { value: "duration-asc", label: "Davomiyligi" },
];

const isSort = (value: string | undefined): value is ServiceSort =>
  Boolean(value && sortOptions.some((item) => item.value === value));

export const ServicesPage = () => {
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParams();
  const search = searchParams.get("q") ?? "";
  const specialty = searchParams.get("specialty") ?? "";
  const sortParam = searchParams.get("sort") ?? "name-asc";
  const sort: ServiceSort = isSort(sortParam) ? sortParam : "name-asc";

  const params = useMemo(
    () => ({
      search: search || undefined,
      specialtyId: specialty || undefined,
      sort,
    }),
    [search, specialty, sort]
  );

  const services = useServices(params);
  const specialties = useSpecialties();

  const update = (patch: Record<string, string>) => {
    const next = { q: search, specialty, sort, ...patch };
    setQueryParams({
      ...(next.q ? { q: next.q } : {}),
      ...(next.specialty ? { specialty: next.specialty } : {}),
      ...(next.sort && next.sort !== "name-asc" ? { sort: next.sort } : {}),
    });
  };

  const loading = services.isLoading || specialties.isLoading;

  return (
    <div>
      <PageHero
        eyebrow="Narxlar"
        title="Xizmatlar"
        description="Konsultatsiya, check-up va muolajalar. Filter va saralash real vaqtda ishlaydi."
      />
      <div className="container py-8">
        <div className="mb-6 grid gap-3 rounded-2xl border border-Input_border bg-white p-4 md:grid-cols-4">
          <TextInput
            placeholder="Xizmat nomi"
            value={search}
            onChange={(event) => update({ q: event.target.value })}
            aria-label="Xizmat nomi"
          />

          <Select
            value={specialty || "all"}
            onValueChange={(val) => update({ specialty: val === "all" ? "" : val })}
          >
            <SelectTrigger className="w-full" aria-label="Mutaxassislik">
              <SelectValue placeholder="Barcha yo'nalishlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha yo'nalishlar</SelectItem>
              {(specialties.data ?? []).map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(val) => update({ sort: val })}
          >
            <SelectTrigger className="w-full" aria-label="Saralash">
              <SelectValue placeholder="Saralash" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => setQueryParams({})}>
            Filtrlarni tozalash
          </Button>
        </div>

        {loading ? (
          <PageLoader />
        ) : services.data && services.data.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.data.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                specialty={(specialties.data ?? []).find((item) => item.id === service.specialtyId)}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="Xizmat topilmadi" hint="Boshqa so‘z yoki yo‘nalishni sinab ko‘ring." />
        )}
      </div>
    </div>
  );
};
