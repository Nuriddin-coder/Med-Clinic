import { format, formatDistance, isToday, isTomorrow, parseISO } from "date-fns";
import { uz } from "date-fns/locale";

export const formatClinicDate = (date: string | Date, pattern = "d MMMM, yyyy"): string => {
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return format(d, pattern, { locale: uz });
  } catch {
    return String(date);
  }
};

export const formatRelativeClinicDate = (date: string | Date): string => {
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    if (isToday(d)) return "Bugun";
    if (isTomorrow(d)) return "Ertaga";
    return format(d, "EEEE, d-MMMM", { locale: uz });
  } catch {
    return String(date);
  }
};

export const formatTime = (time: string): string => {
  return time;
};

export { format, parseISO, isToday, isTomorrow };

