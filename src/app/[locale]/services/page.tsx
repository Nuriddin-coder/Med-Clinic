import { Suspense } from "react";
import { PageLoader } from "@/components/ui/skeleton";
import { ServicesPage } from "@/views";

export default function ServicesRoute() {
  return (
    <Suspense fallback={<PageLoader label="Xizmatlar yuklanmoqda..." />}>
      <ServicesPage />
    </Suspense>
  );
}
