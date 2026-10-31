"use client";

import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Link, usePathname } from "@/components";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Bosh sahifa" },
  { href: "/doctors", label: "Shifokorlar" },
  { href: "/services", label: "Xizmatlar" },
  { href: "/appointments", label: "Mening qabullarim" },
  { href: "/about", label: "Klinika" },
  { href: "/contact", label: "Aloqa" },
];

export const Header = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="container flex h-[72px] items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-Primary_app text-sm font-extrabold text-white shadow-md shadow-Primary_app/25">
            MD
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            MED <span className="text-Primary_app">Clinic</span>
          </span>
        </Link>

        <nav aria-label="Asosiy menyu" className="hidden items-center gap-0.5 xl:gap-1.5 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-xl px-2.5 py-2 text-[13px] xl:text-sm font-semibold transition whitespace-nowrap shrink-0",
                isActive(item.href)
                  ? "bg-Primary_app/10 text-Primary_app"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <a
            href="tel:+998712000808"
            className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs xl:text-sm font-bold text-slate-800 transition hover:bg-slate-50 hover:text-Primary_app whitespace-nowrap shrink-0"
          >
            <Phone className="h-4 w-4 shrink-0 text-Primary_app" />
            <span className="whitespace-nowrap font-mono">+998 71 200 08 08</span>
          </a>
          <Button asChild size="sm" className="rounded-xl px-4 py-2 font-bold shadow-md shadow-Primary_app/20 whitespace-nowrap shrink-0">
            <Link href="/book">Qabulga yozilish</Link>
          </Button>
        </div>

        <button
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden hover:bg-slate-50"
          onClick={() => setOpen((value) => !value)}
          aria-label="Menyu"
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-md lg:hidden">
          <nav aria-label="Mobil menyu" className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
                  isActive(item.href)
                    ? "bg-Primary_app/10 text-Primary_app"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="mt-3 border-t border-slate-100 pt-3 flex flex-col gap-2">
              <a
                href="tel:+998712000808"
                className="flex items-center gap-2 px-2 text-sm font-bold text-slate-800"
              >
                <Phone className="h-4 w-4 text-Primary_app" />
                <span className="font-mono">+998 71 200 08 08</span>
              </a>
              <Button asChild className="w-full rounded-xl mt-1">
                <Link href="/book" onClick={() => setOpen(false)}>
                  Qabulga yozilish
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
