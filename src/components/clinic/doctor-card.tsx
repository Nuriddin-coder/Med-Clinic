"use client";

import { Link } from "@/components";
import { InitialsAvatar } from "@/components/clinic/avatar";
import { Button } from "@/components/ui/button";
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
    <article className="flex h-full flex-col rounded-2xl border border-Input_border bg-white p-5 shadow-cardShadow">
      <div className="flex gap-4">
        <InitialsAvatar initials={doctor.photoInitials} hue={doctor.photoHue} />
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-blackColor">{doctor.fullName}</h3>
          <p className="text-sm text-Primary_app">{doctor.title}</p>
          <p className="mt-1 text-xs text-Navbar_Color">{names.join(" • ")}</p>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 text-sm text-Bodytext_color">{doctor.bio}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-blackColor">
        <span className="inline-flex items-center gap-1 font-medium">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          {doctor.rating.toFixed(1)}
          <span className="text-Navbar_Color">({doctor.reviewCount})</span>
        </span>
        <span>{doctor.experienceYears} yil tajriba</span>
        <span className="font-semibold">{formatSom(doctor.consultationPrice)}</span>
      </div>
      <div className="mt-5 flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/doctors/${doctor.id}`}>Profil</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href={`/book?doctorId=${doctor.id}`}>Yozilish</Link>
        </Button>
      </div>
    </article>
  );
};
