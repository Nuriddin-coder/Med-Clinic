"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DoctorCard } from "@/components/clinic/doctor-card";
import { EmptyState } from "@/components/clinic/empty-state";
import { PageHero } from "@/components/clinic/page-hero";
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
import { useDoctors, useSpecialties } from "@/hooks/clinic/use-clinic-query";
import { useQueryParams } from "@/hooks";
import { DoctorSort } from "@/types/clinic";

const sortOptions: { value: DoctorSort; label: string }[] = [
  { value: "name-asc", label: "Ism A–Z" },
  { value: "name-desc", label: "Ism Z–A" },
  { value: "rating-desc", label: "Reyting bo'yicha" },
  { value: "experience-desc", label: "Tajriba bo'yicha" },
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

  // Local input state for 300ms debounce
  const [searchInput, setSearchInput] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state if URL param changes externally (e.g., browser back/forward)
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

  const loading = doctors.isLoading || specialties.isLoading;

  return (
    <div>
      <PageHero
        eyebrow="Jamoa"
        title="Shifokorlar"
        description="Qidiruv, mutaxassislik filtri va saralash ishlaydi. Shifokorlar faqat ko'rish uchun — yozilish alohida."
      />
      <div className="container py-8">
        <div className="mb-6 grid gap-3 rounded-2xl border border-Input_border bg-white p-4 md:grid-cols-4">
          <TextInput
            placeholder="Ism, yo'nalish yoki kalit so'z"
            value={searchInput}
            onChange={(event) => handleSearchChange(event.target.value)}
            aria-label="Qidirish"
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

          <Button variant="outline" onClick={handleReset}>
            Filtrlarni tozalash
          </Button>
        </div>

        {loading ? (
          <PageLoader />
        ) : doctors.data && doctors.data.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {doctors.data.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} specialties={specialties.data ?? []} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Shifokor topilmadi"
            hint="Qidiruv yoki filterni o'zgartiring."
          />
        )}
      </div>
    </div>
  );
};
