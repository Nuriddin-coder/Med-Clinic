"use client";

import { Link } from "@/components";

export const Footer = () => (
  <footer className="mt-auto bg-footer text-white">
    <div className="container grid gap-10 py-12 md:grid-cols-4">
      <div className="md:col-span-2">
        <p className="text-xl font-bold">
          MED <span className="text-[#c9a6ff]">Clinic</span>
        </p>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-200">
          Onlayn tibbiy xizmatlar: shifokor tanlang, bo‘sh vaqtni ko‘ring va navbatsiz qabulga yoziling.
          Akkaunt ochish shart emas — faqat telefon raqamingiz kifoya.
        </p>
      </div>
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">Sahifalar</h2>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/doctors" className="text-slate-200 hover:text-[#c9a6ff]">
            Shifokorlar
          </Link>
          <Link href="/services" className="text-slate-200 hover:text-[#c9a6ff]">
            Xizmatlar
          </Link>
          <Link href="/appointments" className="text-slate-200 hover:text-[#c9a6ff]">
            Mening qabullarim
          </Link>
          <Link href="/book" className="text-slate-200 hover:text-[#c9a6ff]">
            Qabulga yozilish
          </Link>
        </div>
      </div>
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">Aloqa</h2>
        <p className="text-sm text-slate-200">Toshkent, Amir Temur 108</p>
        <a className="mt-2 block text-sm text-slate-200 hover:text-[#c9a6ff]" href="tel:+998712000808">
          +998 71 200 08 08
        </a>
        <a className="mt-1 block text-sm text-slate-200 hover:text-[#c9a6ff]" href="mailto:info@medclinic.uz">
          info@medclinic.uz
        </a>
      </div>
    </div>
    <div className="border-t border-white/10 py-4 text-center text-xs text-slate-300">
      © {new Date().getFullYear()} MED Clinic. Barcha huquqlar himoyalangan.
    </div>
  </footer>
);
