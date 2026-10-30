"use client";

import { Link } from "@/components";
import { InitialsAvatar } from "@/components/clinic/avatar";
import { PrimaryButton, SecondaryButton } from "@/components/ui/button";
import { formatSom } from "@/lib/format";
import { Doctor, Specialty } from "@/types/clinic";
import { Star } from "lucide-react";

export const DoctorCard = ({
  doctor,
  specialties,
}: {
  doctor: Doctor;
  specialties: Specialty[];
}) => {
  const names = specialties
    .filter((item) => doctor.specialtyIds.includes(item.id))
    .map((item) => item.name);

  return (
    <article className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300">
      <div>
        <div className="flex gap-4 items-start">
          <InitialsAvatar initials={doctor.photoInitials} hue={doctor.photoHue} size="md" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold text-slate-900">{doctor.fullName}</h3>
            <p className="text-xs font-semibold text-Primary_app line-clamp-1">{doctor.title}</p>
            <p className="mt-1 text-xs text-slate-400 line-clamp-1">{names.join(" • ")}</p>
          </div>
        </div>
        <p className="mt-4 line-clamp-2 text-xs leading-relaxed text-slate-500">{doctor.bio}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-700">
          <span className="inline-flex items-center gap-1 font-bold text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
            {doctor.rating.toFixed(1)}
            <span className="text-slate-400 font-normal">({doctor.reviewCount})</span>
          </span>
          <span>{doctor.experienceYears} yil staj</span>
          <span className="font-extrabold text-slate-900">{formatSom(doctor.consultationPrice)}</span>
        </div>
      </div>
      <div className="mt-6 flex gap-2 border-t border-slate-100 pt-4">
        <SecondaryButton asChild size="sm" className="flex-1 rounded-xl shrink-0 whitespace-nowrap">
          <Link href={`/doctors/${doctor.id}`}>Profil</Link>
        </SecondaryButton>
        <PrimaryButton asChild size="sm" className="flex-1 rounded-xl shrink-0 whitespace-nowrap">
          <Link href={`/book?doctorId=${doctor.id}`}>Qabulga yozilish</Link>
        </PrimaryButton>
      </div>
    </article>
  );
};
