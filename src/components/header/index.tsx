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
    <header className="sticky top-0 z-50 border-b border-Input_border bg-white/95 backdrop-blur">
      <div className="container flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-Primary_app text-sm font-bold text-white">
            MD
          </span>
          <span className="text-lg font-bold text-blackColor">
            MED <span className="text-Primary_app">Clinic</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive(item.href)
                  ? "bg-Secondary text-Primary_app"
                  : "text-Navbar_Color hover:bg-Light_background hover:text-blackColor"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href="tel:+998712000808" className="inline-flex items-center gap-2 text-sm font-medium text-blackColor">
            <Phone className="h-4 w-4 text-Primary_app" />
            +998 71 200 08 08
          </a>
          <Button asChild>
            <Link href="/book">Qabulga yozilish</Link>
          </Button>
        </div>

        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-Input_border lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Menyu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-Input_border bg-white lg:hidden">
          <div className="container flex flex-col gap-1 py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium",
                  isActive(item.href) ? "bg-Secondary text-Primary_app" : "text-blackColor"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-2">
              <Link href="/book" onClick={() => setOpen(false)}>
                Qabulga yozilish
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
};
