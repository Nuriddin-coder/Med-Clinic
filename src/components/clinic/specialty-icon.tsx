"use client";

import React from "react";
import {
  Activity,
  Baby,
  Bone,
  Brain,
  Eye,
  Heart,
  Pill,
  Scan,
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

  if (normId.includes("derm") || normName.includes("dermatolog") || normIcon === "flower2") {
    return Sparkles;
  }

  if (normId.includes("cardio") || normName.includes("kardio") || normIcon === "heart") {
    return Heart;
  }

  if (normId.includes("neuro") || normName.includes("nevro") || normIcon === "brain") {
    return Brain;
  }

  if (normId.includes("ophthalm") || normId.includes("eye") || normName.includes("oftalmo") || normIcon === "eye") {
    return Eye;
  }

  if (normId.includes("orthoped") || normName.includes("ortoped") || normIcon === "bone") {
    return Bone;
  }

  if (normId.includes("pediatr") || normName.includes("pediatr") || normIcon === "baby") {
    return Baby;
  }

  if (normId.includes("dent") || normName.includes("stomatolog") || normIcon === "smile") {
    return Smile;
  }

  if (normId.includes("gastro") || normName.includes("gastro") || normName.includes("oshqozon")) {
    return Pill;
  }

  if (normId.includes("ultrasound") || normId.includes("uzi") || normName.includes("uzi") || normIcon === "scan") {
    return Scan;
  }

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