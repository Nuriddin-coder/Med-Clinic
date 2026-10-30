"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/clinic/empty-state";
import { PageHero } from "@/components/clinic/page-hero";
import { ServiceCard } from "@/components/clinic/service-card";
import { SpecialtyIcon } from "@/components/clinic/specialty-icon";
import { SecondaryButton } from "@/components/ui/button";
import { TextInput } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServicesSkeleton } from "@/components/ui/skeleton";
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

  const handleReset = () => {
    setQueryParams({});
  };

  if (services.isLoading || specialties.isLoading) {
    return <ServicesSkeleton />;
  }

  const list = services.data ?? [];
  const hasFilter = Boolean(search || specialty || (sort && sort !== "name-asc"));

  return (
    <div className="min-h-[calc(100vh-72px-300px)]">
      <PageHero
        eyebrow="Narxlar"
        title="Klinika xizmatlari"
        description="Konsultatsiya, laboratoriya tekshiruvlari va muolajalar narxnomasi."
      />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
          <TextInput
            placeholder="Xizmat nomi..."
            value={search}
            onChange={(event) => update({ q: event.target.value })}
            aria-label="Xizmat nomi"
          />

          <Select
            value={specialty || "all"}
            onValueChange={(val) => update({ specialty: val === "all" ? "" : val })}
          >
            <SelectTrigger className="w-full" aria-label="Mutaxassislik">
              <SelectValue placeholder="Barcha yo‘nalishlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha yo‘nalishlar</SelectItem>
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
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <SecondaryButton
            onClick={handleReset}
            disabled={!hasFilter}
            className="w-full rounded-xl shrink-0 whitespace-nowrap"
          >
            Filtrni tozalash
          </SecondaryButton>
        </div>

        {list.length === 0 ? (
          <EmptyState
            title="Xizmat topilmadi"
            description="Boshqa so‘z bilan qidiring yoki filtrni bekor qiling."
            actionLabel="Filtrni tozalash"
            onAction={handleReset}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                specialties={specialties.data ?? []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
