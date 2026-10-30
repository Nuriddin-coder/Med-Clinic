"use client";

import { cn } from "@/lib/utils";

export const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "animate-pulse rounded-2xl bg-slate-200/80 transition-all",
      className
    )}
    {...props}
  />
);

/* =========================================================================
 * 1. HOME PAGE SKELETON
 * ========================================================================= */
export const HomeSkeleton = () => (
  <div className="flex flex-col min-h-[calc(100vh-72px-300px)]">
    {/* Hero Banner Skeleton */}
    <div className="bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/30 py-16 lg:py-24 border-b border-slate-100">
      <div className="container grid items-center gap-12 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-full max-w-lg" />
          <Skeleton className="h-4 w-4/5 max-w-md" />
          <div className="pt-4 flex gap-3 max-w-xl">
            <Skeleton className="h-12 flex-1 rounded-2xl" />
            <Skeleton className="h-12 w-32 rounded-2xl" />
          </div>
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-11 w-40 rounded-2xl" />
            <Skeleton className="h-11 w-48 rounded-2xl" />
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <Skeleton className="mt-4 h-8 w-20" />
              <Skeleton className="mt-2 h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Specialties Skeleton */}
    <div className="container py-16">
      <div className="flex justify-between items-end mb-8">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>

    {/* Featured Doctors Skeleton */}
    <div className="bg-slate-50/50 py-16">
      <div className="container">
        <div className="flex justify-between items-end mb-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-72" />
          </div>
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-14 w-full rounded-xl" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-9 w-28 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* =========================================================================
 * 2. DOCTORS LIST SKELETON
 * ========================================================================= */
export const DoctorsListSkeleton = () => (
  <div className="min-h-[calc(100vh-72px-300px)]">
    {/* Page Hero Skeleton */}
    <div className="border-b border-slate-200 bg-gradient-to-b from-blue-50/40 to-white py-12">
      <div className="container space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
    </div>

    {/* Filter Bar Skeleton */}
    <div className="container py-8">
      <div className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4">
        <Skeleton className="h-11 rounded-xl" />
        <Skeleton className="h-11 rounded-xl" />
        <Skeleton className="h-11 rounded-xl" />
        <Skeleton className="h-11 rounded-xl" />
      </div>

      {/* Doctor Cards Grid Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="flex justify-between items-center border-t border-slate-100 pt-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-9 w-32 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* =========================================================================
 * 3. DOCTOR DETAIL SKELETON
 * ========================================================================= */
export const SlotSkeleton = () => (
  <div className="grid grid-cols-3 gap-2 p-4">
    {[1,2,3,4,5,6].map(i => (
      <Skeleton key={i} className="h-8 w-full rounded" />
    ))}
  </div>
);

export const DoctorDetailSkeleton = () => (
  <div className="min-h-[calc(100vh-72px-300px)]">
    <div className="border-b border-slate-200 bg-gradient-to-b from-blue-50/40 to-white py-12">
      <div className="container space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
    </div>

    <div className="container grid gap-8 py-10 lg:grid-cols-[1.4fr_0.8fr]">
      {/* Left side details */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </div>

      {/* Right side schedule & booking */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <Skeleton className="h-6 w-32" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex justify-between items-center py-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-9 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-11 w-full rounded-2xl mt-4" />
        </div>
      </div>
    </div>
  </div>
);

/* =========================================================================
 * 4. SERVICES SKELETON
 * ========================================================================= */
export const ServicesSkeleton = () => (
  <div className="min-h-[calc(100vh-72px-300px)]">
    <div className="border-b border-slate-200 bg-gradient-to-b from-blue-50/40 to-white py-12">
      <div className="container space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-60" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
    </div>

    <div className="container py-8">
      <div className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4">
        <Skeleton className="h-11 rounded-xl" />
        <Skeleton className="h-11 rounded-xl" />
        <Skeleton className="h-11 rounded-xl" />
        <Skeleton className="h-11 rounded-xl" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="flex justify-between items-center border-t border-slate-100 pt-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* =========================================================================
 * 5. BOOKING WIZARD SKELETON
 * ========================================================================= */
export const BookPageSkeleton = () => (
  <div className="min-h-[calc(100vh-72px-300px)]">
    <div className="border-b border-slate-200 bg-gradient-to-b from-blue-50/40 to-white py-12">
      <div className="container space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
    </div>

    <div className="container py-10">
      {/* Steps progress skeleton */}
      <div className="mx-auto mb-10 max-w-3xl">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <Skeleton className="h-3 w-16 hidden sm:block" />
            </div>
          ))}
        </div>
        <Skeleton className="mt-4 h-1.5 w-full rounded-full" />
      </div>

      {/* Content grid */}
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-96 max-w-full" />
          <div className="space-y-3 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

/* =========================================================================
 * 6. APPOINTMENTS (MY APPOINTMENT) SKELETON
 * ========================================================================= */
export const AppointmentsSkeleton = () => (
  <div className="min-h-[calc(100vh-72px-300px)]">
    <div className="border-b border-slate-200 bg-gradient-to-b from-blue-50/40 to-white py-12">
      <div className="container space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
    </div>

    <div className="container max-w-4xl py-10 space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="flex gap-3">
          <Skeleton className="h-12 flex-1 rounded-2xl" />
          <Skeleton className="h-12 w-32 rounded-2xl" />
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-16 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* =========================================================================
 * 7. CONTACT SKELETON
 * ========================================================================= */
export const ContactSkeleton = () => (
  <div className="min-h-[calc(100vh-72px-300px)]">
    <div className="border-b border-slate-200 bg-gradient-to-b from-blue-50/40 to-white py-12">
      <div className="container space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-4 w-80" />
      </div>
    </div>

    <div className="container grid gap-8 py-10 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
        <Skeleton className="h-11 rounded-xl" />
        <Skeleton className="h-11 rounded-xl" />
        <Skeleton className="h-11 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-5">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-40" />
        </div>
      </div>
    </div>
  </div>
);

/* =========================================================================
 * 8. ADMIN DASHBOARD SKELETON
 * ========================================================================= */
export const AdminDashboardSkeleton = () => (
  <div className="min-h-[calc(100vh-72px-300px)] py-10 bg-slate-50/50">
    <div className="container space-y-8">
      {/* Header bar skeleton */}
      <div className="flex justify-between items-center rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-10 w-48 rounded-xl" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* Default PageLoader fallback */
export const PageLoader = ({ label = "Yuklanmoqda..." }: { label?: string }) => (
  <div className="container min-h-[calc(100vh-72px-300px)] py-16 flex flex-col justify-center">
    <p className="mb-6 text-sm font-semibold text-slate-500 animate-pulse">{label}</p>
    <div className="grid gap-4 md:grid-cols-3">
      <Skeleton className="h-48 rounded-3xl" />
      <Skeleton className="h-48 rounded-3xl" />
      <Skeleton className="h-48 rounded-3xl" />
    </div>
  </div>
);
