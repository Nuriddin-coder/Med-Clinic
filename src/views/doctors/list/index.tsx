"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DoctorCard } from "@/components/clinic/doctor-card";
import { EmptyState } from "@/components/clinic/empty-state";
import { PageHero } from "@/components/clinic/page-hero";
import { SecondaryButton } from "@/components/ui/button";
import { TextInput } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DoctorsListSkeleton } from "@/components/ui/skeleton";
import { useDoctors, useSpecialties } from "@/hooks/clinic/use-clinic-query";
import { useQueryParams } from "@/hooks";
import { DoctorSort } from "@/types/clinic";

const sortOptions: { value: DoctorSort; label: string }[] = [
  { value: "name-asc", label: "Ism A–Z" },
  { value: "name-desc", label: "Ism Z–A" },
  { value: "rating-desc", label: "Reyting bo‘yicha" },
  { value: "experience-desc", label: "Tajriba bo‘yicha" },
  { value: "price-asc", label: "Narx: arzonroq" },
  { value: "price-desc", label: "Narx: qimmatroq" },
];

const isSort = (value: string | undefined): value is DoctorSort =>
  Boolean(value && sortOptions.some((item) => item.value === value));

export const DoctorsListPage = () => {
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParams();
  const search = searchParams.get("q") ?? "";
  const specialty = searchParams.get("specialty") ?? "";
  const sortParam = searchParams.get("sort") ?? "rating-desc";
  const sort: DoctorSort = isSort(sortParam) ? sortParam : "rating-desc";

  const [searchInput, setSearchInput] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        const next: Record<string, string> = {};
        if (value) next.q = value;
        if (specialty) next.specialty = specialty;
        if (sort && sort !== "rating-desc") next.sort = sort;
        setQueryParams(next);
      }, 300);
    },
    [specialty, sort, setQueryParams]
  );

  const params = useMemo(
    () => ({
      search: search || undefined,
      specialtyId: specialty || undefined,
      sort,
    }),
    [search, specialty, sort]
  );

  const doctors = useDoctors(params);
  const specialties = useSpecialties();

  const update = (patch: Record<string, string>) => {
    const next = {
      q: search,
      specialty,
      sort,
      ...patch,
    };
    setQueryParams({
      ...(next.q ? { q: next.q } : {}),
      ...(next.specialty ? { specialty: next.specialty } : {}),
      ...(next.sort && next.sort !== "rating-desc" ? { sort: next.sort } : {}),
    });
  };

  const handleReset = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    setSearchInput("");
    setQueryParams({});
  };

  if (doctors.isLoading || specialties.isLoading) {
    return <DoctorsListSkeleton />;
  }

  const list = doctors.data ?? [];
  const hasFilter = Boolean(search || specialty || (sort && sort !== "rating-desc"));

  return (
    <div className="min-h-[calc(100vh-72px-300px)]">
      <PageHero
        eyebrow="Jamoa"
        title="Klinika shifokorlari"
        description="Tajribali terapevtlar, jarrohlar va tor soha mutaxassislari. Mutaxassislik va reyting bo‘yicha saralang."
      />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
          <TextInput
            placeholder="Shifokor ismi..."
            value={searchInput}
            onChange={(event) => handleSearchChange(event.target.value)}
            aria-label="Qidirish"
          />

          <Select
            value={specialty || "all"}
            onValueChange={(val) => update({ specialty: val === "all" ? "" : val })}
          >
            <SelectTrigger className="w-full" aria-label="Mutaxassislik">
              <SelectValue placeholder="Barcha mutaxassisliklar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha mutaxassisliklar</SelectItem>
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
            title="Mos shifokor topilmadi"
            description="Qidiruv so‘zini o‘zgartirib ko‘ring yoki filtrni tozalang."
            actionLabel="Filtrni tozalash"
            onAction={handleReset}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                specialties={specialties.data ?? []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
