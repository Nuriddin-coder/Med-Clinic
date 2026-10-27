"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-bold text-blackColor">Xatolik yuz berdi</h2>
      <p className="mt-2 text-sm text-Navbar_Color">
        {error.message || "Kutilmagan xatolik"}
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl border border-Input_border bg-white px-5 py-2.5 text-sm font-semibold text-blackColor hover:bg-Light_background"
        >
          Qayta urinish
        </button>
        <Link
          href="/"
          className="rounded-xl bg-Primary_app px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#7424db]"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
}

