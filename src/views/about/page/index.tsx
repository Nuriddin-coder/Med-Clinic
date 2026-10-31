"use client";

import { PageHero } from "@/components/clinic/page-hero";
import { PageLoader } from "@/components/ui/skeleton";
import { useClinicInfo, useSpecialties } from "@/hooks/clinic/use-clinic-query";

export const AboutPage = () => {
  const info = useClinicInfo();
  const specialties = useSpecialties();

  if (info.isLoading || specialties.isLoading) {
    return <PageLoader />;
  }

  const clinic = info.data;

  return (
    <div>
      <PageHero eyebrow="Klinika" title={clinic?.name ?? "MED Clinic"} description={clinic?.about} />
      <div className="container grid gap-8 py-10 lg:grid-cols-3">
        <section className="rounded-2xl border border-Input_border bg-white p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold">Nega MED Clinic?</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-Navbar_Color">
            <li>Onlayn yozilish: faqat haqiqiy bo‘sh vaqtlar.</li>
            <li>Shifokorlar ma’lumoti ochiq — tajriba, grafigi va bemor baholari.</li>
            <li>Qabul holatini klinika xodimlari boshqaradi, siz o‘zingiznikini bekor qila olasiz.</li>
            <li>Kirish va parol yo‘q. Identifikatsiya — telefon raqami.</li>
          </ul>
          <h2 className="mt-8 text-xl font-semibold">Yo‘nalishlar</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(specialties.data ?? []).map((item) => (
              <div key={item.id} className="rounded-xl bg-Light_background p-4">
                <p className="font-semibold text-blackColor">{item.name}</p>
                <p className="mt-1 text-sm text-Navbar_Color">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
        <aside className="h-fit rounded-2xl border border-Input_border bg-white p-6">
          <h2 className="text-lg font-semibold">Manzil</h2>
          <p className="mt-2 text-sm text-Navbar_Color">{clinic?.address}</p>
          <p className="mt-4 text-sm text-Navbar_Color">{clinic?.workingHoursLabel}</p>
          <div className="mt-4 space-y-1 text-sm font-medium">
            {(clinic?.phones ?? []).map((phone) => (
              <a key={phone} href={`tel:${phone}`} className="block text-Primary_app">
                {phone}
              </a>
            ))}
            <a href={`mailto:${clinic?.email}`} className="block text-Primary_app">
              {clinic?.email}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
};
