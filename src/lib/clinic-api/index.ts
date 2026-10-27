import { ClinicApi } from "@/types/clinic";
import { mockClinicApi } from "@/lib/clinic-api/mock/adapter";
import { restClinicApi } from "@/lib/clinic-api/rest/adapter";

export const getClinicApi = (): ClinicApi => {
  const mode =
    process.env.NEXT_PUBLIC_DATA_SOURCE ??
    process.env.NEXT_PUBLIC_API_MODE ??
    "mock";
  return mode === "api" || mode === "rest" ? restClinicApi : mockClinicApi;
};

export const clinicQueryKeys = {
  info: ["clinic", "info"] as const,
  specialties: ["clinic", "specialties"] as const,
  doctors: (params: object) => ["clinic", "doctors", params] as const,
  doctor: (id: string) => ["clinic", "doctor", id] as const,
  services: (params: object) => ["clinic", "services", params] as const,
  service: (id: string) => ["clinic", "service", id] as const,
  slots: (params: object) => ["clinic", "slots", params] as const,
  appointments: (phone: string) => ["clinic", "appointments", phone] as const,
};
