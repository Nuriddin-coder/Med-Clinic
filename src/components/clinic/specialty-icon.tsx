"use client";

import React from "react";
import {
  Activity,
  Baby,
  Bone,
  Brain,
  Eye,
  Flower2,
  Heart,
  Pill,
  Scan,
  ShieldAlert,
  Smile,
  Sparkles,
  Stethoscope,
  LucideIcon,
} from "lucide-react";

interface SpecialtyIconProps {
  id?: string;
  name?: string;
  iconName?: string;
  className?: string;
}

export const getSpecialtyIcon = (id?: string, name?: string, iconName?: string): LucideIcon => {
  const normId = (id || "").toLowerCase();
  const normName = (name || "").toLowerCase();
  const normIcon = (iconName || "").toLowerCase();

  // 1. Dermatologiya
  if (normId.includes("derm") || normName.includes("dermatolog") || normIcon === "flower2") {
    return Sparkles;
  }

  // 2. Kardiologiya
  if (normId.includes("cardio") || normName.includes("kardio") || normIcon === "heart") {
    return Heart;
  }

  // 3. Nevrologiya
  if (normId.includes("neuro") || normName.includes("nevro") || normIcon === "brain") {
    return Brain;
  }

  // 4. Oftalmologiya (Ko'z)
  if (normId.includes("ophthalm") || normId.includes("eye") || normName.includes("oftalmo") || normIcon === "eye") {
    return Eye;
  }

  // 5. Ortopediya va travmatologiya
  if (normId.includes("orthoped") || normName.includes("ortoped") || normIcon === "bone") {
    return Bone;
  }

  // 6. Pediatriya (Bolalar)
  if (normId.includes("pediatr") || normName.includes("pediatr") || normIcon === "baby") {
    return Baby;
  }

  // 7. Stomatologiya (Tish)
  if (normId.includes("dent") || normName.includes("stomatolog") || normIcon === "smile") {
    return Smile;
  }

  // 8. Gastroenterologiya
  if (normId.includes("gastro") || normName.includes("gastro") || normName.includes("oshqozon")) {
    return Pill;
  }

  // 9. UZI diagnostika
  if (normId.includes("ultrasound") || normId.includes("uzi") || normName.includes("uzi") || normIcon === "scan") {
    return Scan;
  }

  // 10. Terapiya / Umumiy
  if (normId.includes("therapy") || normName.includes("terap") || normIcon === "stethoscope") {
    return Stethoscope;
  }

  return Activity;
};

export const SpecialtyIcon: React.FC<SpecialtyIconProps> = ({
  id,
  name,
  iconName,
  className = "h-5 w-5",
}) => {
  const IconComponent = getSpecialtyIcon(id, name, iconName);
  return <IconComponent className={className} />;
};

