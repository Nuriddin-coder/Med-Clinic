import { ReactNode } from "react";

export type {
  Appointment,
  AppointmentStatus,
  ClinicApi,
  ClinicInfo,
  Doctor,
  ServiceItem,
  Specialty,
} from "./clinic";

export type TLocale = "uz" | "en" | "ru" | "kr";

export type TPrimitive = string | number | boolean;
export type TObject<T = TPrimitive> = Record<string, T>;

export interface IChildren {
  children: ReactNode;
}

export interface IParams {
  locale: TLocale;
}

export interface ILocaleData {
  uz: string;
  ru: string;
  en: string;
  kr: string;
}

export interface IFetchingProps {
  url: string;
  params?: TObject;
  enabled?: boolean;
}

export interface ISelectData<T = string> {
  value: T;
  label: string;
  see?: string;
}
