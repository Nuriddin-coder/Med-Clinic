"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Stethoscope,
  Trash2,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { Link, useRouter } from "@/components";
import { InitialsAvatar } from "@/components/clinic/avatar";
import { StatusBadge } from "@/components/clinic/status-badge";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/field";
import { AdminDashboardSkeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  useClinicInfo,
  useDoctors,
  useServices,
  useSpecialties,
} from "@/hooks/clinic/use-clinic-query";
import { api, cancelAppointment, getAppointments } from "@/lib/api";
import { formatClinicDate } from "@/lib/date";
import { formatSom } from "@/lib/format";
import { Appointment, AppointmentStatus } from "@/types/clinic";

export const AdminDashboardPage = () => {
  const router = useRouter();
  const info = useClinicInfo();
  const doctors = useDoctors({ sort: "name-asc" });
  const services = useServices({ sort: "name-asc" });
  const specialties = useSpecialties();

  const [activeTab, setActiveTab] = useState<"appointments" | "doctors" | "services">("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check auth
  useEffect(() => {
    const auth = localStorage.getItem("med_admin_auth") || localStorage.getItem("med_token");
    if (!auth) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch all appointments
  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const res = await getAppointments("+998901234567");
      if (res && res.data) {
        setAppointments(res.data);
      }
    } catch (error) {
      // fallback
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("med_admin_auth");
    localStorage.removeItem("med_token");
    toast.info("Tizimdan chiqdingiz");
    router.push("/admin/login");
  };

  const doctorMap = useMemo(
    () => Object.fromEntries((doctors.data ?? []).map((d) => [d.id, d])),
    [doctors.data]
  );

  const serviceMap = useMemo(
    () => Object.fromEntries((services.data ?? []).map((s) => [s.id, s])),
    [services.data]
  );

  const handleCancelApt = async (apt: Appointment) => {
    if (!window.confirm(`Haqiqatan ham ${apt.patientName} ning qabulini bekor qilmoqchimisiz?`)) {
      return;
    }
    try {
      await cancelAppointment(apt.id, apt.patientPhone);
      toast.success("Qabul muvaffaqiyatli bekor qilindi");
      setAppointments((prev) =>
        prev.map((item) => (item.id === apt.id ? { ...item, status: "cancelled" } : item))
      );
    } catch (error: any) {
      toast.error(error.message || "Bekor qilishda xatolik yuz berdi");
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchStatus = statusFilter === "all" || apt.status === statusFilter;
      const matchSearch =
        !searchQuery ||
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patientPhone.includes(searchQuery) ||
        apt.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [appointments, statusFilter, searchQuery]);

  if (isAuthenticated === null || doctors.isLoading || services.isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (isAuthenticated === false) {
    return (
      <div className="container min-h-[calc(100vh-72px-300px)] py-20 text-center flex flex-col items-center justify-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Avtorizatsiya talab etiladi</h2>
        <p className="mt-2 text-sm text-slate-500">
          Ushbu boshqaruv paneliga kirish uchun iltimos tizimga kiring.
        </p>
        <Button asChild className="mt-6 rounded-2xl shrink-0 whitespace-nowrap">
          <Link href="/admin/login">Kirish sahifasiga o‘tish</Link>
        </Button>
      </div>
    );
  }

  const clinic = info.data;

  return (
    <div className="min-h-[calc(100vh-72px-300px)] bg-slate-50/50 py-10">
      <div className="container space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-Primary_app text-white shadow-md shadow-Primary_app/30 shrink-0">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {clinic?.name || "MED Clinic"} — Boshqaruv Paneli
              </h1>
              <p className="text-xs text-slate-500">
                Administrator ish stoli va qabullar monitoringi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAppointments}
              className="rounded-xl flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <RefreshCw className={`h-4 w-4 ${loadingAppointments ? "animate-spin" : ""}`} />
              Yangilash
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <LogOut className="h-4 w-4" />
              Chiqish
            </Button>
          </div>
        </div>

        {/* KPI / Statistics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Jami Qabullar
              </span>
              <Calendar className="h-5 w-5 text-Primary_app" />
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900">
              {appointments.length}
            </p>
            <span className="text-[11px] font-medium text-slate-500">
              Tizimga yozilgan navbatlar
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Kutilayotgan
              </span>
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <p className="mt-3 text-2xl font-black text-amber-600">
              {appointments.filter((a) => a.status === "pending").length}
            </p>
            <span className="text-[11px] font-medium text-slate-500">
              Tasdiqlash kutilmoqda
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Shifokorlar
              </span>
              <Stethoscope className="h-5 w-5 text-teal-600" />
            </div>
            <p className="mt-3 text-2xl font-black text-teal-700">
              {doctors.data?.length ?? 10}
            </p>
            <span className="text-[11px] font-medium text-slate-500">
              Faol mutaxassislar
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Xizmat turlari
              </span>
              <Activity className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="mt-3 text-2xl font-black text-indigo-700">
              {services.data?.length ?? 12}
            </p>
            <span className="text-[11px] font-medium text-slate-500">
              Faol diagnostika va muolajalar
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`border-b-2 px-5 py-3 text-sm font-bold transition whitespace-nowrap ${
              activeTab === "appointments"
                ? "border-Primary_app text-Primary_app"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Qabullar nazorati ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab("doctors")}
            className={`border-b-2 px-5 py-3 text-sm font-bold transition whitespace-nowrap ${
              activeTab === "doctors"
                ? "border-Primary_app text-Primary_app"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Shifokorlar ({doctors.data?.length ?? 0})
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`border-b-2 px-5 py-3 text-sm font-bold transition whitespace-nowrap ${
              activeTab === "services"
                ? "border-Primary_app text-Primary_app"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Xizmatlar ({services.data?.length ?? 0})
          </button>
        </div>

        {/* TAB 1: APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* Search and Filters */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <TextInput
                  className="pl-9"
                  placeholder="Bemor ismi yoki telefon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Holat:</span>
                {["all", "pending", "confirmed", "cancelled"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition shrink-0 whitespace-nowrap ${
                      statusFilter === st
                        ? "bg-Primary_app text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st === "all" ? "Barchasi" : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Appointments Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-3 whitespace-nowrap">ID</th>
                    <th className="py-3 px-3 whitespace-nowrap">Bemor</th>
                    <th className="py-3 px-3 whitespace-nowrap">Shifokor</th>
                    <th className="py-3 px-3 whitespace-nowrap">Xizmat</th>
                    <th className="py-3 px-3 whitespace-nowrap">Sana & Vaqt</th>
                    <th className="py-3 px-3 whitespace-nowrap">Holat</th>
                    <th className="py-3 px-3 text-right whitespace-nowrap">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-sm text-slate-400">
                        Qabullar topilmadi.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((apt) => {
                      const doc = doctorMap[apt.doctorId];
                      const srv = serviceMap[apt.serviceId];
                      return (
                        <tr key={apt.id} className="hover:bg-slate-50/70">
                          <td className="py-3.5 px-3 font-mono text-xs text-slate-500 whitespace-nowrap">
                            {apt.id.slice(0, 14)}...
                          </td>
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <p className="font-bold text-slate-900">{apt.patientName}</p>
                            <span className="font-mono text-xs text-slate-500">
                              {apt.patientPhone}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-700 whitespace-nowrap">
                            {doc?.fullName || apt.doctorId}
                          </td>
                          <td className="py-3.5 px-3 text-slate-700 whitespace-nowrap">
                            {srv?.name || apt.serviceId}
                          </td>
                          <td className="py-3.5 px-3 text-Primary_app font-semibold whitespace-nowrap">
                            {apt.date} • {apt.time}
                          </td>
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <StatusBadge status={apt.status} />
                          </td>
                          <td className="py-3.5 px-3 text-right whitespace-nowrap">
                            {apt.status !== "cancelled" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelApt(apt)}
                                className="rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 shrink-0 whitespace-nowrap"
                              >
                                Bekor qilish
                              </Button>
                            ) : (
                              <span className="text-xs text-slate-400">Bekor qilingan</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: DOCTORS */}
        {activeTab === "doctors" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(doctors.data ?? []).map((doc) => (
              <div
                key={doc.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <InitialsAvatar initials={doc.photoInitials} hue={doc.photoHue} size="md" />
                  <div>
                    <h3 className="font-bold text-slate-900">{doc.fullName}</h3>
                    <p className="text-xs text-slate-500">{doc.title}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
                  <p>
                    <span className="font-semibold">Tajriba: </span>
                    {doc.experienceYears} yil
                  </p>
                  <p>
                    <span className="font-semibold">Konsultatsiya: </span>
                    {formatSom(doc.consultationPrice)}
                  </p>
                  <p>
                    <span className="font-semibold">Reyting: </span>
                    {doc.rating} ({doc.reviewCount} sharh)
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SERVICES */}
        {activeTab === "services" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(services.data ?? []).map((srv) => (
              <div
                key={srv.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div>
                  <h3 className="font-bold text-slate-900">{srv.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{srv.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-500">{srv.durationMinutes} daqiqa</span>
                  <span className="font-bold text-Primary_app">{formatSom(srv.price)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
