import { cn } from "@/lib/utils";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-xl bg-ClrEEE", className)} />
);

export const PageLoader = ({ label = "Yuklanmoqda..." }: { label?: string }) => (
  <div className="container py-16">
    <p className="mb-6 text-sm text-Navbar_Color">{label}</p>
    <div className="grid gap-4 md:grid-cols-3">
      <Skeleton className="h-40" />
      <Skeleton className="h-40" />
      <Skeleton className="h-40" />
    </div>
  </div>
);
