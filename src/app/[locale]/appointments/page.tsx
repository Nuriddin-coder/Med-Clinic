import { Suspense } from "react";
import { PageLoader } from "@/components/ui/skeleton";
import { AppointmentsPage } from "@/views";

export default function AppointmentsRoute() {
  return (
    <Suspense fallback={<PageLoader label="Qabullar yuklanmoqda..." />}>
      <AppointmentsPage />
    </Suspense>
  );
}
