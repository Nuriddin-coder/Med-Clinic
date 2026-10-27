import { AppointmentStatus, Weekday } from "@/types/clinic";

export const formatSom = (value: number): string =>
  `${new Intl.NumberFormat("uz-UZ").format(value)} so‘m`;

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  monday: "Dushanba",
  tuesday: "Seshanba",
  wednesday: "Chorshanba",
  thursday: "Payshanba",
  friday: "Juma",
  saturday: "Shanba",
  sunday: "Yakshanba",
};

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Kutilmoqda",
  confirmed: "Tasdiqlangan",
  completed: "Yakunlangan",
  cancelled: "Bekor qilingan",
  no_show: "Kelmagan",
};

export const WEEKDAY_ORDER: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
