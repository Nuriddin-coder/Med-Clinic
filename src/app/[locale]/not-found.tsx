import Link from "next/link";

export default function LocaleNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold text-Primary_app">404</p>
      <h1 className="mt-4 text-2xl font-bold text-blackColor">Sahifa topilmadi</h1>
      <p className="mt-2 text-Navbar_Color">
        Siz izlagan sahifa mavjud emas yoki ko&apos;chirilgan.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-Primary_app px-6 py-3 text-sm font-semibold text-white hover:bg-[#7424db]"
      >
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}

