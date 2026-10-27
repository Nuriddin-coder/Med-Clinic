import { AppointmentStatus } from "@/types/clinic";
import { STATUS_LABELS } from "@/lib/format";
import { cn } from "@/lib/utils";

const tones: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  completed: "bg-slate-100 text-slate-700",
  cancelled: "bg-rose-100 text-rose-700",
  no_show: "bg-orange-100 text-orange-800",
};

export const StatusBadge = ({ status }: { status: AppointmentStatus }) => (
  <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", tones[status])}>
    {STATUS_LABELS[status]}
  </span>
);
