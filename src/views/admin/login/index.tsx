"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck, User } from "lucide-react";
import { useRouter } from "@/components";
import { Button } from "@/components/ui/button";
import { FieldShell, TextInput } from "@/components/ui/field";
import { toast } from "sonner";
import { loginAdmin } from "@/lib/api";

export const AdminLoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error("Username va parolni kiriting");
      return;
    }

    if (password.length < 6) {
      toast.error("Parol kamida 6 ta belgidan iborat bo‘lishi kerak");
      return;
    }

    setLoading(true);
    try {
      const res = await loginAdmin({ username: username.trim(), password });
      toast.success("Tizimga muvaffaqiyatli kirdingiz!");
      localStorage.setItem("med_admin_auth", JSON.stringify({ username, loggedAt: Date.now() }));
      router.push("/admin");
    } catch (error: any) {
      // If backend credentials mismatch but user is testing UI, give fallback hint or error
      toast.error(error.message || "Username yoki parol noto‘g‘ri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-Primary_app/10 text-Primary_app">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Admin Panelga kirish</h1>
          <p className="mt-1 text-xs text-slate-500">
            Klinika boshqaruv tizimi va qabullarni nazorat qilish
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <FieldShell label="Foydalanuvchi nomi (Username)">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <TextInput
                className="pl-10"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
          </FieldShell>

          <FieldShell label="Maxfiy parol">
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <TextInput
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10"
                placeholder="Kamida 6 ta belgi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FieldShell>

          <div className="rounded-xl bg-blue-50/70 p-3 text-xs text-blue-800">
            <span className="font-semibold">Backend API: </span>
            <span>POST /auth/login bilan to‘liq integratsiyalangan.</span>
          </div>

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full rounded-2xl font-semibold shadow-lg shadow-Primary_app/25"
          >
            {loading ? "Tekshirilmoqda..." : "Kirish &rarr;"}
          </Button>
        </form>
      </div>
    </div>
  );
};

